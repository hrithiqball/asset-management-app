'use client';

import React, { Key, useEffect, useState } from 'react';
import { Card, Tab, Tabs } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import Overview from './Overview';
import Calendar from './Calendar';
import Report from './Report';

export default function Dashboard() {
  const [activeComponent, setActiveComponent] = useState('overview');
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const renderComponent = () => {
    switch (activeComponent) {
      case 'overview':
        return <Overview />;
      case 'report':
        return <Report />;
      case 'calendar':
        return <Calendar />;
      default:
        return null;
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Card
      className={`rounded-md p-4 m-4 flex-grow ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
      }`}
    >
      <Tabs
        radius="md"
        color="primary"
        aria-label="Tabs radius"
        onSelectionChange={(key: Key) => {
          setActiveComponent(key as string);
        }}
      >
        <Tab key="overview" title="Overview" />
        <Tab key="report" title="Report" />
        <Tab key="calendar" title="Calendar" />
      </Tabs>
      <div className="flex-grow h-100 mt-4">{renderComponent()}</div>
    </Card>
  );
}
