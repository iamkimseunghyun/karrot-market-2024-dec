'use server';

import db from '@/lib/db';

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photos: {
        select: {
          url: true,
        },
        take: 1, // 첫 번째 이미지만 가져옴
      },
    },
    skip: page * 1,
    take: 1,
    orderBy: {
      created_at: 'desc',
    },
  });
  // photos 배열의 첫 번째 이미지 URL을 photo 필드로 변환
  return products.map((product) => ({
    ...product,
    photo: product.photos[0]?.url || '', // 이미지가 없는 경우 빈 문자열 반환
  }));
}
