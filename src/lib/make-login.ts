import getSession from '@/lib/session';

export default async function makeLogin(userId: number) {
  const session = await getSession();
  session.id = userId;
  await session.save();
}
