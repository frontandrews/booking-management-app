'use client';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  createProperty,
  fetchProperties,
  updateProperty,
  deleteProperty,
} from '@/redux/features/property/slice';
import { Button } from '@/components/ui/button';
import { usePropertyForm } from '@/hooks/use-property-form';
import { ThreeDots } from 'react-loader-spinner';
import { TrashIcon } from 'lucide-react';
import FormField from '@/components/ui/form-field';

interface PropertyFormProps {
  propertyId?: number;
  onClose: () => void;
}

export default function PropertyForm({
  propertyId,
  onClose,
}: PropertyFormProps) {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    reset,
    errors,
    formError,
    setFormError,
    isLoading,
    setIsLoading,
  } = usePropertyForm();

  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProperty = async (id: number) => {
      try {
        const response = await axios.get(`/api/properties/${id}`);
        reset(response.data);
      } catch (error: any) {
        console.error('Error fetching property:', error);
        setFormError(error.response?.data?.message || 'An error occurred');
      } finally {
        setInitialLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty(propertyId);
    } else {
      setInitialLoading(false);
    }
  }, [propertyId, reset, setFormError]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (propertyId) {
        await dispatch(updateProperty({ propertyId, data })).unwrap();
        toast({ title: 'Property updated successfully' });
      } else {
        await dispatch(createProperty(data)).unwrap();
        toast({ title: 'Property created successfully' });
      }
      onClose();
      dispatch(fetchProperties());
    } catch (error: any) {
      setFormError(error.message || 'An error occurred');
      console.error('Error saving property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await dispatch(deleteProperty(propertyId!)).unwrap();
      toast({ title: 'Property deleted successfully' });
      dispatch(fetchProperties());
      onClose();
    } catch (error: any) {
      setFormError(error.message || 'An error occurred');
      console.error('Error deleting property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="h-[232px] content-center pb-12">
        <div className="flex justify-center">
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="black"
            radius="9"
            ariaLabel="three-dots-loading"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              id="name"
              label="Name"
              type="text"
              register={register}
              errors={errors}
            />
            <FormField
              id="location"
              label="Location"
              type="text"
              register={register}
              errors={errors}
            />
            <div>
              {formError.length > 0 && (
                <p className="text-red-500 text-sm mt-1">{formError}</p>
              )}
            </div>
            <div className="flex justify-between">
              {propertyId && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="mr-3"
                  disabled={isLoading}
                  onClick={onDelete}
                >
                  <TrashIcon className="h-5 w-5 text-white" />
                </Button>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {propertyId ? 'Save Changes' : 'Create Property'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
