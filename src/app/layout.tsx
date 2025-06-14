import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { ConvexAuthenticationProvider } from '@/providers/convex-auth-provider';
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Header } from '@/components/layout/header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Solo',
  description: 'Travel with your new family around the world.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <ConvexAuthenticationProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            enableSystem
            attribute='class'
            defaultTheme='dark'
            disableTransitionOnChange
          >
            <TooltipProvider>
              <Header />
              <div className='h-14' />
              <main>{children}</main>
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </ConvexAuthenticationProvider>
    </html>
  );
}
