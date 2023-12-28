'use client';

import React, { Fragment, useEffect, useState, useTransition } from 'react';
import { TaskType, task } from '@prisma/client';
import { createTask } from '@/app/api/server-actions';
// import { selectionChoices } from '@/utils/data/task-type-options';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';

import moment from 'moment';
import { Label } from '@/components/ui/label';

export default function TaskAdd({ checklistUid }: { checklistUid: string }) {
  let [isPending, startTransition] = useTransition();
  const [taskActivity, setTaskActivity] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [selection, setSelection] = useState<TaskType>(TaskType.check);
  const [listCount, setListCount] = useState<number>(1);
  const [choices, setChoices] = useState(Array(listCount).fill('Choice 1'));

  function handleDeleteChoice(indexToDelete: number) {
    setChoices(prevChoices => {
      const newChoices = [...prevChoices];
      newChoices.splice(indexToDelete, 1);
      return newChoices;
    });
    setListCount(prevCount => Math.max(prevCount - 1, 0)); // Ensure count doesn't go below 0
  }

  function handleChoiceChange(index: number, value: string) {
    setChoices(prevChoices => {
      const newChoices = [...prevChoices];
      newChoices[index] = value;
      return newChoices;
    });
  }

  function handleAddChoice() {
    setListCount(prevCount => prevCount + 1);
    setChoices(prevChoices => [...prevChoices, '']);
  }

  function addTaskClient() {
    const taskAdd: task = {
      uid: `TK-${moment().format('YYMMDDHHmmssSSS')}`,
      checklist_uid: checklistUid,
      task_activity: taskActivity,
      description: taskDescription,
      task_type: TaskType[selection],
      list_choice: choices,
      task_bool: false,
      task_selected: [],
      is_complete: false,
      remarks: '',
      issue: '',
      deadline: null,
      completed_by: null,
      have_subtask: false,
      task_number_val: 0,
      task_check: false,
      task_order: 0,
    };

    startTransition(() => {
      createTask(taskAdd);
    });
  }

  function closeModal() {
    setSelection('check');
    setTaskActivity('');
    setTaskDescription('');
  }

  useEffect(() => {
    if (!isPending) {
      closeModal();
    }
  }, [isPending]);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Task</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-col gap-1">
            Add New Task
          </DialogHeader>
          <Label htmlFor="activity">Activity</Label>
          <Input
            required
            autoFocus
            id="activity"
            value={taskActivity}
            onChange={e => setTaskActivity(e.target.value)}
          />
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={taskDescription}
            onChange={e => setTaskDescription(e.target.value)}
          />
          {/* <Select
            required
            value={selection}
            onSelectionChange={handleSelectionChange}
          >
            {selectionChoices.map(choice => (
              <SelectItem key={choice.key} value={choice.key}>
                {choice.value}
              </SelectItem>
            ))}
          </Select> */}
          {(selection === 'selectOne' || selection === 'selectMultiple') && (
            <Fragment>
              {choices.map((choice, index) => (
                <div className="flex items-center" key={index}>
                  <Label htmlFor={`choice-select-${index + 1}`}>{`List Choice ${
                    index + 1
                  }`}</Label>
                  <Input
                    id={`choice-select-${index + 1}`}
                    value={choice}
                    onChange={e => handleChoiceChange(index, e.target.value)}
                  />
                  <Button
                    className="ml-2"
                    size="icon"
                    onClick={() => handleDeleteChoice(index)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <Button onClick={() => handleAddChoice()}>Add Choice</Button>
            </Fragment>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button color="error" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={
                taskActivity === '' ||
                (selection === 'selectOne' && listCount < 2) ||
                (selection === 'selectMultiple' && listCount < 2)
              }
              color="primary"
              onClick={() => {
                addTaskClient();
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
