export type Conversation = {
    // TODO: implement model
    id: string;
    agent_name: string;
    agent_role: string;
    agent_goal: string;
    
    status: 'running' | 'waiting';
    tasks: Task[];
}

export type Task = {
    id: string;
    status: 'running' | 'completed' | 'failed' | 'waiting';
    name: string;
    result: string | null;
    steps: TaskStep[];
}

export type TaskStep = {
    status: 'running' | 'completed' | 'failed' | 'waiting';
    name: string;
    result: string | null;
}