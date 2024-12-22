import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatToKRW, formatToTimeAgo } from '@/lib/utils';

interface ListProductProps {
  id: number;
  title: string;
  price: number;
  created_at: Date;
  photos?: { url: string }[];
  photo?: string;
}

const ListProduct = ({
  id,
  title,
  price,
  created_at,
  photos,
  photo,
}: ListProductProps) => {
  const imageUrl = photos?.[0]?.url || photo || '';
  return (
    <Link href={`/products/${id}`}>
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image
          src={`${imageUrl}/thumbnail`}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="*:text-white flex flex-col gap-1">
        <span className="text-neutral-500">{title}</span>
        <span className="text-sm">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg font-semibold">{formatToKRW(price)}원</span>
      </div>
    </Link>
  );
};

export default ListProduct;
