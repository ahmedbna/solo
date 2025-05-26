'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { UserCircle2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateAgencyDialog } from '../dashboard/create-agency';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const router = useRouter();
  const user = useQuery(api.users.get);
  const agencies = useQuery(api.agencies.getUserAgencies);

  return (
    <header className='bg-background border-b border-muted sticky top-0 z-50 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center space-x-2'>
            <span className='text-2xl font-black'>Solo</span>
          </div>

          <div className='flex items-center space-x-4'>
            {agencies && agencies.length > 0 ? (
              agencies.length === 1 ? (
                <Button asChild variant='outline'>
                  <Link href={`/agency/${agencies[0]._id}`}>
                    {agencies[0].name}
                  </Link>
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline'>Manage Agencies</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-56'>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {agencies.map((agency) => (
                        <DropdownMenuItem key={agency._id}>
                          <Link href={`/agency/${agency._id}`}>
                            {agency.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            ) : (
              <CreateAgencyDialog
                onSuccess={(agencyId) => router.push(`/agency/${agencyId}`)}
              />
            )}

            <ModeToggle />

            {user ? (
              <Avatar className='h-8 w-8'>
                <AvatarImage src={user.image} alt={user.name || ''} />
                <AvatarFallback className='cursor-pointer'>
                  {user.name?.charAt(0)}
                  {user.name?.split(' ')?.pop()?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <UserCircle2 className='h-8 w-8 text-muted-foreground' />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
