import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, User, Users, FileText, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';

const guestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  plusOnes: z.string().transform(val => parseInt(val, 10)),
  dietaryRestrictions: z.string().optional(),
  notes: z.string().optional(),
});

type GuestFormValues = z.infer<typeof guestSchema>;

export const GuestForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      plusOnes: '0',
      dietaryRestrictions: '',
      notes: '',
    }
  });

  const onSubmit = async (data: GuestFormValues) => {
    try {
      // Here you would normally save to your backend
      console.log('Guest data:', data);
      navigate('/guests');
    } catch (error) {
      console.error('Error saving guest:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate('/guests')}
          leftIcon={<ArrowLeft size={16} />}
        >
          Back to Guest List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Add Guest</h1>
          <p className="text-sm text-gray-500">Add a new guest to your event</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full Name"
              leftIcon={<User size={18} />}
              error={errors.name?.message}
              {...register('name')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                type="email"
                leftIcon={<Mail size={18} />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Phone (optional)"
                type="tel"
                leftIcon={<Phone size={18} />}
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Additional Guests"
                type="number"
                min="0"
                leftIcon={<Users size={18} />}
                error={errors.plusOnes?.message}
                {...register('plusOnes')}
              />

              <Input
                label="Dietary Restrictions (optional)"
                placeholder="e.g., Vegetarian, Gluten-free"
                error={errors.dietaryRestrictions?.message}
                {...register('dietaryRestrictions')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                rows={4}
                placeholder="Add any additional notes about this guest"
                {...register('notes')}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/guests')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                Add Guest
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};