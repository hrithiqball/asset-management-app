import React from 'react';
import { Loader2 } from 'lucide-react';

const Icons = {
  spinner: Loader2,
};

export default function Loading({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <Icons.spinner className="h-4 w-4 animate-spin" />
      <span className="ml-4">{label}</span>
    </div>
  );
}
