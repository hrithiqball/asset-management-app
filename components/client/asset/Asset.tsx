'use client';

import React, { useEffect, useState } from 'react';
import Loading from '@/components/client/Loading';
import { asset, checklist_use, maintenance } from '@prisma/client';
import { LuChevronLeft, LuPencilLine, LuPackagePlus } from 'react-icons/lu';
import AssetDetails from '@/components/client/asset/AssetDetails';
import AssetMaintenance from '@/components/client/AssetMaintenance';
import AssetAttachment from '@/components/client/asset/AssetAttachment';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function Asset({
  asset,
  maintenanceList,
  checklistUse,
}: {
  asset: asset;
  maintenanceList: maintenance[];
  checklistUse: checklist_use[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading label="Hang on tight" />;

  return (
    <Card className="rounded-md p-4 m-4 flex-grow">
      <div className="flex flex-row">
        <Button className="max-w-min" variant="default" asChild>
          <LuChevronLeft />
          <Link href="/asset">Back</Link>
        </Button>
        <Tabs
          aria-label="Asset Attribute"
          className="ml-4"
          defaultValue="details"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="maintenance">
              Maintenance <Badge>{maintenanceList.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="attachment">Attachment</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <AssetDetails asset={asset} checklistUse={checklistUse} />
          </TabsContent>
          <TabsContent value="maintenance">
            <AssetMaintenance maintenanceList={maintenanceList} />
          </TabsContent>
          <TabsContent value="attachment">
            <AssetAttachment />
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex flex-row justify-between items-center my-4">
        <h2 className="text-xl font-semibold">{asset.name}</h2>
        <div className="flex flex-row">
          <div className="flex flex-row">
            <Button className="ml-1" size="icon">
              <LuPencilLine />
            </Button>
            <Button className="ml-1" size="icon">
              <LuPackagePlus />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
