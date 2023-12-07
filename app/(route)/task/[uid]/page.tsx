import MaintenanceChecklistList from '@/components/server/MaintenanceChecklistList';
import Navigation from '@/components/client/Navigation';
import SignOutItem from '@/components/client/SignOutItem';
import TaskMaintenance from '@/components/client/TaskMaintenance';
import {
  readUserInfo,
  fetchChecklistListByMaintenanceId,
} from '@/utils/actions/route';
import { maintenance } from '@prisma/client';
import React from 'react';

export default async function TaskItemPage({
  params,
  searchParams,
}: {
  params: { uid: string };
  searchParams: { maintenance: string };
}) {
  const userInfo = await readUserInfo();
  const parsedMaintenance = JSON.parse(
    searchParams.maintenance,
  ) satisfies maintenance;
  const checklistResult = await fetchChecklistListByMaintenanceId(params.uid);
  const checklistData = checklistResult.data ?? [];

  return (
    <div className="flex flex-col h-screen">
      <Navigation user={userInfo}>
        <SignOutItem />
      </Navigation>
      <TaskMaintenance maintenance={parsedMaintenance}>
        <MaintenanceChecklistList
          maintenance={parsedMaintenance}
          checklistList={checklistData}
        />
      </TaskMaintenance>
    </div>
  );
}