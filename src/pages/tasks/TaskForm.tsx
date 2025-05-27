import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, User, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.string().min(1, 'Category is required'),
  assignedTo: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export const TaskForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: '',
      assignedTo: '',
    }
  });

  const onSubmit = async (data: TaskFormValues) => {
    try {
      // Here you would normally save to your backend
      console.log('Task data:', data);
      navigate('/tasks');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate('/tasks')}
          leftIcon={<ArrowLeft size={16} />}
        >
          Back to Tasks
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Add Task</h1>
          <p className="text-sm text-gray-500">Add a new task to your event</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Task Title"
              placeholder="e.g., Book venue for ceremony"
              error={errors.title?.message}
              {...register('title')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Due Date"
                type="datetime-local"
                leftIcon={<Calendar size={18} />}
                error={errors.dueDate?.message}
                {...register('dueDate')}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  {...register('priority')}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-error-600">{errors.priority.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Category"
                placeholder="e.g., Venue, Catering, Decoration"
                error={errors.category?.message}
                {...register('category')}
              />

              <Input
                label="Assigned To (optional)"
                placeholder="e.g., John Smith"
                leftIcon={<User size={18} />}
                error={errors.assignedTo?.message}
                {...register('assignedTo')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                rows={4}
                placeholder="Add any additional details about this task"
                {...register('description')}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/tasks')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                Add Task
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};