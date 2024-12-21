'use client';

import React, { useActionState } from 'react';

import Input from '@/components/input';
import FormButton from '@/components/button';
import SocialLogin from '@/components/social-login';
import { login } from '@/app/(authentication)/login/actions';

const Page = () => {
  const [state, action, isPending] = useActionState(login, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
            errors={state?.fieldErrors?.email}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
            errors={state?.fieldErrors?.password}
          />
        </div>
        <FormButton text="Login" isPending={isPending} />
      </form>
      <SocialLogin />
    </div>
  );
};

export default Page;
