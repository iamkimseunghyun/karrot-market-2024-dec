import React from 'react';
import getSession from '@/lib/session';
import db from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: { id: session.id },
    });
    return user;
  }
  notFound();
}

const Page = async () => {
  const user = await getUser();
  const logOut = async () => {
    'use server';
    const session = await getSession();
    session.destroy();
    redirect('/');
  };
  return (
    <div>
      <h1>welcome! {`${user?.username}`}!</h1>
      <form action={logOut}>
        <button>Log out</button>
      </form>
      <Link href="/home">홈으로 가기</Link>
    </div>
  );
};

export default Page;
