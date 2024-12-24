import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatToKRW, formatToTimeAgo } from '@/lib/utils';

interface ListProductProps {
  id: number;
  title: string;
  price: number;
  created_at: Date;
  photo: string;
}

const ListProduct = ({
  id,
  title,
  price,
  created_at,
  photo,
}: ListProductProps) => {
  return (
    <Link href={`/products/${id}`}>
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image
          src={`${photo}/thumbnail`}
          alt={title}
          fill
          priority={true}
          sizes="cover"
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
