'use client';

import React from 'react';

interface FormButtonProps {
  text: string;
  isPending?: boolean;
}

const Button = ({ text, isPending }: FormButtonProps) => {
  return (
    <button
      disabled={isPending}
      className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
    >
      {isPending ? '로딩 중' : text}
    </button>
  );
};

export default Button;
