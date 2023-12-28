'use client';

import React, { useState, useTransition } from 'react';
import { task } from '@prisma/client';
import { deleteTask, updateTask } from '@/app/api/server-actions';
import { UpdateTask } from '@/app/api/task/[uid]/route';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';

export default function TaskRow({ task }: { task: task }) {
  let [isPending, startTransition] = useTransition();
  const [taskActivity, setTaskActivity] = useState(task.task_activity);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [taskType, setTaskType] = useState(task.task_type);
  const [taskBool, setTaskBool] = useState(task.task_bool ?? false);
  const [taskRemark, setTaskRemark] = useState(task.remarks ?? '');
  const [taskIsComplete, setTaskIsComplete] = useState(task.is_complete);
  const [taskIssue, setTaskIssue] = useState(task.issue ?? '');
  const [taskNumberValue, setTaskNumberValue] = useState<string>(
    task.task_number_val?.toString() ?? '',
  );

  function updateTaskClient(taskUpdate: UpdateTask) {
    startTransition(() => {
      updateTask(task.uid, taskUpdate).then(() => {
        toast.success('Task updated successfully');
      });
      if (!isPending) console.log('success');
    });
  }

  function handleDelete() {
    startTransition(() => {
      deleteTask(task.uid)
        .then(() => toast.success('Task deleted'))
        .catch(() => toast.error('Task not deleted'));
    });
  }

  return (
    <div className="flex items-center">
      <div className="flex-1 px-4">
        <div className="flex flex-col">
          <span className="text-medium font-medium">{taskActivity}</span>
          <span className="text-sm font-thin">{taskDescription}</span>
        </div>
      </div>
      <div className="flex-1 px-4">
        {taskType === 'check' && (
          <div className="flex justify-center">
            <Checkbox
              aria-label="Task Checkbox"
              checked={taskIsComplete}
              onCheckedChange={() => {
                setTaskIsComplete(!taskIsComplete);
                const updateTask: UpdateTask = {
                  is_complete: !taskIsComplete,
                };
                updateTaskClient(updateTask);
              }}
            />
          </div>
        )}
        {taskType === 'choice' && (
          <div className="flex justify-center">
            <Switch
              aria-label="Task Switch"
              className="flex-1"
              checked={taskBool}
              onCheckedChange={() => {
                setTaskBool(!taskBool);
                const taskUpdate: UpdateTask = {
                  task_bool: !taskBool,
                };
                updateTaskClient(taskUpdate);
              }}
            />
          </div>
        )}
        {(taskType === 'selectOne' || taskType === 'selectMultiple') && (
          // <Select
          //   aria-label="Task Select"
          //   variant="faded"
          //   selectedKeys={taskSelected}
          //   selectionMode={
          //     taskType === 'selectMultiple' ? 'multiple' : 'single'
          //   }
          //   onSelectionChange={handleSelectionChange}
          //   size="sm"
          //   placeholder="Choose one"
          // >
          //   {task.list_choice.map(choice => (
          //     <SelectItem key={choice} value={choice}>
          //       {choice}
          //     </SelectItem>
          //   ))}
          // </Select>
          <span>Hye headless ui</span>
        )}
        {taskType === 'number' && (
          <Input
            aria-label="Task Number"
            value={taskNumberValue}
            onChange={e => setTaskNumberValue(e.target.value)}
          />
        )}
      </div>
      <div className="flex-1 px-4">
        <Textarea
          aria-label="Task Issue"
          value={taskIssue}
          onChange={e => setTaskIssue(e.target.value)}
        />
      </div>
      <div className="flex-1 px-4">
        <Textarea
          aria-label="Task Remark"
          value={taskRemark}
          onChange={e => setTaskRemark(e.target.value)}
        />
      </div>
      <div className="flex-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => toast.info('edit')}>
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
