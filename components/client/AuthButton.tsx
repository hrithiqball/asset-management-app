'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AuthButton() {
  return (
    <Button asChild>
      <Link href="/sign-in">Sign In</Link>
    </Button>
  );
}
