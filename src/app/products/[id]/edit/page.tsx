import React from 'react';
import db from '@/lib/db';
import EditInput from '@/app/products/[id]/edit/components/edit-input';

const getProduct = async (id: number) => {
  const data = db.product.findUnique({
    where: { id },
    select: {
      title: true,
      price: true,
      description: true,
      photo: true,
    },
  });
  return data;
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const productId = parseInt((await params).id);
  const productData = await getProduct(productId);
  if (!productData) {
    return;
  }
  return (
    <div>
      <h1>Page {`${(await params).id}`} Edit Page</h1>
      <EditInput
        title={productData.title}
        price={productData.price}
        description={productData.description}
        photo={productData.photo}
        productId={productId}
      />
    </div>
  );
};

export default Page;
