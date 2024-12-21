'use client';
import React, { useActionState } from 'react';
import Input from '@/components/input';
import Button from '@/components/button';
import SocialLogin from '@/components/social-login';
import { smsLogin } from '@/app/(authentication)/sms/actions';

const initialState = {
  token: false,
  error: undefined,
};

const Page = () => {
  const [state, action] = useActionState(smsLogin, initialState);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          {state.token ? (
            <Input
              type="number"
              name="token"
              placeholder="Verification number"
              errors={state.error?.formErrors}
              required
            />
          ) : (
            <Input
              type="text"
              name="phone"
              placeholder="Phone number"
              errors={state.error?.formErrors}
              required
            />
          )}
          {/* <span className="text-red-500 font-medium">Input error</span> */}
        </div>
        <Button text={state.token ? 'Verify Token' : 'Send Verification SMS'} />
      </form>
      <SocialLogin />
    </div>
  );
};

export default Page;
