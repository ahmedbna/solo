'use client';

import { useEffect, useState } from 'react';
import { Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GetCountries } from 'react-country-state-city';
import { Country } from 'react-country-state-city/dist/esm/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const Hero = () => {
  const [open, setOpen] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [tripType, setTripType] = useState('domestic');
  const [countries, setCountries] = useState<Country[]>([]);

  const [fromCountry, setFromCountry] = useState('Egypt');
  const [toCountry, setToCountry] = useState('');

  useEffect(() => {
    GetCountries().then((_countries) => setCountries(_countries));
  }, []);

  const fc = countries.find((country) => country.name === fromCountry);
  const tc = countries.find((country) => country.name === toCountry);

  return (
    <section>
      <Tabs
        value={tripType}
        defaultValue={tripType}
        onValueChange={setTripType}
        className='w-[400px]'
      >
        <TabsList>
          <TabsTrigger value='domestic'>Domestic</TabsTrigger>
          <TabsTrigger value='international'>International</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className='flex items-end gap-4 mt-4'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            {fc ? (
              <Button
                variant='ghost'
                role='combobox'
                aria-expanded={open}
                className='w-fit h-fit'
              >
                <div className='flex items-center gap-2'>
                  <span className='text-5xl font-bold'>{fc.name}</span>
                  <span className='text-5xl pt-2'>{fc.emoji}</span>
                </div>
              </Button>
            ) : (
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={openTo}
                className='w-[200px] justify-between'
              >
                {'Select Contry...'}
                <ChevronsUpDown className='opacity-50' />
              </Button>
            )}
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0'>
            <Command>
              <CommandInput placeholder='Search country...' className='h-9' />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {countries.map((country) => (
                    <CommandItem
                      key={country.name}
                      value={country.name}
                      onSelect={(currentValue) => {
                        setFromCountry(
                          currentValue === fromCountry ? '' : currentValue
                        );
                        setOpen(false);
                      }}
                    >
                      {country.emoji} {country.name}
                      <Check
                        className={cn(
                          'ml-auto',
                          fromCountry === country.name
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {tripType === 'international' ? (
          <div className='flex items-center gap-4'>
            <Plane className='h-8 w-8 rotate-45' />

            <Popover open={openTo} onOpenChange={setOpenTo}>
              <PopoverTrigger asChild>
                {tc ? (
                  <Button
                    variant='ghost'
                    role='combobox'
                    aria-expanded={openTo}
                    className='w-fit h-fit'
                  >
                    <div className='flex items-center gap-2'>
                      <span className='text-5xl font-bold'>{tc.name}</span>
                      <span className='text-5xl pt-2'>{tc.emoji}</span>
                    </div>
                  </Button>
                ) : (
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={openTo}
                    className='w-[200px] justify-between'
                  >
                    {'Select Contry...'}
                    <ChevronsUpDown className='opacity-50' />
                  </Button>
                )}
              </PopoverTrigger>
              <PopoverContent className='w-[200px] p-0'>
                <Command>
                  <CommandInput
                    placeholder='Search country...'
                    className='h-9'
                  />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          key={country.name}
                          value={country.name}
                          disabled={fromCountry === country.name}
                          onSelect={(currentValue) => {
                            setToCountry(
                              currentValue === toCountry ? '' : currentValue
                            );
                            setOpenTo(false);
                          }}
                        >
                          {country.emoji} {country.name}
                          <Check
                            className={cn(
                              'ml-auto',
                              toCountry === country.name
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        ) : null}
      </div>
    </section>
  );
};
