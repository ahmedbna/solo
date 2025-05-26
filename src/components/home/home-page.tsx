'use client';

import { useState } from 'react';
import { Header } from '../layout/header';
import { Trips } from '../trips/trips';

export const HomePage = () => {
  const [searchParams, setSearchParams] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className='min-h-screen'>
      <Header />

      <Trips />

      {/* <SearchSection onSearch={handleSearch} isSearching={isSearching} /> */}

      {/* {searchParams ? (
        <SearchResults searchParams={searchParams} />
      ) : (
        <FeaturedTrips />
      )} */}
    </div>
  );
};
