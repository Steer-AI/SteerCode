import type { Status } from '../enums/status';

export type Task = {
  id: string; // uuidv4
  status: Status;
  description: string;
  result: string | null;
  steps: TaskStep[];
};

export type TaskStep = {
  status: Status;
  description: string;
  result: string | null;
};
