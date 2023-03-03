import { component$ } from "@builder.io/qwik";
import { JobState } from "../../routes/jobs/job";

export const JobStateSpan = component$(({ state }: { state?: JobState }) => {
  switch (state) {
  case JobState.New:
    return <span>New</span>;
  case JobState.Active:
    return <span>Active</span>;
  case JobState.Completed:
    return <span>Completed</span>;
  case JobState.Cancelled:
    return <span>Cancelled</span>;
  }
  return <span>Unknown</span>;
});
