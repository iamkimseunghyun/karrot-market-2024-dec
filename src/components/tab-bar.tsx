'use client';
import React from 'react';
import Link from 'next/link';
import {
  HomeIcon as HomeIconSolid,
  NewspaperIcon as NewspaperIconSolid,
  ChatBubbleBottomCenterIcon as ChatBubbleBtmCenterIconSolid,
  VideoCameraIcon as VideoCameraIconSolid,
  UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid';
import {
  HomeIcon as HomeIconOutline,
  NewspaperIcon as NewspaperIconOutline,
  ChatBubbleBottomCenterIcon as ChatBubbleBtmCenterIconOutline,
  VideoCameraIcon as VideoCameraIconOutline,
  UserIcon as UserIconOutline,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

const TabBar = () => {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 w-full mx-auto max-w-screen-md grid grid-cols-5 border-neutral-600 border-t px-5 py-3 *:text-white bg-neutral-800">
      <Link href="/products" className="flex flex-col items-center gap-px">
        {pathname === '/products' ? (
          <HomeIconSolid className="w-7 h-7" />
        ) : (
          <HomeIconOutline className="w-7 h-7" />
        )}
        <span>홈</span>
      </Link>

      <Link href="/life" className="flex flex-col items-center gap-px">
        {pathname === '/life' ? (
          <NewspaperIconSolid className="w-7 h-7" />
        ) : (
          <NewspaperIconOutline className="w-7 h-7" />
        )}
        <span>동네생활</span>
      </Link>
      <Link href="/chats" className="flex flex-col items-center gap-px">
        {pathname === '/chats' ? (
          <ChatBubbleBtmCenterIconSolid className="w-7 h-7" />
        ) : (
          <ChatBubbleBtmCenterIconOutline className="w-7 h-7" />
        )}
        <span>채팅</span>
      </Link>
      <Link href="/live" className="flex flex-col items-center gap-px">
        {pathname === '/live' ? (
          <VideoCameraIconSolid className="w-7 h-7" />
        ) : (
          <VideoCameraIconOutline className="w-7 h-7" />
        )}
        <span>쇼핑</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-px">
        {pathname === '/profile' ? (
          <UserIconSolid className="w-7 h-7" />
        ) : (
          <UserIconOutline className="w-7 h-7" />
        )}
        <span>나의 당근</span>
      </Link>
    </div>
  );
};

export default TabBar;
