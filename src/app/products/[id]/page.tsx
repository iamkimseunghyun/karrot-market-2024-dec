import React from 'react';
import { notFound, redirect } from 'next/navigation';
import db from '@/lib/db';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { formatToKRW } from '@/lib/utils';
import {
  revalidatePath,
  revalidateTag,
  unstable_cache as nextCache,
} from 'next/cache';
import getSession from '@/lib/session';

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

export const revalidate = 60;

// const revalidate = async () => {
//   'use server';
//   revalidateTag('product-detail');
// };

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

const getCachedProduct = nextCache(getProduct, ['product-detail'], {
  tags: ['product-detail', 'xxx'],
});

async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    select: {
      title: true,
    },
  });
  return product;
}

const getCachedProductTitle = nextCache(getProductTitle, ['product-title'], {
  tags: ['product-title', 'xxx'],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const product = await getCachedProductTitle(Number((await params).id));
  return {
    title: product?.title,
  };
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  // const id = Number(await params.id);
  const id = parseInt((await params).id);
  if (isNaN(id)) {
    return notFound();
  }

  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);
  const deleteProduct = async () => {
    'use server';
    await db.product.delete({
      where: { id },
    });
    revalidateTag('home-products');
    redirect('/home');
  };
  const revalidate = async () => {
    'use server';
    revalidatePath(`/products/${id}`);
  };
  return (
    <div>
      <div className="relative aspect-square">
        <Image
          src={`${product.photo}/public`}
          alt={product.title}
          fill
          sizes="cover"
          priority={true}
          className="object-contain"
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-600">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-lg">
          {formatToKRW(product.price)}원
        </span>
        {isOwner && (
          <>
            <form action={deleteProduct}>
              <button className="bg-red-500 py-2.5 px-5 rounded-md text-white font-semibold">
                상품 삭제
              </button>
            </form>
            <form action={revalidate}>
              <button className="bg-red-500 py-2.5 px-5 rounded-md text-white font-semibold">
                상품 갱신
              </button>
            </form>
            <Link
              href={{
                pathname: `/products/${id}/edit`,
              }}
            >
              <span className="bg-blue-500 py-2.5 px-5 rounded-md text-white font-semibold">
                상품 수정
              </span>
            </Link>
            <Link href={`/home`}>
              <span className="bg-green-500 py-2.5 px-5 rounded-md text-white font-semibold">
                상품 목록
              </span>
            </Link>
          </>
        )}
        <Link
          href={``}
          className="bg-orange-500 py-2.5 px-5 rounded-md text-white font-semibold"
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
};

export default Page;

export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: { id: true },
  });
  return products.map((product) => ({ id: product.id + '' }));
}
