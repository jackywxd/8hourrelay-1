'use client';

import { useTheme } from 'next-themes';
import { Logo as MyLogo } from './icons/Logo';

const Logo = () => {
  const { theme } = useTheme();
  return (
    <div className="container mx-auto w-32 p-6 md:w-48">
      <MyLogo fill={theme === 'light' ? `#000` : '#fff'} />
    </div>
  );
};

export { Logo };
