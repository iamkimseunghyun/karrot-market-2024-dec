import React from 'react';

interface InfiniteScrollProps extends React.HTMLProps<HTMLSpanElement> {
  trigger: React.RefObject<HTMLSpanElement>;
  isLoading: boolean;
}

const InfiniteScroll = ({ trigger, isLoading }: InfiniteScrollProps) => {
  return (
    <span
      ref={trigger}
      className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
    >
      {isLoading ? '로딩 중...' : '더 보기'}
    </span>
  );
};

export default InfiniteScroll;
