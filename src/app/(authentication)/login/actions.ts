'use server';

import { z } from 'zod';
import bcrypt from 'bcrypt';

import db from '@/lib/db';
import makeLogin from '@/lib/make-login';
import { redirect } from 'next/navigation';

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  // if(user){
  //   return true
  // } else {
  //   return false
  // }
  return Boolean(user);
};

const loginFormSchema = z.object({
  email: z.string().email().toLowerCase().refine(checkEmailExists, {
    message: '이메일 사용자가 존재하지 않습니다.',
  }),
  password: z.string({
    required_error: '비밀번호는 반드시 입력해야 합니다.',
  }),
  // .min(PASSWORD_MIN_LENGTH)
  // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export const login = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const result = await loginFormSchema.safeParseAsync(data);

  if (!result.success) {
    // return {
    //   filedErrors: result.error.flatten().fieldErrors,
    // };
    return result.error.flatten();
  } else {
    // if the user is found, check password hash
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? 'xxx'
    );
    if (ok) {
      // const session = await getSession();
      // session.id = user!.id;
      // await session.save();
      // redirect('/profile');
      await makeLogin(user!.id);
      return redirect('/profile');
    } else {
      return {
        success: false,
        fieldErrors: {
          password: ['비밀번호가 틀렸습니다.'],
          email: [],
        },
        message: 'Invalid login credentials',
      };
    }
  }
};
