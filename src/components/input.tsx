import React, { InputHTMLAttributes } from 'react';

interface FormInputProps {
  errors?: string[];
  name: string;
}

const Input = ({
  errors = [],
  name,
  ...rest
}: FormInputProps & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent rounded-md px-2 w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        name={name}
        {...rest}
      />
      <span className="text-red-500 font-medium">
        {errors.map((error, index) => (
          <span key={index} className="text-red-500">
            {error}
          </span>
        ))}
      </span>
    </div>
  );
};

export default Input;
