import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/utils';
import Header from '@/components/layout/header';
import { ReduxProvider } from '@/redux/provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Booking Management App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full" lang="en">
      <body className={cn(inter.className, 'h-full')}>
        <ReduxProvider>
          <Toaster />
          <Header />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
