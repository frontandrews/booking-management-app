'use client';

import { cn } from '@/utils';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';

export default function MainHero() {
  return (
    <div className="bg-primary">
      <div className="relative isolate overflow-hidden pt-14">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        ></div>
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Vacation Rental Software
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Do less & earn more! Our app helps property managers scale and
              grow their businesses with vacation the best rental management
              software.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/sign-in"
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
