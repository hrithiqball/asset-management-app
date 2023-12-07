import React from 'react';
import SubtaskList from '@/components/server/SubtaskList';
import { fetchSubtaskListByTaskUid } from '@/utils/actions/route';
import { subtask, task } from '@prisma/client';
import TaskRow from '../client/TaskRow';

export default async function TaskItem({ task }: { task: task }) {
  let subtaskResult;
  let subtaskData: subtask[] = [];

  if (task.have_subtask) {
    subtaskResult = await fetchSubtaskListByTaskUid(task.uid);
    subtaskData = subtaskResult.data ?? [];
  }

  return (
    <div>
      <TaskRow task={task} />
      {task.have_subtask && (
        <div className="mt-2">
          <SubtaskList subtaskList={subtaskData} />
        </div>
      )}
    </div>
  );
}
