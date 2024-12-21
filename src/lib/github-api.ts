export async function getAccessToken(accessTokenUrl: string) {
  const accessToken = await fetch(accessTokenUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });

  return accessToken;
}

export async function getUserData(accessToken: string) {
  return await fetch('https://api.github.com/user', {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
    cache: 'no-cache',
  });
}

export async function getUserEmail(accessToken: string) {
  const userEmailResponse = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-cache',
  });
  let email = '';
  const githubEmail = await userEmailResponse.json();

  for (const mail of githubEmail) {
    // console.log('github email--', mail);
    if (mail.primary && mail.verified && mail.visibility === 'private') {
      email = mail.email;
      break;
    }
  }

  return email;
}
