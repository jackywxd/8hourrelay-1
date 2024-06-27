'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';

import Navbar from '@/components/Navbar';
import TimeCard from './_components/TimeCard';
import Loading from '@/components/Loading';
import HeroImage from './_components/HeroImage';
import ShiftingCountdown from './_components/CountDownComponent';

export default function HeroSection() {
  // intersection observer to handle navbar change background
  const { ref, inView } = useInView({
    threshold: 0.3,
  });

  return (
    <>
      <div className="w-full">
        <Navbar changeBg={!inView} />
      </div>
      <div className="hero-section relative" ref={ref}>
        <HeroImage />
        <div className="hero-text content-container small relative z-10">
          <h1>Sept 7 2024</h1>
          <div className="countdown">count down to the event</div>
          <Suspense fallback={<Loading />}>
            <ShiftingCountdown />
            {/* <TimeCard /> */}
          </Suspense>

          <Link href="/registration">
            <button
              className="btn btn-primary btn-large btn-register"
              type="submit"
            >
              Register Now
            </button>
          </Link>
        </div>
      </div>
      {!inView && (
        <div className="nav-link top duration-900 transition-opacity">
          <Link href="#root">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 hover:animate-bounce hover:delay-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
              />
            </svg>
          </Link>
        </div>
      )}
    </>
  );
}
