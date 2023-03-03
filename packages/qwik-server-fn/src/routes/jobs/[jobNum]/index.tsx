import { component$, useSignal, useStylesScoped$ } from '@builder.io/qwik';
import { type Cookie, type FailReturn, loader$, type RequestEventLoader } from '@builder.io/qwik-city';
import { JobStateSpan } from '../../../components/jobs/job-state-span';

import { httpClient } from '../../../http/client';
import { transformDocToJob } from '../job';

export function getToken(cookie: Cookie, opts: { onNotFound: () => FailReturn<any> }): (string | FailReturn<any>) {
  const token =  cookie.get('auth_token')?.value;
  if (!token) {
    return opts.onNotFound();
  }
  return token;
}

export const useJobLoader = loader$(async (event: RequestEventLoader<any>) => {
  const { params, cookie, fail } = event;
  const token = getToken(cookie, { onNotFound: () => fail(401, { message: 'Unauthorized' }) });
  if (typeof token !== 'string') {
    return token;
  }

  const jobNumber = params.jobNum.padStart(5, '0');
  console.log(`Loading job ${jobNumber}...`);
  
  const jobs = await httpClient(
    '/api/workflows/table',
    {
      headers: { Authorization: `Bearer ${token}` },
      searchParams: {
        start: '0',
        limit: '1',
        filter: JSON.stringify({ jobNumber, isTask: false }),
      },
    }
  );

  if (jobs.length === 0) {
    return fail(404, { message: `Job ${jobNumber} not found` });
  }

  console.log(`Got Job: ${jobs[0]?.jobNumber}`);

  return transformDocToJob(jobs[0]);
});

export const RelativeDaysFromNow = component$(({ date }: { date: Date }) => {
  // Intl.RelativeTimeFormat
  const now = new Date();
  const daysAgo = -1 * Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  const value = new Intl.RelativeTimeFormat().format(daysAgo, 'day');
  return <>{ value }</>
});

export default component$(() => {
  useStylesScoped$(`
    dl dt {
      font-weight: bold;
    }
  `);
  const job = useJobLoader();
  const seeDetails = useSignal(false);

  if (!job.value) return <h1>Loading...</h1>;

  return <>
    <h1>{ job.value.readableTarget } - { job.value.readableType }</h1>
    <dl>
      <dt>Job Number</dt>
      <dd>{ job.value.jobNumber }</dd>
      <dt>Workflow ID</dt>
      <dd>{ job.value.workflowId }</dd>
      <dt>State</dt>
      <dd><JobStateSpan state={job.value.state} /></dd>
      <dt>Created At</dt>
      <dd>{job.value.createdDate ? <RelativeDaysFromNow date={job.value.createdDate} /> : 'Never'}</dd>
      <dt>Updated At</dt>
      <dd>{job.value.lastUpdated ? <RelativeDaysFromNow date={job.value.lastUpdated} /> : 'Never'}</dd>
      <dt>User Last Updated At</dt>
      <dd>{job.value.userLastUpdated ? <RelativeDaysFromNow date={job.value.userLastUpdated} /> : 'Never'}</dd>
    </dl>
    <button onClick$={() => seeDetails.value = !seeDetails.value}>{ seeDetails.value ? '[-]' : '[+]'}</button>
    {
      seeDetails.value && (<pre>
        { JSON.stringify(job.value, null, 2) }
      </pre>)
    }
  </>;
});
