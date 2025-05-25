'use client';

import { ReactNode } from 'react';
import { ConvexReactClient } from 'convex/react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const ConvexAuthenticationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
};
