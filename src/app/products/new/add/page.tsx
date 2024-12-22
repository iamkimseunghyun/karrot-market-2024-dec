'use client';

import React, { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';
import Input from '@/components/input';
import Button from '@/components/button';
import {
  getUploadedProductImageURL,
  uploadProduct,
} from '@/app/products/new/add/actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductType } from '@/app/products/new/add/schema';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

const Page = () => {
  const [preview, setPreview] = useState('');
  const [fileError, setFileError] = useState('');
  const [uploadURL, setUploadURL] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,

    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    setFileError('');
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }
    const localFile = files[0];

    // 파일 타입 검증
    if (!ALLOWED_FILE_TYPES.includes(localFile.type)) {
      setFileError(
        '지원되지 않는 이미지 형식입니다. JPG, PNG, GIF, WEBP만 가능합니다.'
      );
      return;
    }

    // 파일 크기 검증
    if (localFile.size > MAX_FILE_SIZE) {
      setFileError('파일 크기는 5MB를 초과할 수 없습니다.');
      return;
    }

    const previewURL = URL.createObjectURL(localFile);
    setPreview(previewURL);
    setImageFile(localFile);
    const { success, result } = await getUploadedProductImageURL();
    if (success) {
      const { id, uploadURL } = result;
      setUploadURL(uploadURL);
      setValue(
        'photo',
        `https://imagedelivery.net/UYdYeWsHCBBURfLH8Q-Ggw/${id}`
      );
    }
  };
  const onSubmit = handleSubmit(async (data: ProductType) => {
    if (!imageFile) {
      return;
    }
    // upload image to cloudflare
    const cloudFlareForm = new FormData();
    cloudFlareForm.append('file', imageFile);
    const response = await fetch(uploadURL, {
      method: 'POST',
      body: cloudFlareForm,
    });
    if (response.status !== 200) {
      return;
    }
    // replace `photo` in formData

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('price', data.price + '');
    formData.append('description', data.description);
    formData.append('photo', data.photo);
    // call upload product.
    await uploadProduct(formData);
  });
  // const [state, action] = useActionState(interceptAction, null);
  const onValid = async () => {
    await onSubmit();
  };
  return (
    <div>
      <form action={onValid} className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex flex-col items-center justify-center text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === '' ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {/* {state?.fieldErrors.photo} */}
                {errors.photo?.message}
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
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
