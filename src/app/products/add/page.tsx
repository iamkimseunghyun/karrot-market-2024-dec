'use client';

import React, { useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Input from '@/components/input';
import Button from '@/components/button';
import {
  getUploadedProductImageURL,
  uploadProduct,
} from '@/app/products/add/actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductType } from '@/app/products/add/schema';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

interface ImageFile {
  file: File;
  preview: string;
  uploadURL?: string;
  cloudflareId?: string;
}

const Page = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [fileError, setFileError] = useState('');
  // const [preview, setPreview] = useState('');
  // const [uploadURL, setUploadURL] = useState('');
  // const [imageFile, setImageFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductType & { photos: string[] }>({
    resolver: zodResolver(productSchema),
  });

  const validateFile = (file: File) => {
    // 파일 타입 검증
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError(
        '지원되지 않는 이미지 형식입니다. JPG, PNG, GIF, WEBP만 가능합니다.'
      );
    }
    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      setFileError('파일 크기는 5MB를 초과할 수 없습니다.');
    }
    return null;
  };

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    setFileError('');

    if (!files || files.length === 0) return;

    const newImages: ImageFile[] = [];
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        setFileError(error);
        return;
      }

      const preview = URL.createObjectURL(file);

      // Cloudflare 업로드 URL 얻기
      const { success, result } = await getUploadedProductImageURL();
      if (success) {
        newImages.push({
          file,
          preview,
          uploadURL: result.uploadURL,
          cloudflareId: result.id,
        });
      }
    }

    setImages((prev) => [...prev, ...newImages]);

    // Form의 photos 필드 업데이트
    const cloudFlareURLS = newImages.map(
      (img) =>
        `https://imagedelivery.net/UYdYeWsHCBBURfLH8Q-Ggw/${img.cloudflareId}`
    );
    setValue('photos', cloudFlareURLS);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
    // Form의 photos 필드도 업데이트
    setValue(
      'photos',
      images
        .filter((_, i) => i !== index)
        .map(
          (img) =>
            `https://imagedelivery.net/UYdYeWsHCBBURfLH8Q-Ggw/${img.cloudflareId}`
        )
    );
  };

  const onSubmit = handleSubmit(
    async (data: ProductType & { photos: string[] }) => {
      if (images.length === 0) return;

      // 모든 이미지를 Cloudflare에 업로드
      for (const image of images) {
        if (!image.uploadURL) continue;

        const cloudFlareForm = new FormData();
        cloudFlareForm.append('file', image.file);
        const response = await fetch(image.uploadURL, {
          method: 'POST',
          body: cloudFlareForm,
        });
        if (response.status !== 200) return;
      }

      // 제품 데이터 업로드
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('price', data.price + '');
      formData.append('description', data.description);
      data.photos.forEach((photo) => formData.append('photos[]', photo));

      // call upload product.
      await uploadProduct(formData);
    }
  );
  // const [state, action] = useActionState(interceptAction, null);
  const onValid = async () => {
    await onSubmit();
  };

  return (
    <div>
      <form action={onValid} className="flex flex-col gap-5 p-5">
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <div
                className="border-2 aspect-square flex items-center justify-center rounded-md bg-center bg-cover"
                style={{ backgroundImage: `url(${image.preview}` }}
              >
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <XMarkIcon className="size-10" />
                </button>
              </div>
            </div>
          ))}
          <label
            htmlFor="photos"
            className="border-2 aspect-square flex flex-col items-center justify-center text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer"
          >
            <PhotoIcon className="w-20" />
            <div className="text-neutral-400 text-sm">
              사진을 추가해주세요. (여러 장 선택 가능)
              {errors.photos?.message}
            </div>
          </label>
        </div>
        <input
          onChange={onImageChange}
          type="file"
          id="photos"
          name="photos"
          accept="image/*"
          className="hidden"
        />
        {fileError && (
          <div className="text-red-500 mt-2 text-sm">{fileError}</div>
        )}
        <Input
          required
          placeholder="제목"
          type="text"
          {...register('title')}
          errors={[errors.title?.message ?? '']}
        />
        <Input
          required
          placeholder="가격"
          type="number"
          {...register('price')}
          errors={[errors.price?.message ?? '']}
        />
        <Input
          required
          placeholder="자세한 설명"
          type="text"
          {...register('description')}
          errors={[errors.description?.message ?? '']}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
};

export default Page;
