import React from 'react';
import db from '@/lib/db';
import ProductList from '@/components/product-list';
import { Prisma } from '@prisma/client';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/solid';
import { revalidatePath, unstable_cache as nextCache } from 'next/cache';

const getCachedProducts = nextCache(getInitialProducts, ['home-products']);

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
    },
    take: 1,
    orderBy: {
      created_at: 'desc',
    },
  });
  return products;
}

export type InitialProduct = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const metadata = {
  title: 'Home',
};

const Page = async () => {
  const initialProducts = await getCachedProducts();
  const revalidate = async () => {
    'use server';
    revalidatePath('/');
  };
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button className="bg-orange-500 flex items-center justify-center rounded-full size-24 fixed bottom-34 right-8 text-white transition-colors font-bold hover:bg-orange-400 mr-20">
          데이터 갱신
        </button>
      </form>
      <Link
        href={'/products/new/add'}
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
};

export default Page;
