import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, DollarSign, PieChart, BarChart, Download, Upload, ChevronDown, Trash2, XCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'react-hot-toast';

interface BudgetCategory {
  id: string;
  name: string;
  plannedAmount: number;
  actualAmount: number;
  items: BudgetItem[];
}

interface BudgetItem {
  id: string;
  name: string;
  plannedAmount: number;
  actualAmount: number;
  paid: boolean;
  vendor?: string;
  dueDate?: string;
  notes?: string;
}

const dummyBudget: BudgetCategory[] = [
  {
    id: '1',
    name: 'Venue',
    plannedAmount: 5000,
    actualAmount: 4800,
    items: [
      {
        id: '1-1',
        name: 'Reception Hall',
        plannedAmount: 4000,
        actualAmount: 3800,
        paid: true,
        vendor: 'Crystal Gardens',
        dueDate: '2025-06-15'
      },
      {
        id: '1-2',
        name: 'Ceremony Space',
        plannedAmount: 1000,
        actualAmount: 1000,
        paid: true,
        vendor: 'Crystal Gardens',
        dueDate: '2025-06-15'
      }
    ]
  },
  {
    id: '2',
    name: 'Catering',
    plannedAmount: 8000,
    actualAmount: 7500,
    items: [
      {
        id: '2-1',
        name: 'Main Course',
        plannedAmount: 5000,
        actualAmount: 4800,
        paid: true,
        vendor: 'Gourmet Delights',
        dueDate: '2025-06-01'
      },
      {
        id: '2-2',
        name: 'Appetizers',
        plannedAmount: 2000,
        actualAmount: 1900,
        paid: true,
        vendor: 'Gourmet Delights',
        dueDate: '2025-06-01'
      },
      {
        id: '2-3',
        name: 'Dessert',
        plannedAmount: 1000,
        actualAmount: 800,
        paid: false,
        vendor: 'Sweet Treats Bakery',
        dueDate: '2025-06-10'
      }
    ]
  },
  {
    id: '3',
    name: 'Decorations',
    plannedAmount: 3000,
    actualAmount: 2800,
    items: [
      {
        id: '3-1',
        name: 'Flowers',
        plannedAmount: 2000,
        actualAmount: 1900,
        paid: true,
        vendor: 'Bloom & Petal',
        dueDate: '2025-06-14'
      },
      {
        id: '3-2',
        name: 'Lighting',
        plannedAmount: 1000,
        actualAmount: 900,
        paid: false,
        vendor: 'Event Lights Co.',
        dueDate: '2025-06-14'
      }
    ]
  }
];

export const BudgetTracker = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>(dummyBudget);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === categoryId
          ? {
              ...category,
              items: category.items.filter(item => item.id !== itemId)
            }
          : category
      )
    );
    toast.success('Budget item deleted successfully');
  };

  const handleTogglePaid = (categoryId: string, itemId: string) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId
                  ? { ...item, paid: !item.paid }
                  : item
              )
            }
          : category
      )
    );
    toast.success('Payment status updated');
  };

  const getTotalPlanned = () => {
    return categories.reduce((total, category) => total + category.plannedAmount, 0);
  };

  const getTotalActual = () => {
    return categories.reduce((total, category) => total + category.actualAmount, 0);
  };

  const getTotalRemaining = () => {
    return getTotalPlanned() - getTotalActual();
  };

  const getProgressPercentage = () => {
    return (getTotalActual() / getTotalPlanned()) * 100;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Tracker</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your event budget
          </p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" leftIcon={<Upload size={20} />}>
            Import
          </Button>
          <Button variant="outline" leftIcon={<Download size={20} />}>
            Export
          </Button>
          <Link to="/budget/new">
            <Button leftIcon={<PlusCircle size={20} />}>
              Add Item
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Budget</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(getTotalPlanned())}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-lg bg-secondary-100 flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Spent</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(getTotalActual())}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-lg bg-success-100 flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Remaining</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(getTotalRemaining())}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-lg bg-warning-100 flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Progress</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {Math.round(getProgressPercentage())}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <Badge variant="secondary" className="ml-4">
                    {category.items.length} items
                  </Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Planned</p>
                    <p className="font-medium">{formatCurrency(category.plannedAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Actual</p>
                    <p className="font-medium">{formatCurrency(category.actualAmount)}</p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transform transition-transform ${
                      expandedCategories.includes(category.id) ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {expandedCategories.includes(category.id) && (
                <div className="mt-6">
                  <div className="border-t border-gray-200 -mx-6 px-6 pt-4">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left text-sm font-medium text-gray-500">Item</th>
                          <th className="text-left text-sm font-medium text-gray-500">Vendor</th>
                          <th className="text-right text-sm font-medium text-gray-500">Planned</th>
                          <th className="text-right text-sm font-medium text-gray-500">Actual</th>
                          <th className="text-right text-sm font-medium text-gray-500">Status</th>
                          <th className="text-right text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {category.items.map((item) => (
                          <tr key={item.id}>
                            <td className="py-4">
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                {item.dueDate && (
                                  <p className="text-sm text-gray-500">
                                    Due: {new Date(item.dueDate).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="py-4">
                              <p className="text-gray-900">{item.vendor}</p>
                            </td>
                            <td className="py-4 text-right">
                              <p className="text-gray-900">{formatCurrency(item.plannedAmount)}</p>
                            </td>
                            <td className="py-4 text-right">
                              <p className="text-gray-900">{formatCurrency(item.actualAmount)}</p>
                            </td>
                            <td className="py-4 text-right">
                              <Badge variant={item.paid ? 'success' : 'warning'}>
                                {item.paid ? 'Paid' : 'Pending'}
                              </Badge>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex items-center space-x-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteItem(category.id, item.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-error-500" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleTogglePaid(category.id, item.id)}
                                >
                                  {item.paid 
                                    ? <XCircle className="h-4 w-4 text-warning-500" />
                                    : <CheckCircle2 className="h-4 w-4 text-success-500" />
                                  }
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};