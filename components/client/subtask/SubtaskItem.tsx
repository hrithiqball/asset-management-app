'use client';

import React, { KeyboardEvent, useState, useTransition } from 'react';
import { subtask } from '@prisma/client';
import { updateSubtask } from '@/app/api/server-actions';
import { UpdateSubtask } from '@/app/api/subtask/[uid]/route';
import { LuCornerDownRight, LuMoreVertical } from 'react-icons/lu';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export enum InputType {
  remarks,
  issue,
  numberVal,
}

export default function SubtaskItem({ subtask }: { subtask: subtask }) {
  let [isPending, startTransition] = useTransition();
  const [subtaskIsComplete, setSubtaskIsComplete] = useState(
    subtask.is_complete,
  );
  const [subtaskActivity, setSubtaskActivity] = useState(subtask.task_activity);
  const [subtaskDescription, setSubtaskDescription] = useState(
    subtask.description,
  );
  const [taskType, setTaskType] = useState(subtask.task_type);
  const [taskSelected, setTaskSelected] = useState<string[]>(
    subtask.task_selected,
  );
  const [taskBool, setTaskBool] = useState(subtask.task_bool ?? false);
  const [subtaskIssue, setSubtaskIssue] = useState(subtask.issue ?? '');
  const [subtaskRemarks, setSubtaskRemarks] = useState(subtask.remarks ?? '');
  const [taskNumberValue, setTaskNumberValue] = useState<string>(
    subtask.task_number_val?.toString() ?? '',
  );

  function handleEnter(
    event: KeyboardEvent<HTMLInputElement>,
    type: InputType,
  ) {
    if (event.key !== 'Enter') return;
    let updateSubtask: UpdateSubtask = {};
    if (type === InputType.remarks) updateSubtask.remarks = subtaskRemarks;
    if (type === InputType.issue) updateSubtask.issue = subtaskIssue;
    if (type === InputType.numberVal)
      updateSubtask.task_number_val = parseInt(taskNumberValue, 10);

    updateSubtaskClient(updateSubtask);
  }

  function updateSubtaskClient(subtaskUpdate: UpdateSubtask) {
    startTransition(() => {
      updateSubtask(subtask.uid, subtaskUpdate);
      if (!isPending) console.log('completed');
    });
  }

  return (
    <div className="flex items-center">
      <div className="flex-1 px-4">
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <LuCornerDownRight />
            <span className="text-medium font-medium ml-2">
              {subtaskActivity}
            </span>
          </div>
          <span className="text-sm font-thin">{subtaskDescription}</span>
        </div>
      </div>
      <div className="flex-1 px-4">
        {taskType === 'check' && (
          <div className="flex justify-center">
            <Checkbox
              checked={subtaskIsComplete}
              onCheckedChange={() => {
                setSubtaskIsComplete(!subtaskIsComplete);
                const updateSubtask: UpdateSubtask = {
                  is_complete: !subtaskIsComplete,
                };
                updateSubtaskClient(updateSubtask);
              }}
            />
          </div>
        )}
        {taskType === 'choice' && (
          <div className="flex justify-center">
            <Switch
              checked={taskBool}
              onCheckedChange={() => {
                setTaskBool(!taskBool);
                const taskUpdate: UpdateSubtask = {
                  task_bool: !taskBool,
                };
                updateSubtaskClient(taskUpdate);
              }}
              className="flex-1"
            />
          </div>
        )}
        {/* TODO: migrate to headless ui react */}
        {(taskType === 'selectOne' || taskType === 'selectMultiple') && (
          <Select>
            <SelectTrigger>
              <SelectValue>
                {taskSelected.length > 0 ? taskSelected[0] : 'Select'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {subtask.list_choice.map(choice => (
                  <SelectItem key={choice} value={choice}>
                    {choice}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        {taskType === 'number' && (
          <Input
            value={taskNumberValue}
            onChange={e => setTaskNumberValue(e.target.value)}
            onKeyDown={e => handleEnter(e, InputType.numberVal)}
          />
        )}
      </div>
      <div className="flex-1 px-4">
        <Input
          value={subtaskIssue}
          onChange={e => setSubtaskIssue(e.target.value)}
          onKeyDown={e => handleEnter(e, InputType.issue)}
        />
      </div>
      <div className="flex-1 px-4">
        <Input
          onChange={e => setSubtaskRemarks(e.target.value)}
          value={subtaskRemarks}
          onKeyDown={e => handleEnter(e, InputType.remarks)}
        />
      </div>
      <div className="flex-2 hover:cursor-not-allowed">
        <LuMoreVertical />
      </div>
    </div>
  );
}
