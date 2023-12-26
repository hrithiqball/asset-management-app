import MaintenanceChecklistList from '@/components/server/MaintenanceChecklistList';
import TaskMaintenance from '@/components/client/task/TaskMaintenance';
import {
  fetchChecklistList,
  fetchChecklistLibraryList,
} from '@/app/api/server-actions';
import { maintenance } from '@prisma/client';
import React from 'react';

export default async function TaskItemPage({
  params,
  searchParams,
}: {
  params: { uid: string };
  searchParams: { maintenance: string };
}) {
  const parsedMaintenance = JSON.parse(
    searchParams.maintenance,
  ) satisfies maintenance;
  const checklistList = await fetchChecklistList(params.uid);
  const checklistLibrary = await fetchChecklistLibraryList();

  return (
    <div className="flex flex-col h-full">
      <TaskMaintenance
        maintenance={parsedMaintenance}
        checklistLibraryList={checklistLibrary}
      >
        <MaintenanceChecklistList checklistList={checklistList} />
      </TaskMaintenance>
    </div>
  );
}
