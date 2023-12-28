'use client';

import React, { useEffect, useState } from 'react';
import Overview from '@/components/client/Overview';
import Calendar from '@/components/client/Calendar';
import Report from '@/components/client/Report';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Card className="rounded-md p-4 m-4 flex-grow">
      <Tabs aria-label="Tabs">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Overview />
        </TabsContent>
        <TabsContent value="report">
          <Report />
        </TabsContent>
        <TabsContent value="calendar">
          <Calendar />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
