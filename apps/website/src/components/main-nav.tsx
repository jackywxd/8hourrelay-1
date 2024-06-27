'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { MainNavItem } from '@/types/index';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { MobileNav } from './mobile-nav';
import { Logo } from '@/components/icons/Logo';

interface MainNavProps {
  items: MainNavItem[];
  children?: React.ReactNode;
}

export function MainNav({ items, children }: MainNavProps) {
  const { theme } = useTheme();

  const segment = useSelectedLayoutSegment();
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2 md:flex">
        <div className="w-28 p-6">
          <Logo fill={theme === 'light' ? `#000` : '#fff'} />
        </div>
        <span className="hidden font-bold sm:inline-block">
          {/* {siteConfig.name} */}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href}
              className="flex flex-col justify-center"
            >
              <button
                style={{
                  WebkitTapHighlightColor: 'transparent',
                }}
                className={cn(
                  item.href.startsWith(`/${segment}`)
                    ? ''
                    : 'hover:text-foreground680',
                  'relative rounded-full px-3 py-1.5 text-sm font-medium text-foreground outline-sky-400 transition hover:bg-popover hover:text-popover-foreground focus-visible:outline-2'
                )}
              >
                {item.href.startsWith(`/${segment}`) && (
                  <motion.span
                    layoutId="bubble"
                    className="absolute inset-0 z-10 bg-white mix-blend-difference"
                    style={{ borderRadius: 9999 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {item.title}
              </button>
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
