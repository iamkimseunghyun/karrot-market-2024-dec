import { PhotoIcon } from '@heroicons/react/24/solid';
import CloseModalButton from '@/app/(tabs)/home/@modal/(...)products/[id]/components/close-modal-button';
import db from '@/lib/db';
import Image from 'next/image';

export default async function Modal({ params }: { params: { id: string } }) {
  const id = parseInt((await params).id);
  const product = await db.product.findUnique({
    where: { id },
    select: {
      title: true,
      photos: {
        select: {
          url: true,
        },
        take: 1,
      },
    },
  });
  if (!product) {
    return;
  }
  const imageURL = product.photos[0]?.url
    ? product.photos[0].url + '/public'
    : '';
  console.log('image URL ', imageURL);
  return (
    <div className="absolute w-full h-full z-50 flex justify-center items-center bg-black bg-opacity-50 left-0 top-0">
      <CloseModalButton />
      <div className="max-w-screen-sm h-1/2 w-full flex justify-center">
        <div className="relative aspect-square  bg-neutral-700 text-neutral-200 rounded-md flex justify-center items-center">
          <Image
            src={imageURL}
            alt={product.title}
            fill
            className="object-cover"
          />
          <PhotoIcon className="h-28" />
        </div>
      </div>
    </div>
  );
}
