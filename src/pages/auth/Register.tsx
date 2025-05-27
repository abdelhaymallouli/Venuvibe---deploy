import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { signUp } from '../../lib/storage';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setServerError(null);
    
    try {
      const { error } = await signUp(data.email, data.password);
      
      if (error) {
        throw error;
      }
      
      // Redirect to login with success message
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-md bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">V</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {serverError && (
            <div className="mb-4 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{serverError}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="name"
              label="Full Name"
              type="text"
              leftIcon={<User size={18} />}
              fullWidth
              error={errors.name?.message}
              disabled={isLoading}
              {...register('name')}
            />
            
            <Input
              id="email"
              label="Email address"
              type="email"
              leftIcon={<Mail size={18} />}
              fullWidth
              error={errors.email?.message}
              disabled={isLoading}
              {...register('email')}
            />
            
            <Input
              id="password"
              label="Password"
              type="password"
              leftIcon={<Lock size={18} />}
              fullWidth
              error={errors.password?.message}
              disabled={isLoading}
              {...register('password')}
            />
            
            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              leftIcon={<Lock size={18} />}
              fullWidth
              error={errors.confirmPassword?.message}
              disabled={isLoading}
              {...register('confirmPassword')}
            />
            
            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                rightIcon={<ArrowRight size={18} />}
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  disabled={isLoading}
                >
                  <span className="sr-only">Sign up with Google</span>
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                      fill="#4285F4"
                    />
                  </svg>
                  Google
                </Button>
              </div>

              <div>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  disabled={isLoading}
                >
                  <span className="sr-only">Sign up with Facebook</span>
                  <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-gray-500">
        By signing up, you agree to our{' '}
        <Link to="/terms-of-service" className="underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy-policy" className="underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
};