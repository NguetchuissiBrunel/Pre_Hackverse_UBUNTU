"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, Task } from "@/lib/db/dexie";

export function useTasks() {
  const tasks = useLiveQuery(() => db.tasks.orderBy('createdAt').reverse().toArray(), []);

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'actualPomodoros'>) => {
    const now = new Date();
    return await db.tasks.add({
      ...task,
      actualPomodoros: 0,
      createdAt: now,
      updatedAt: now,
    });
  };

  const updateTask = async (id: number, changes: Partial<Task>) => {
    return await db.tasks.update(id, {
      ...changes,
      updatedAt: new Date(),
    });
  };

  const deleteTask = async (id: number) => {
    return await db.tasks.delete(id);
  };

  const toggleTaskCompleted = async (task: Task) => {
    if (!task.id) return;
    return await updateTask(task.id, { completed: !task.completed });
  };

  const incrementTaskPomodoro = async (id: number) => {
    const task = await db.tasks.get(id);
    if (task) {
      return await updateTask(id, { actualPomodoros: task.actualPomodoros + 1 });
    }
  };

  return {
    tasks: tasks || [],
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompleted,
    incrementTaskPomodoro,
  };
}
