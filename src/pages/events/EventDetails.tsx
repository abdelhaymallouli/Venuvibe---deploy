import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../lib/utils';

// Using the same dummy events from EventList component
const dummyEvents = [
  {
    id: '1',
    title: 'Summer Wedding Reception',
    type: 'wedding',
    date: '2025-07-15T18:00:00Z',
    location: 'Crystal Gardens',
    description: 'An elegant evening wedding reception with full catering service and live music. The venue offers a beautiful garden setting with indoor backup space.',
    status: 'planning',
    guestCount: 150,
    bannerImage: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg'
  },
  {
    id: '2',
    title: 'Corporate Annual Meeting',
    type: 'corporate',
    date: '2025-03-20T09:00:00Z',
    location: 'Grand Conference Center',
    description: 'Annual shareholders meeting followed by networking lunch. Presentations and annual report review.',
    status: 'confirmed',
    guestCount: 200,
    bannerImage: 'https://images.pexels.com/photos/7175435/pexels-photo-7175435.jpeg'
  },
  {
    id: '3',
    title: "Sarah's Sweet 16",
    type: 'birthday',
    date: '2025-04-10T17:00:00Z',
    location: 'Sunset Lounge',
    description: 'Sweet sixteen birthday celebration with DJ, photo booth, and dessert bar.',
    status: 'planning',
    guestCount: 75,
    bannerImage: 'https://images.pexels.com/photos/2072181/pexels-photo-2072181.jpeg'
  }
];

export const EventDetails = () => {
  const { id } = useParams();
  const event = dummyEvents.find(e => e.id === id);

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
          <p className="mt-2 text-gray-600">The event you're looking for doesn't exist.</p>
          <Link to="/events" className="mt-4 inline-block">
            <Button variant="outline" leftIcon={<ArrowLeft size={16} />}>
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'primary';
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/events">
          <Button variant="outline" leftIcon={<ArrowLeft size={16} />}>
            Back to Events
          </Button>
        </Link>
        <Badge variant={getStatusColor(event.status)}>
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <div className="h-64 sm:h-96 relative">
              <img
                src={event.bannerImage}
                alt={event.title}
                className="w-full h-full object-cover rounded-t-xl"
              />
            </div>
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{event.guestCount} guests</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">About this Event</h2>
                <p className="text-gray-600">{event.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button variant="outline" fullWidth>
                  Edit Event
                </Button>
                <Button variant="outline" fullWidth>
                  Manage Guests
                </Button>
                <Button variant="outline" fullWidth>
                  View Budget
                </Button>
                <Button variant="outline" fullWidth>
                  Task List
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Event Type</h3>
                  <p className="mt-1 text-gray-900">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                  <p className="mt-1 text-gray-900">{formatDate(event.date)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1 text-gray-900">{event.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Guest Count</h3>
                  <p className="mt-1 text-gray-900">{event.guestCount} people</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};