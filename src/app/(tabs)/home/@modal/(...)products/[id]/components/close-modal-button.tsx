'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

const CloseModalButton = () => {
  const router = useRouter();
  const onCloseClick = () => {
    router.back();
  };
  return (
    <button onClick={onCloseClick} className="absolute right-5 top-5">
      <XMarkIcon className="size-10" />
    </button>
  );
};

export default CloseModalButton;
