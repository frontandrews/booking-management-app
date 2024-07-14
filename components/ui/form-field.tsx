import React from 'react';
import { Input } from '@/components/ui/input';
import { getErrorMessage } from '@/utils';

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  register: any;
  errors: any;
}

const FormField = ({ id, label, type, register, errors }: FormFieldProps) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium leading-6 text-gray-900"
    >
      {label}
    </label>
    <div className="mt-2">
      <Input
        id={id}
        type={type}
        autoComplete={id}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        {...register(id)}
      />
      {errors[id] && (
        <p className="text-red-500 text-sm mt-1">
          {getErrorMessage(errors[id])}
        </p>
      )}
    </div>
  </div>
);

export default FormField;
