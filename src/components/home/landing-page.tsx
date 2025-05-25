'use client';

import { useTheme } from 'next-themes';
import { LoginForm } from './login-form';

export const LandingPage = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center'>
      <section className='w-full p-16 max-w-7xl '>
        <div className='pt-12'>
          <h1 className='pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl md:text-6xl font-black leading-none text-transparent dark:from-white dark:to-slate-900/10'>
            AI CAD
          </h1>
          <h2 className='pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-5xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10'>
            Design Smarter, Faster, Together
          </h2>
        </div>

        <LoginForm />

        <div className='pointer-events-none absolute inset-0 h-full ' />
      </section>
    </div>
  );
};
