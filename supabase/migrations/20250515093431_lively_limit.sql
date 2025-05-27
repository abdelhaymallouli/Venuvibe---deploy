/*
  # Initial Schema for VenuVibe

  1. New Tables
    - `profiles` - User profiles with contact information
    - `events` - Event details including title, date, location
    - `vendors` - Vendor information including category, contact details
    - `event_vendors` - Junction table connecting events to vendors
    - `guests` - Guest information including RSVP status
    - `budget_items` - Budget tracking for events
    - `tasks` - Task management for events
    - `event_templates` - Pre-made event templates
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table to store user profile information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  updated_at TIMESTAMPTZ,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  phone TEXT
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  location TEXT,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  template_id UUID,
  banner_image TEXT,
  status TEXT DEFAULT 'planning'
);

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  rating NUMERIC,
  image_url TEXT
);

-- Create event_vendors junction table
CREATE TABLE IF NOT EXISTS event_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  price NUMERIC,
  notes TEXT
);

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  rsvp_status TEXT DEFAULT 'pending',
  plus_ones INTEGER DEFAULT 0,
  notes TEXT
);

-- Create budget_items table
CREATE TABLE IF NOT EXISTS budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events ON DELETE CASCADE,
  category TEXT NOT NULL,
  item TEXT NOT NULL,
  estimated_cost NUMERIC NOT NULL,
  actual_cost NUMERIC,
  paid BOOLEAN DEFAULT false,
  notes TEXT
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium'
);

-- Create event_templates table
CREATE TABLE IF NOT EXISTS event_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  tasks JSONB,
  budget_categories JSONB,
  banner_image TEXT
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for events
CREATE POLICY "Users can view their own events"
  ON events
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events"
  ON events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
  ON events
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
  ON events
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for vendors
CREATE POLICY "Vendors are viewable by all authenticated users"
  ON vendors
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for event_vendors
CREATE POLICY "Users can view vendors for their own events"
  ON event_vendors
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage vendors for their own events"
  ON event_vendors
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_id
      AND events.user_id = auth.uid()
    )
  );

-- Create policies for guests
CREATE POLICY "Users can view guests for their own events"
  ON guests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage guests for their own events"
  ON guests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_id
      AND events.user_id = auth.uid()
    )
  );

-- Create policies for budget_items
CREATE POLICY "Users can view budget items for their own events"
  ON budget_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage budget items for their own events"
  ON budget_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_id
      AND events.user_id = auth.uid()
    )
  );

-- Create policies for tasks
CREATE POLICY "Users can view tasks for their own events"
  ON tasks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage tasks for their own events"
  ON tasks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_id
      AND events.user_id = auth.uid()
    )
  );

-- Create policies for event_templates
CREATE POLICY "Templates are viewable by all authenticated users"
  ON event_templates
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert default event templates
INSERT INTO event_templates (name, type, description, tasks, budget_categories, banner_image)
VALUES
  (
    'Wedding Celebration', 
    'wedding',
    'A complete template for planning your dream wedding',
    '[
      {"title": "Book venue", "priority": "high", "description": "Find and book the perfect wedding venue"},
      {"title": "Hire caterer", "priority": "high", "description": "Choose a caterer for your wedding menu"},
      {"title": "Order wedding cake", "priority": "medium", "description": "Order the wedding cake from a bakery"},
      {"title": "Book photographer", "priority": "high", "description": "Hire a photographer for your wedding day"},
      {"title": "Send invitations", "priority": "high", "description": "Design and send wedding invitations"},
      {"title": "Book DJ or band", "priority": "medium", "description": "Arrange music for ceremony and reception"},
      {"title": "Arrange flowers", "priority": "medium", "description": "Order flowers for ceremony and reception"},
      {"title": "Plan honeymoon", "priority": "medium", "description": "Book accommodation and transport for honeymoon"}
    ]',
    '[
      {"category": "Venue", "percentage": 30},
      {"category": "Catering", "percentage": 20},
      {"category": "Photography", "percentage": 10},
      {"category": "Attire", "percentage": 10},
      {"category": "Decorations", "percentage": 10},
      {"category": "Entertainment", "percentage": 10},
      {"category": "Miscellaneous", "percentage": 10}
    ]',
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'Birthday Party', 
    'birthday',
    'Everything you need to plan a fun birthday celebration',
    '[
      {"title": "Choose a venue", "priority": "high", "description": "Find and book a party venue"},
      {"title": "Send invitations", "priority": "high", "description": "Create and send party invitations"},
      {"title": "Order cake", "priority": "medium", "description": "Order birthday cake from a bakery"},
      {"title": "Plan activities", "priority": "medium", "description": "Plan games and entertainment for the party"},
      {"title": "Arrange decorations", "priority": "medium", "description": "Buy or make party decorations"},
      {"title": "Order food", "priority": "high", "description": "Arrange catering or prepare food menu"}
    ]',
    '[
      {"category": "Venue", "percentage": 25},
      {"category": "Food & Drinks", "percentage": 30},
      {"category": "Decorations", "percentage": 15},
      {"category": "Entertainment", "percentage": 20},
      {"category": "Miscellaneous", "percentage": 10}
    ]',
    'https://images.pexels.com/photos/2072181/pexels-photo-2072181.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'Corporate Event', 
    'corporate',
    'A professional template for business meetings and corporate gatherings',
    '[
      {"title": "Book venue", "priority": "high", "description": "Find and book a suitable corporate venue"},
      {"title": "Arrange catering", "priority": "high", "description": "Organize food and beverages for attendees"},
      {"title": "Send invitations", "priority": "high", "description": "Send formal invitations to attendees"},
      {"title": "Book speakers", "priority": "medium", "description": "Arrange speakers or presenters for the event"},
      {"title": "Organize equipment", "priority": "medium", "description": "Arrange necessary AV equipment"},
      {"title": "Create schedule", "priority": "medium", "description": "Develop a detailed event schedule"}
    ]',
    '[
      {"category": "Venue", "percentage": 30},
      {"category": "Catering", "percentage": 25},
      {"category": "Speakers", "percentage": 15},
      {"category": "Equipment", "percentage": 15},
      {"category": "Materials", "percentage": 10},
      {"category": "Miscellaneous", "percentage": 5}
    ]',
    'https://images.pexels.com/photos/7175435/pexels-photo-7175435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'Baby Shower', 
    'baby_shower',
    'Plan a perfect baby shower celebration',
    '[
      {"title": "Choose a venue", "priority": "high", "description": "Find and book a suitable venue"},
      {"title": "Send invitations", "priority": "high", "description": "Create and send baby shower invitations"},
      {"title": "Plan games", "priority": "medium", "description": "Prepare fun games for guests"},
      {"title": "Arrange decorations", "priority": "medium", "description": "Buy or make themed decorations"},
      {"title": "Order food and cake", "priority": "high", "description": "Arrange catering and desserts"}
    ]',
    '[
      {"category": "Venue", "percentage": 20},
      {"category": "Food & Drinks", "percentage": 30},
      {"category": "Decorations", "percentage": 25},
      {"category": "Games & Activities", "percentage": 15},
      {"category": "Favors", "percentage": 10}
    ]',
    'https://images.pexels.com/photos/131044/pexels-photo-131044.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  );

-- Insert sample vendors
INSERT INTO vendors (name, category, description, contact_email, website, rating, image_url)
VALUES
  (
    'Eternal Moments Photography',
    'photography',
    'Professional photography services for weddings and special events',
    'contact@eternalmoments.com',
    'https://eternalmoments.com',
    4.8,
    'https://images.pexels.com/photos/3584998/pexels-photo-3584998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'Gourmet Delights Catering',
    'catering',
    'Full-service catering for all types of events with customizable menus',
    'events@gourmetdelights.com',
    'https://gourmetdelights.com',
    4.7,
    'https://images.pexels.com/photos/5908226/pexels-photo-5908226.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'Harmony Event Spaces',
    'venue',
    'Beautiful venues for weddings, corporate events, and celebrations',
    'bookings@harmonyspaces.com',
    'https://harmonyspaces.com',
    4.9,
    'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'Beat Masters Entertainment',
    'entertainment',
    'Professional DJs and live music for all events',
    'info@beatmasters.com',
    'https://beatmasters.com',
    4.6,
    'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'Bloom & Petal Florists',
    'florist',
    'Custom floral arrangements for weddings and special occasions',
    'orders@bloomandpetal.com',
    'https://bloomandpetal.com',
    4.8,
    'https://images.pexels.com/photos/2111171/pexels-photo-2111171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  (
    'Sweet Creations Bakery',
    'bakery',
    'Custom cakes and desserts for all celebrations',
    'orders@sweetcreations.com',
    'https://sweetcreations.com',
    4.7,
    'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  );