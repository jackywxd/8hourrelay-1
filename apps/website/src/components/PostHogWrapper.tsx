'use client';

import dynamic from 'next/dynamic';

const PostHogPageView = dynamic(() => import('@/components/PostHogPageView'), {
  ssr: false,
});

export default function PostHogWrapper() {
  return <PostHogPageView />;
}
