'use client';

import React, { useEffect, useRef, useState } from 'react';
import ListProduct from '@/components/list-product';
import { InitialProduct } from '@/app/(tabs)/home/page';
import { getMoreProducts } from '@/app/(tabs)/home/actions';
import InfiniteScroll from '@/components/infinite-scroll';
import LoadMoreButton from '@/components/load-more-button';

interface ProductListProps {
  initialProducts: InitialProduct;
}

const ProductList = ({ initialProducts }: ProductListProps) => {
  const [products, setProducts] = useState<InitialProduct>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);
          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
        console.log(entries[0].isIntersecting);
      },
      {
        threshold: 1,
        rootMargin: '0px 0px -100px 0px',
      }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [page]);
  const onLoadMoreClick = async () => {
    setIsLoading(true);
    const newProducts = await getMoreProducts(page + 1);
    if (newProducts.length !== 0) {
      setPage((prev) => prev + 1);
    } else {
      setIsLastPage(true);
    }
    setProducts((prev) => [...prev, ...newProducts]);
    setIsLoading(false);
  };
  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {!isLastPage && (
        // <InfiniteScroll trigger={trigger} isLoading={isLoading} />
        <LoadMoreButton
          onLoadMoreClick={onLoadMoreClick}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ProductList;
