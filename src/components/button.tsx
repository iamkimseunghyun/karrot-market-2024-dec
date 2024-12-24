'use client';

import React from 'react';

interface FormButtonProps {
  text: string;
  isPending?: boolean;
  action?: () => void;
  type?: 'primary' | 'secondary';
}

const Button = ({ text, isPending, action, type }: FormButtonProps) => {
  return (
    <button
      onClick={action}
      disabled={isPending}
      className={`${type}-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed`}
    >
      {isPending ? '로딩 중' : text}
    </button>
  );
};

export default Button;
