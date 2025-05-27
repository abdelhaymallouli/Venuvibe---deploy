import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Wallet, 
  Clock,
  PlusCircle,
  ChevronRight,
  BarChart4
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getEvents, Event } from '../lib/storage';
import { formatDate, formatCurrency } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalGuests: number;
  totalBudget: number;
  completedTasks: number;
  pendingTasks: number;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    totalGuests: 0,
    totalBudget: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const eventsData = getEvents(user?.id || '');
      setEvents(eventsData);

      setStats({
        totalEvents: eventsData.length,
        upcomingEvents: eventsData.filter(e => new Date(e.date) > new Date()).length,
        totalGuests: 45,
        totalBudget: 7500,
        completedTasks: 8,
        pendingTasks: 12,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const demoEvents: Event[] = [
    {
      id: 'demo-1',
      title: 'Summer Wedding',
      date: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Sunset Beach Resort',
      status: 'planning',
      banner_image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 'demo-2',
      title: 'Birthday Party',
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Home',
      status: 'planning',
      banner_image: 'https://images.pexels.com/photos/2072181/pexels-photo-2072181.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 'demo-3',
      title: 'Company Anniversary',
      date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Grand Plaza Hotel',
      status: 'planning',
      banner_image: 'https://images.pexels.com/photos/7175435/pexels-photo-7175435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];

  const displayEvents = events.length > 0 ? events : demoEvents;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'primary';
      case 'scheduled':
        return 'secondary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Welcome back, {user?.email?.split('@')[0] || 'User'}! Here's what's happening with your events.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {isLoading ? '-' : stats.upcomingEvents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-md bg-secondary-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Guests</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {isLoading ? '-' : stats.totalGuests}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-md bg-success-100 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Budget</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {isLoading ? '-' : formatCurrency(stats.totalBudget)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-md bg-warning-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tasks</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {isLoading ? '-' : `${stats.completedTasks}/${stats.completedTasks + stats.pendingTasks}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
          <Link to="/events/new">
            <Button 
              size="sm" 
              leftIcon={<PlusCircle size={16} />}
            >
              Create Event
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayEvents.map((event) => (
            <Card key={event.id} variant="default" isHoverable isPressable className="overflow-hidden">
              <div className="h-40 bg-gray-200 relative">
                {event.banner_image ? (
                  <img 
                    src={event.banner_image} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">{event.title[0]}</span>
                  </div>
                )}
                <Badge 
                  variant={getStatusColor(event.status)} 
                  className="absolute top-3 right-3"
                >
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-1 text-gray-900">{event.title}</h3>
                <div className="text-sm text-gray-500 mb-2">
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(event.date, 'PPP')}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Link to={`/events/${event.id}`} className="flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm">
                    View details <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Link to="/events">
            <Button variant="outline">
              View all events
            </Button>
          </Link>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Budget Overview</h2>
          <Link to="/budget">
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<BarChart4 size={16} />}
            >
              Budget Details
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Budget Allocation</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Venue</span>
                      <span className="text-sm font-medium text-gray-700">$3,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Catering</span>
                      <span className="text-sm font-medium text-gray-700">$2,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-secondary-600 h-2 rounded-full" style={{ width: '26.7%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Decorations</span>
                      <span className="text-sm font-medium text-gray-700">$1,500</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-accent-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Photography</span>
                      <span className="text-sm font-medium text-gray-700">$1,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-success-500 h-2 rounded-full" style={{ width: '13.3%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Budget Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Total Budget</span>
                      <span className="text-sm font-medium">{formatCurrency(7500)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Amount Spent</span>
                      <span className="text-sm font-medium">{formatCurrency(2200)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Remaining</span>
                      <span className="text-sm font-medium text-success-600">{formatCurrency(5300)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-500">Budget Progress</span>
                      <span className="text-xs font-medium text-gray-500">29%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: '29%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Tasks */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
          <Link to="/tasks">
            <Button variant="outline" size="sm">
              See all tasks
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Book caterer for birthday party</p>
                    <p className="text-xs text-gray-500">Due in 3 days</p>
                  </div>
                </div>
                <Badge variant="primary">High</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Send invitations for the wedding</p>
                    <p className="text-xs text-gray-500">Due in 7 days</p>
                  </div>
                </div>
                <Badge variant="secondary">Medium</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Order flowers for company anniversary</p>
                    <p className="text-xs text-gray-500">Due in 14 days</p>
                  </div>
                </div>
                <Badge variant="warning">Low</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Finalize menu with vendor</p>
                    <p className="text-xs text-gray-500">Due in 10 days</p>
                  </div>
                </div>
                <Badge variant="primary">High</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};