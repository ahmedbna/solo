'use client';

import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';

export const Header = () => {
  return (
    <header className='bg-background border-b border-muted sticky top-0 z-50 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}

          <div className='flex items-center space-x-2'>
            <span className='text-2xl font-black'>Solo</span>
          </div>

          {/* User menu */}
          <div className='flex items-center space-x-4'>
            <Button variant='ghost'>Host your trip</Button>
            <ModeToggle />
            <User className='h-6 w-6 text-gray-600 bg-gray-400 rounded-full p-1' />
          </div>
        </div>
      </div>
    </header>
  );
};
