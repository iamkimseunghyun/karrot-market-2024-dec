'use server';

import { z } from 'zod';
import bcrypt from 'bcrypt';

import db from '@/lib/db';
import { PASSWORD_MIN_LENGTH } from '@/lib/constants';
import makeLogin from '@/lib/make-login';
import { redirect } from 'next/navigation';

const checkUsername = (username: string) => !username.includes('potato');
const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const createAccountFormSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: '사용자 이름은 문자로 입력해야 합니다.',
        required_error: '사용자 이름은 필수로 입력해야 합니다.',
      })
      .toLowerCase()
      .trim()
      // .transform((username) => `🔥${username}🔥`)
      .refine(checkUsername, { message: `사용할 수 없는 이름입니다.` }),
    email: z.string().email().toLowerCase(),
    password: z.string().min(PASSWORD_MIN_LENGTH, {
      message: '비밀번호는 최소 4자리 이상 입력되어야 합니다.',
    }),
    // .regex(PASSWORD_REGEX)
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH, {
      message: '비밀번호는 최소 4자리 이상 입력되어야 합니다.',
    }),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: 'custom',
        message: '이미 사용하고 있는 이름입니다.',
        path: ['username'],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: 'custom',
        message: '이미 사용하고 있는 이메일입니다.',
        path: ['email'],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPassword, {
    message: '비밀번호와 비밀번호 확인이 맞지 않습니다.',
    path: ['confirm_password'],
  });

type FormState = {
  fieldErrors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirm_password?: string[];
  };
  formErrors?: string[];
};

export async function createAccount(
  prevState: FormState | null,
  formData: FormData
) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  };
  // zod에서 유효성 검사 전부 수행. DB에서 사용자 이름, 이메일 체크까지 zod에서 진행.
  const result = await createAccountFormSchema.safeParseAsync(data);
  if (!result.success) {
    console.log(result.error);
    return result.error.flatten();
  } else {
    // hash password
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    // save the user to db
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    // log the user in
    // const session = await getSession();
    // session.id = user.id;
    // await session.save();
    // redirect('/profile');
    await makeLogin(user.id);
    return redirect('/profile');
  }
}
