import React from 'react';
import { Maintenance } from '@prisma/client';

export default function AssetMaintenance({
  maintenanceList,
}: {
  maintenanceList: Maintenance[];
}) {
  return (
    <div className="flex flex-grow h-full p-4">
      AssetMaintenance count is {maintenanceList.length}
    </div>
  );
}
