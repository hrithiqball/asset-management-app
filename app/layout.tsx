import '@/app/globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/app/providers';
import Navigation from '@/components/client/Navigation';
import { getServerSession } from 'next-auth';
import { Toaster } from 'sonner';
import { authOptions } from '@/utils/data/auth';
const inter = Inter({ subsets: ['latin'] });
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/utils/style';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Asset Management System',
  description: 'A digital asset management system solution for your business.',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.className,
        )}
      >
        <main>
          <Providers>
            <div className="flex flex-col h-screen">
              {session && <Navigation />}
              <div className="flex-1">
                {children}
                <Toaster richColors />
              </div>
            </div>
          </Providers>
        </main>
      </body>
    </html>
  );
}
