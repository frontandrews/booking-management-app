import { formatCurrency } from '@/utils';
import React, { useState, useEffect } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';

interface CurrencyInputProps {
  id: string;
  label: string;
  placeholder?: string;
  isEdit?: boolean;
}

const CurrencyInput = ({
  id,
  label,
  placeholder = '',
  isEdit,
}: CurrencyInputProps) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const rawValue = useWatch({ name: id, control });

  const [displayValue, setDisplayValue] = useState<string>('');
  const [isFormatted, setIsFormatted] = useState<boolean>(false);

  useEffect(() => {
    if (rawValue && !isFormatted && isEdit) {
      const formattedValue = formatCurrency(rawValue);
      setDisplayValue(formattedValue);
      setIsFormatted(true);
    }
  }, [rawValue, isFormatted, isEdit]);

  const handleBlur = () => {
    const formattedValue = formatCurrency(rawValue);
    setDisplayValue(formattedValue);
    setValue(id, formattedValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.-]+/g, '');
    setDisplayValue(e.target.value);
    setValue(id, rawValue);
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <Controller
          name={id}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id={id}
              placeholder={placeholder}
              value={displayValue}
              onChange={handleChange}
              onBlur={handleBlur}
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          )}
        />
        {errors[id] && (
          <p className="text-red-500 text-sm mt-1">
            {errors[id]?.message?.toString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default CurrencyInput;
