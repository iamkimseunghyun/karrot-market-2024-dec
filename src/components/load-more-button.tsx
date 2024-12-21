import React from 'react';

interface LoadMoreButtonProps {
  onLoadMoreClick: () => void;
  isLoading: boolean;
}

const LoadMoreButton = ({
  onLoadMoreClick,
  isLoading,
}: LoadMoreButtonProps) => {
  return (
    <button
      onClick={onLoadMoreClick}
      disabled={isLoading}
      className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
    >
      {isLoading ? '로딩 중...' : '더 보기'}
    </button>
  );
};

export default LoadMoreButton;
