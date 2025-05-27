import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Mail, Phone, Check, X, Search, Filter, Download, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  rsvpStatus: 'pending' | 'confirmed' | 'declined';
  plusOnes: number;
  dietaryRestrictions?: string;
  notes?: string;
}

const dummyGuests: Guest[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    rsvpStatus: 'confirmed',
    plusOnes: 1,
    dietaryRestrictions: 'Vegetarian',
    notes: 'Allergic to nuts'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '(555) 234-5678',
    rsvpStatus: 'pending',
    plusOnes: 0
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '(555) 345-6789',
    rsvpStatus: 'declined',
    plusOnes: 0,
    notes: 'Unable to attend due to prior commitment'
  }
];

export const GuestList = () => {
  const [guests, setGuests] = useState<Guest[]>(dummyGuests);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'declined'>('all');

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || guest.rsvpStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Guest['rsvpStatus']) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'declined':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getTotalCount = () => {
    return filteredGuests.reduce((acc, guest) => acc + 1 + guest.plusOnes, 0);
  };

  const handleSendReminder = (guestId: string) => {
    // Implement reminder logic
    console.log('Sending reminder to guest:', guestId);
  };

  const handleUpdateStatus = (guestId: string, status: Guest['rsvpStatus']) => {
    setGuests(prev => 
      prev.map(guest => 
        guest.id === guestId ? { ...guest, rsvpStatus: status } : guest
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Guest List</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your event guests and RSVPs
          </p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" leftIcon={<Upload size={20} />}>
            Import
          </Button>
          <Button variant="outline" leftIcon={<Download size={20} />}>
            Export
          </Button>
          <Link to="/guests/new">
            <Button leftIcon={<PlusCircle size={20} />}>
              Add Guest
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-lg bg-primary-50">
            <p className="text-sm text-primary-600 font-medium">Total Guests</p>
            <p className="mt-2 text-3xl font-bold text-primary-700">{getTotalCount()}</p>
          </div>
          <div className="p-4 rounded-lg bg-success-50">
            <p className="text-sm text-success-600 font-medium">Confirmed</p>
            <p className="mt-2 text-3xl font-bold text-success-700">
              {filteredGuests.filter(g => g.rsvpStatus === 'confirmed').length}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-warning-50">
            <p className="text-sm text-warning-600 font-medium">Pending</p>
            <p className="mt-2 text-3xl font-bold text-warning-700">
              {filteredGuests.filter(g => g.rsvpStatus === 'pending').length}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-error-50">
            <p className="text-sm text-error-600 font-medium">Declined</p>
            <p className="mt-2 text-3xl font-bold text-error-700">
              {filteredGuests.filter(g => g.rsvpStatus === 'declined').length}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search guests..."
            leftIcon={<Search size={20} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredGuests.map((guest) => (
          <Card key={guest.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-lg">
                      {guest.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{guest.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Mail size={16} className="mr-1" />
                        {guest.email}
                      </div>
                      {guest.phone && (
                        <div className="flex items-center">
                          <Phone size={16} className="mr-1" />
                          {guest.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={getStatusColor(guest.rsvpStatus)}>
                    {guest.rsvpStatus.charAt(0).toUpperCase() + guest.rsvpStatus.slice(1)}
                  </Badge>
                  {guest.plusOnes > 0 && (
                    <Badge variant="secondary">
                      +{guest.plusOnes} Guest{guest.plusOnes > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {guest.dietaryRestrictions && (
                    <Badge variant="outline">
                      {guest.dietaryRestrictions}
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  {guest.rsvpStatus === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendReminder(guest.id)}
                    >
                      Send Reminder
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Check size={16} />}
                    onClick={() => handleUpdateStatus(guest.id, 'confirmed')}
                  >
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<X size={16} />}
                    onClick={() => handleUpdateStatus(guest.id, 'declined')}
                  >
                    Decline
                  </Button>
                </div>
              </div>
              
              {guest.notes && (
                <p className="mt-2 text-sm text-gray-500">
                  Note: {guest.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};