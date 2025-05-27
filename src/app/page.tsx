'use client';

import { Spinner } from '@/components/ui/spinner';
import { HomePage } from '@/components/home/home-page';
import { LandingPage } from '@/components/home/landing-page';
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';

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
        <HomePage />
      </Authenticated>
    </>
  );
}
