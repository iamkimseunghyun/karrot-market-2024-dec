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

  // const { email } = await userEmailResponse.json();

  const user = await db.user.findUnique({
    where: {
      github_id: id + '',
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  if (!user?.email) {
    await db.user.update({
      where: {
        github_id: id + '',
      },
      data: {
        email: user!.email ? null : userEmailResponse,
      },
    });
  }

  if (user) {
    await makeLogin(user.id);
    return redirect('/profile');
  }

  const username = user!.username;
  const userEmail = user!.email;

  const newUser = await db.user.create({
    data: {
      username: username === login ? username + '-gh' : username,
      github_id: id + '',
      avatar: avatar_url,
      email: userEmail ? null : userEmailResponse,
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
