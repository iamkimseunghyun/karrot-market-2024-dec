import { z } from 'zod';

export const productSchema = z.object({
  photos: z.array(
    z.string({
      required_error: ' 사진 첨부는 필수입니다. 🥺',
    })
  ),
  title: z
    .string({ required_error: '제목은 필수 입력 사항입니다.' })
    .min(4, { message: '최소 4글자 이상 입력해야 합니다.' }),
  description: z
    .string({
      required_error: '상세 설명은 필수 입력 사항입니다.',
    })
    .min(6, { message: '최소 6자 이상 입력해야 합니다.' }),
  price: z.coerce
    .number({
      required_error: '가격 입력은 필수 입니다..',
    })
    .min(1000, { message: '최소 1,000원 이상이어야 합니다.' }),
});

export type ProductType = z.infer<typeof productSchema>;
