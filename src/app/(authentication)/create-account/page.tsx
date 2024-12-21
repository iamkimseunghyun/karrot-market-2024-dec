'use client';

import React, { useActionState } from 'react';
import Input from '@/components/input';
import FormButton from '@/components/button';
import SocialLogin from '@/components/social-login';
import { createAccount } from '@/app/(authentication)/create-account/actions';
import { PASSWORD_MIN_LENGTH } from '@/lib/constants';

const Page = () => {
  const [state, action] = useActionState(createAccount, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">아래 정보를 입력하고 회원가입을 완료하세요!</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            name="username"
            placeholder="Username"
            required
            errors={state?.fieldErrors.username}
            minLength={3}
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            minLength={PASSWORD_MIN_LENGTH}
            required
            errors={state?.fieldErrors.email}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            minLength={PASSWORD_MIN_LENGTH}
            required
            errors={state?.fieldErrors.password}
          />
          <Input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            required
            errors={state?.fieldErrors.confirm_password}
          />
          {/* <span className="text-red-500 font-medium">Input error</span> */}
        </div>
        <FormButton text="Create account" />
      </form>
      <SocialLogin />
    </div>
  );
};

export default Page;
