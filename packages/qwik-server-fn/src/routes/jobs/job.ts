
export enum JobState {
  New = 1,
  Active = 2,
  Completed = 3,
  Cancelled = 4,
}

export interface Job {
  _id: string;
  ownerId: string;
  workflowId: string;
  jobNumber: string;
  isTask: boolean;
  type: string;
  timezone: string;
  readableType: string;
  readableTarget: string;
  targetId: string;
  targetType: string;
  target: any;
  data: any;
  dueDate?: Date;
  createdDate: Date;
  lastUpdated: Date;
  userLastUpdated?: Date;
  userLastUpdatedBy?: string;
  log: any[];
  state: JobState;
  userState: string;
}

export function transformDocToJob(doc: any): Job {
  const job = JSON.parse(JSON.stringify(doc));
  console.log({ job });
  return {
    ...job,
    createdDate: new Date(job.createdDate),
    lastUpdated: job.lastUpdated && new Date(job.lastUpdated),
    dueDate: job.dueDate && new Date(job.dueDate),
    userLastUpdated: job.userLastUpdated && new Date(job.userLastUpdated),
  } as Job
}
