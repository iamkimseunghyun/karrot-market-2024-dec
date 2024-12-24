'use server';

import db from '@/lib/db';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';
import { productSchema } from '@/app/products/new/add/schema';
import { revalidatePath } from 'next/cache';

export async function uploadProduct(formData: FormData) {
  const data = {
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
  };

  // 파일에서 접근하는 코드
  // if (data.photo instanceof File) {
  //   const photoData = await data.photo.arrayBuffer();
  //   await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
  //   data.photo = `/${data.photo.name}`;
  // }

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect(`/products/${product.id}`);
    }
  }
}

export async function editProduct(formData: FormData, productId: number) {
  const data = {
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
  };

  const result = productSchema.safeParse(data);
  if (!result.success) {
    console.log('에디트 프로덕트 리절트 실패');
    return result.error.flatten();
  } else {
    if (productId) {
      const product = await db.product.update({
        where: {
          id: productId,
        },
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
        },
        select: {
          id: true,
        },
      });
      revalidatePath(`/products/${product.id}`);
      redirect(`/products/${product.id}`);
    }
  }
}

export async function getUploadedProductImageURL() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_IMAGE_STREAM_API_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGE_STREAM_API_TOKEN}`,
      },
    }
  );

  const data = await response.json();
  return data;
}
