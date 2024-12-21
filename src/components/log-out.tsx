import React from 'react';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';

const LogOut = () => {
  const logout = async () => {
    'use server';
    const session = await getSession();
    if (session.id) {
      session.destroy();
    }
    redirect('/');
  };
  return (
    <form action={logout}>
      <button>logout</button>
    </form>
  );
};

export default LogOut;
