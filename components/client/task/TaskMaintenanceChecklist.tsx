'use client';

import React from 'react';
import { checklist } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function TaskMaintenanceChecklist({
  checklist,
  children,
}: {
  checklist: checklist;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex-1 h-full p-4">
      <p className="font-bold text-lg">{checklist.title}</p>
      <Separator className="my-4" />
      {/* <div className="flex flex-col space-y-2">{children}</div> */}
      hello
    </Card>
  );
}
