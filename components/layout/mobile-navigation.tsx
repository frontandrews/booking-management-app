import { Dialog, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { NavigationItem } from './navigation-item';
import Link from 'next/link';

interface MobileNavigationProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  handleLogout: () => void;
}

const navigation = [
  { name: 'Linkedin', href: 'https://www.linkedin.com/in/andrewsgomes/' },
  { name: 'Github', href: 'https://github.com/frontandrews' },
];

export const MobileNavigation = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  isAuthenticated,
  handleLogout,
}: MobileNavigationProps) => {
  return (
    <Dialog
      open={mobileMenuOpen}
      onClose={setMobileMenuOpen}
      className="lg:hidden"
    >
      <div className="fixed inset-0 z-50" />
      <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-primary px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
        <div className="flex items-center justify-between">
          <Link
            href={isAuthenticated ? '/bookings' : '/'}
            className="-m-1.5 p-1.5 text-2xl font-bold leading-6 text-white"
          >
            HostSoft
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="-m-2.5 rounded-md p-2.5 text-gray-400"
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/25">
            <div className="space-y-2 py-6">
              {navigation.map((item) => (
                <NavigationItem
                  key={item.name}
                  name={item.name}
                  href={item.href}
                />
              ))}
            </div>
            <div className="py-6 text-right">
              {!isAuthenticated ? (
                <Link
                  href="/sign-in"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                >
                  Log in
                </Link>
              ) : (
                <div
                  onClick={handleLogout}
                  className="text-sm font-semibold leading-6 text-white cursor-pointer"
                >
                  Logout <span aria-hidden="true">&rarr;</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  );
};
