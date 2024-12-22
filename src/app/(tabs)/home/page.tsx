import React from 'react';
import db from '@/lib/db';
import ProductList from '@/components/product-list';
import { Prisma } from '@prisma/client';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/solid';

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photos: {
        select: {
          url: true,
        },
        take: 1,
      },
    },
    take: 1,
    orderBy: {
      created_at: 'desc',
    },
  });
  return products.map((product) => ({
    ...product,
    photo: product.photos[0]?.url || '',
  }));
}

export type InitialProduct = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

const Page = async () => {
  const initialProducts = await getInitialProducts();
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <Link
        href={'/products/add'}
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
};

export default Page;
