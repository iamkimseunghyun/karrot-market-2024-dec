import { NextRequest } from 'next/server';
import { notFound, redirect } from 'next/navigation';
import db from '@/lib/db';
import makeLogin from '@/lib/make-login';
import { getAccessToken, getUserData, getUserEmail } from '@/lib/github-api';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return notFound();
  }

  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();

  const accessTokenUrl = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenResponse = await getAccessToken(accessTokenUrl);

  const { access_token, error } = await accessTokenResponse.json();
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const userProfileResponse = await getUserData(access_token);

  const { id, avatar_url, login } = await userProfileResponse.json();

  const userEmailResponse = await getUserEmail(access_token);

  const existGithubUser = await db.user.findUnique({
    where: {
      github_id: id + '',
    },
    select: {
      id: true,
    },
  });

  if (existGithubUser) {
    await makeLogin(existGithubUser.id);
    return redirect('/profile');
  }

  const existsUsername = await db.user.findUnique({
    where: {
      username: login,
    },
    select: {
      id: true,
    },
  });

  const existsUserEmail = await db.user.findUnique({
    where: {
      email: userEmailResponse,
    },
    select: {
      id: true,
    },
  });

  const newUser = await db.user.create({
    data: {
      username: existsUsername ? login + '-gh' : login,
      github_id: id + '',
      avatar: avatar_url,
      email: existsUserEmail ? null : userEmailResponse,
    },
    select: {
      id: true,
    },
  });

  if (newUser) {
    await makeLogin(newUser.id);
    return redirect('/profile');
  } else {
    return new Response(null, {
      status: 400,
    });
  }
}
