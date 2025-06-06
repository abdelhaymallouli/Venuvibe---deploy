import React, { useState } from 'react';
import { Search, Star, Phone, Mail, Globe } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface Vendor {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  price: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  image: string;
}

const dummyVendors: Vendor[] = [
  {
    id: '1',
    name: 'Elegant Events Venue',
    category: 'venue',
    description: 'Luxury event space with modern amenities',
    rating: 4.8,
    price: '$$$',
    contactEmail: 'info@elegantevents.com',
    contactPhone: '(555) 123-4567',
    website: 'www.elegantevents.com',
    image: 'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg'
  },
  {
    id: '2',
    name: 'Divine Catering Co.',
    category: 'catering',
    description: 'Gourmet catering for all occasions',
    rating: 4.9,
    price: '$$',
    contactEmail: 'events@divinecatering.com',
    contactPhone: '(555) 234-5678',
    website: 'www.divinecatering.com',
    image: 'https://images.pexels.com/photos/5908226/pexels-photo-5908226.jpeg'
  },
  {
    id: '3',
    name: 'Bloom & Petal',
    category: 'florist',
    description: 'Creative floral designs and arrangements',
    rating: 4.7,
    price: '$$',
    contactEmail: 'hello@bloomandpetal.com',
    contactPhone: '(555) 345-6789',
    website: 'www.bloomandpetal.com',
    image: 'https://images.pexels.com/photos/2111171/pexels-photo-2111171.jpeg'
  }
];

export const VendorList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minRating, setMinRating] = useState(0);

  const filteredVendors = dummyVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    const matchesRating = vendor.rating >= minRating;
    return matchesSearch && matchesCategory && matchesRating;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vendor Directory</h1>
        <p className="mt-1 text-sm text-gray-500">
          Find the perfect vendors for your event
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder="Search vendors..."
          leftIcon={<Search size={20} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="venue">Venues</option>
          <option value="catering">Catering</option>
          <option value="florist">Florists</option>
          <option value="photography">Photography</option>
          <option value="entertainment">Entertainment</option>
        </select>

        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
        >
          <option value="0">All Ratings</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="overflow-hidden">
            <div className="h-48 relative">
              <img
                src={vendor.image}
                alt={vendor.name}
                className="w-full h-full object-cover"
              />
              <Badge
                variant="primary"
                className="absolute top-4 right-4"
              >
                {vendor.price}
              </Badge>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{vendor.name}</h3>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{vendor.rating}</span>
                </div>
              </div>
              <Badge variant="secondary" className="mb-3">
                {vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)}
              </Badge>
              <p className="text-gray-600 text-sm mb-4">{vendor.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-500">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${vendor.contactEmail}`} className="hover:text-primary-600">
                    {vendor.contactEmail}
                  </a>
                </div>
                <div className="flex items-center text-gray-500">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href={`tel:${vendor.contactPhone}`} className="hover:text-primary-600">
                    {vendor.contactPhone}
                  </a>
                </div>
                <div className="flex items-center text-gray-500">
                  <Globe className="w-4 h-4 mr-2" />
                  <a
                    href={`https://${vendor.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-600"
                  >
                    {vendor.website}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};