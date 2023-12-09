import React, { Fragment } from 'react';
import { task } from '@prisma/client';
import TaskItem from '@/components/server/TaskItem';
import TaskAdd from '@/components/client/task/TaskAdd';
import TaskHeader from '@/components/client/task/TaskHeader';

export default function TaskList({
  checklistUid,
  taskList,
}: {
  checklistUid: string;
  taskList: task[];
}) {
  return (
    <Fragment>
      <TaskHeader />
      {taskList.map(task => (
        <TaskItem key={task.uid} task={task} />
      ))}
      <TaskAdd checklistUid={checklistUid} />
    </Fragment>
  );
}
