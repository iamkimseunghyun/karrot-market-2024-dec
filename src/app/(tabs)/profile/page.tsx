import React from 'react';
import getSession from '@/lib/session';
import db from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

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
    </div>
  );
};

export default Page;
