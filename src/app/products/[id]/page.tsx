import React from 'react';
import { notFound, redirect } from 'next/navigation';
import db from '@/lib/db';
import getSession from '@/lib/session';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { formatToKRW } from '@/lib/utils';

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

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

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(Number(params.id));
  return {
    title: product?.title,
  };
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = Number((await params).id);
  if (isNaN(id)) {
    return notFound();
  }

  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);
  const deleteProduct = async () => {
    'use server';
    await db.product.delete({
      where: { id },
    });
    redirect('/products');
  };
  return (
    <div>
      <div className="relative aspect-square">
        <Image
          src={`${product.photo}/public`}
          alt={product.title}
          fill
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
            <Link href={`/products/${id}/edit`}>
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
