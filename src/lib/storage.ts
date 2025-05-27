import { v4 as uuidv4 } from 'uuid';

// Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Event {
  id: string;
  created_at: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  user_id: string;
  template_id?: string;
  banner_image?: string;
  status: string;
}

// Local Storage Keys
const STORAGE_KEYS = {
  USER: 'venuvibe_user',
  EVENTS: 'venuvibe_events',
};

// Auth Functions
export const signUp = async (email: string, password: string) => {
  // Simple validation
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Check if user exists
  const existingUsers = getUsers();
  if (existingUsers.find(u => u.email === email)) {
    throw new Error('User already exists');
  }

  // Create new user
  const user: User = {
    id: uuidv4(),
    email,
  };

  // Store user
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  return { user };
};

export const signIn = async (email: string, password: string) => {
  // Simple validation
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Check if user exists
  const existingUsers = getUsers();
  const user = existingUsers.find(u => u.email === email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Store current user
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  return { user };
};

export const signOut = async () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const getCurrentUser = async () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  return { 
    user: userStr ? JSON.parse(userStr) : null,
    error: null
  };
};

// Event Functions
export const getEvents = (userId: string): Event[] => {
  const eventsStr = localStorage.getItem(STORAGE_KEYS.EVENTS);
  const events: Event[] = eventsStr ? JSON.parse(eventsStr) : [];
  return events.filter(event => event.user_id === userId);
};

export const createEvent = (event: Omit<Event, 'id' | 'created_at'>): Event => {
  const events = getAllEvents();
  const newEvent: Event = {
    ...event,
    id: uuidv4(),
    created_at: new Date().toISOString(),
  };
  
  events.push(newEvent);
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  return newEvent;
};

export const updateEvent = (event: Event): Event => {
  const events = getAllEvents();
  const index = events.findIndex(e => e.id === event.id);
  
  if (index === -1) {
    throw new Error('Event not found');
  }
  
  events[index] = event;
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  return event;
};

export const deleteEvent = (eventId: string): void => {
  const events = getAllEvents();
  const filteredEvents = events.filter(e => e.id !== eventId);
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(filteredEvents));
};

// Helper Functions
const getUsers = (): User[] => {
  const usersStr = localStorage.getItem('venuvibe_users');
  return usersStr ? JSON.parse(usersStr) : [];
};

const getAllEvents = (): Event[] => {
  const eventsStr = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return eventsStr ? JSON.parse(eventsStr) : [];
};