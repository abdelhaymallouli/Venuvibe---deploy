import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Calendar, FileText, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';

const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  item: z.string().min(1, 'Item name is required'),
  estimatedCost: z.string().transform(val => parseFloat(val)),
  actualCost: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().optional(),
  vendor: z.string().optional(),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

export const BudgetForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: '',
      item: '',
      estimatedCost: '',
      actualCost: '',
      dueDate: '',
      notes: '',
      vendor: '',
    }
  });

  const onSubmit = async (data: BudgetFormValues) => {
    try {
      // Here you would normally save to your backend
      console.log('Budget item data:', data);
      navigate('/budget');
    } catch (error) {
      console.error('Error saving budget item:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate('/budget')}
          leftIcon={<ArrowLeft size={16} />}
        >
          Back to Budget
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Add Budget Item</h1>
          <p className="text-sm text-gray-500">Add a new item to your event budget</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Category"
                placeholder="e.g., Venue, Catering, Decoration"
                error={errors.category?.message}
                {...register('category')}
              />

              <Input
                label="Item Name"
                placeholder="e.g., Reception Hall Rental"
                error={errors.item?.message}
                {...register('item')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Estimated Cost"
                type="number"
                step="0.01"
                leftIcon={<DollarSign size={18} />}
                error={errors.estimatedCost?.message}
                {...register('estimatedCost')}
              />

              <Input
                label="Actual Cost (if known)"
                type="number"
                step="0.01"
                leftIcon={<DollarSign size={18} />}
                error={errors.actualCost?.message}
                {...register('actualCost')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Due Date"
                type="date"
                leftIcon={<Calendar size={18} />}
                error={errors.dueDate?.message}
                {...register('dueDate')}
              />

              <Input
                label="Vendor (optional)"
                placeholder="e.g., Crystal Gardens"
                error={errors.vendor?.message}
                {...register('vendor')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                rows={4}
                placeholder="Add any additional notes or details"
                {...register('notes')}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/budget')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                Add Budget Item
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};