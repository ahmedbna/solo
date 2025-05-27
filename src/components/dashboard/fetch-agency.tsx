'use client';

import { Id } from '@/convex/_generated/dataModel';
import { Dashboard } from './dashboard';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Spinner } from '../ui/spinner';

type Props = {
  agencyId: Id<'agencies'>;
};

export const FetchAgency = ({ agencyId }: Props) => {
  const agency = useQuery(api.agencies.get, { agencyId });

  if (agency === undefined) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (agency === null) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <div>Not found</div>
      </div>
    );
  }

  return <Dashboard agency={agency} />;
};
