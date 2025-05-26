'use client';

import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { Spinner } from '@/components/ui/spinner';
import { LandingPage } from '@/components/home/landing-page';
import { HomePage } from '@/components/home/home-page';
import { Header } from '@/components/layout/header';

export default function App() {
  return (
    <>
      <AuthLoading>
        <div className='flex h-screen w-screen items-center justify-center'>
          <Spinner />
        </div>
      </AuthLoading>
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
      <Authenticated>
        <Header />
        <HomePage />
      </Authenticated>
    </>
  );
}
