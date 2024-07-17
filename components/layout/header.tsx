'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { logOut } from '@/redux/features/auth/slice';
import { RootState, AppDispatch } from '@/redux/store';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { DesktopNavigation } from './desktop-navigation';
import { MobileNavigation } from './mobile-navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.user.isAuthenticated,
  );
  const dispatch = useAppDispatch<AppDispatch>();
  const [hydrated, setHydrated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated && pathname !== '/sign-in' && pathname !== '/') {
      router.push('/sign-in');
    } else if (isAuthenticated && pathname === '/') {
      router.push('/bookings');
    }
  }, [isAuthenticated, router, pathname, hydrated]);

  const handleLogout = () => {
    dispatch(logOut());
    router.push('/sign-in');
  };

  return (
    <header className="bg-primary">
      <nav
        aria-label="Global"
        className="slide-up flex items-center justify-between p-6 lg:px-8  container mx-auto"
      >
        <div className="flex lg:flex-1">
          <Link
            href={isAuthenticated ? '/bookings' : '/'}
            className="-m-1.5 p-1.5 text-2xl font-bold leading-6 text-white"
          >
            HostSoft
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <DesktopNavigation />
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {hydrated && !isAuthenticated ? (
            <Link
              href="/sign-in"
              className="text-sm font-semibold leading-6 text-white"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : (
            hydrated && (
              <div
                onClick={handleLogout}
                className="text-sm font-semibold leading-6 text-white cursor-pointer"
              >
                Logout <span aria-hidden="true">&rarr;</span>
              </div>
            )
          )}
        </div>
      </nav>
      <MobileNavigation
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
      />
    </header>
  );
}
