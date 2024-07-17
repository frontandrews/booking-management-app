/* eslint-disable react/no-unescaped-entities */
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { logInAsync } from '@/redux/features/auth/slice';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import FormField from '@/components/ui/form-field';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function SignIn() {
  const { toast } = useToast();
  const [formError, setFormError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector(
    (state) => state.auth.user.isAuthenticated,
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/bookings');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: any) => {
    try {
      const loginAction = await dispatch(
        logInAsync({ email: data.email, password: data.password }),
      );

      if (logInAsync.fulfilled.match(loginAction)) {
        router.push('/bookings');
      } else if (logInAsync.rejected.match(loginAction)) {
        const error = loginAction.payload as string;
        if (error === 'Incorrect password') {
          setFormError('Incorrect password. Please try again.');
        } else if (error === 'Cannot find user') {
          // If user not found, attempt to sign up
          try {
            const signUpResponse = await axios.post('/api/sign-up', {
              email: data.email,
              password: data.password,
            });

            if (signUpResponse.status === 201) {
              toast({
                title: 'Signed up successfully',
              });

              // Automatically log in the user after successful registration
              const loginActionAfterSignUp = await dispatch(
                logInAsync({ email: data.email, password: data.password }),
              );
              if (logInAsync.fulfilled.match(loginActionAfterSignUp)) {
                router.push('/bookings');
              } else {
                setFormError((loginActionAfterSignUp.payload as string) || '');
              }
            } else {
              setFormError('Failed to sign up.');
            }
          } catch (signUpError: any) {
            setFormError(
              signUpError.response?.data?.message || 'Failed to sign up.',
            );
          }
        } else {
          setFormError(error || 'An error occurred');
        }
      }
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'An error occurred');
      console.error('error', error);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col pt-40 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign In
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              id="email"
              label="Email address"
              type="email"
              register={register}
              errors={errors}
            />
            <FormField
              id="password"
              label="Password"
              type="password"
              register={register}
              errors={errors}
            />
            <div>
              {formError.length > 0 && (
                <p className="text-red-500 text-sm mt-1">{formError}</p>
              )}
            </div>
            <div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </div>
          </form>
        </div>
        <p className="mt-10 text-center text-sm text-gray-500">
          Don't have an account yet? Just log in with your email and password
          and we'll create a new account for you.
        </p>
      </div>
    </div>
  );
}
