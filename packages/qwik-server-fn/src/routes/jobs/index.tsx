import { $, component$, useId } from '@builder.io/qwik';
import { action$, FailReturn, Form, Link, loader$, RequestEventLoader, useLocation, useNavigate } from '@builder.io/qwik-city';

import { DateLocaleFormat } from '../../components/dates/date-locale-format';
import { JobStateSpan } from '../../components/jobs/job-state-span';
import { httpClient } from '../../http/client';
import { transformDocToJob } from './job';

export const useJobsLoader = loader$(async (event: RequestEventLoader<any>) => {
  const { query, cookie, fail } = event;
  const token = cookie.get('auth_token')?.value;
  console.log({ query });
  if (!token) {
    return fail(401, { message: 'Unauthorized' });
  }
  
  const search = query.get('q') || '';
  const skip = query.get('skip') || '0';
  const limit = query.get('limit') || '25';
  const jobs = await httpClient(
    '/api/workflows/table',
    {
      headers: { Authorization: `Bearer ${token}` },
      searchParams: {
        start: skip,
        limit,
        ...(search && { filter: JSON.stringify({ _postFilter: { __keyword: search } }) }),
      },
    },
  );

  return jobs.map(transformDocToJob);
});

export default component$(() => {
  const searchId = useId();
  const jobs = useJobsLoader();
  const location = useLocation();
  const nav = useNavigate();
  
  const nextPage = $(() => {
    const skip = (Number(location.url.searchParams.get('skip')) || 0) + 50;
    location.url.searchParams.set('skip', skip.toString());
    nav(location.url.toString());
  });

  if ((jobs.value as FailReturn<any>)?.failed) {
    return <div>Failed</div>;
  }

  return <>
    <form preventdefault:submit onSubmit$={(e, form) => {
      if (form.search.value) {
        location.url.searchParams.set('q', form.search.value);
      } else {
        location.url.searchParams.delete('q');
      }
      nav(location.url.toString());
    }}>
      <label for={searchId}>Search</label>
      <input id={searchId} type="text" name="search" />
      
      <button type="submit">Search</button>
    </form>
    <table>
      <thead>
        <tr>
          <th>Job Number</th>
          <th>Target</th>
          <th>Type</th> 
          <th>State</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        { jobs.value?.map(job => (
          <tr>
            <td><Link href={'/jobs/' + job.jobNumber}>{ job.jobNumber }</Link></td>
            <td>{ job.readableTarget }</td>
            <td>{ job.readableType }</td>
            <td><JobStateSpan state={job.state} /></td>
            <td><DateLocaleFormat date={job.createdDate} locale="en-CA" /></td>
          </tr>
        )) }
      </tbody>
    </table>
    {/* Pagination */}
    <button onClick$={nextPage}>Next</button>
  </>;
});
