import type { Status } from '../enums/status';
import type { Task } from './task.type';

// Model used to create a new agent
export type NewAgentDTO = {
  name: string;
  role: string;
  goal: string;
  tasks: string[];
  search_mode: boolean;
};

// Model retrieved from backend
export type AgentDTO = {
  id: string;
  name: string;
  role: string;
  goal: string;
  result: string | null;
  status: Status;
  tasks: Task[];
};
