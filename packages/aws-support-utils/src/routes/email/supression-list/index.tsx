import { type ListSuppressedDestinationsCommandOutput } from '@aws-sdk/client-sesv2';
import { component$ } from '@builder.io/qwik';
import { type DocumentHead, Form, action$, loader$ } from '@builder.io/qwik-city';
import { sesClient } from '../../../aws/ses/ses-client';
import { ListSuppressedDestinationsCommand } from '@aws-sdk/client-sesv2';

function supressedDestinationsAsyncIterator(): AsyncIterableIterator<ListSuppressedDestinationsCommandOutput> {
  let page = 0;
  let token: string | undefined = undefined;
  // console.log('supressedDestinationsAsyncIterator', { page });
  return {
    async next() {
      if (page !== 0 && !token) {
        return {
          done: true,
          value: null,
        };
      }
      const listSuppressedDestinationsCommand = new ListSuppressedDestinationsCommand({
        PageSize: 1000,
        NextToken: token,
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
      const listSuppressedDestinationsResponse = await sesClient.send(listSuppressedDestinationsCommand);
      token = listSuppressedDestinationsResponse.NextToken;
      console.log(`listSuppressedDestinationsResponse Page ${page} ${token}`);
      page++;
      return {
        done: false,
        value: listSuppressedDestinationsResponse,
      };
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

export const useSupressionList = loader$(async (ev) => {
  const { sesClient } = await import('../../../aws/ses/ses-client');
  const { ListSuppressedDestinationsCommand } = await import('@aws-sdk/client-sesv2');
  console.log('useSupressionList');
  const listSuppressedDestinationsCommand = new ListSuppressedDestinationsCommand({
    PageSize: Number(ev.query.get('pageSize') || 1000) ?? 1000,
    NextToken: ev.query.get('nextToken') ?? undefined,
  });
  const listSuppressedDestinationsResponse = await sesClient.send(listSuppressedDestinationsCommand);
  
  return listSuppressedDestinationsResponse;
});

export const useEmailCheckAction = action$(async (formData, ev) => {
  // console.log('useEmailCheckAction', { ev });
  const email = formData.email?.toString()?.trim();
  try {
    for await (const listSuppressedDestinationsResponse of supressedDestinationsAsyncIterator()) {
      console.log('listSuppressedDestinationsResponse', { r: listSuppressedDestinationsResponse.SuppressedDestinationSummaries?.length });
      const summary = listSuppressedDestinationsResponse.SuppressedDestinationSummaries?.find((summary) => summary.EmailAddress === email);
      if (summary) {
        // throw ev.redirect(302, `/email/supression-list?emailExists=true&email=${email}`);
        return { found: true, summary };
      }
    }
  } catch (err) {
    console.error(err);
  }
  return { found: false }
});

export default component$(() => {
  console.log('render /email/supression-list');
  const supressionList = useSupressionList();
  // const loc = useLocation();
  // const nav = useNavigate();
  const action = useEmailCheckAction();
  return (<>
  <div>
    <Form action={action}>
      <input type="email" name="email" />
      <button disabled={action.isRunning} type="submit">Check</button>
      {action.value?.found && <div>{ action.value.summary?.Reason }</div>}
      {action.value?.found === false && <div>Not on supression list</div>}
    </Form>
    {/* <button onClick$={async () => {
      if (supressionList.value.NextToken) {
        const url = loc.url;
        url.protocol = 'https';
        url.searchParams.set('nextToken', supressionList.value.NextToken);
        console.log(`url: ${url.toString()}`);
        await nav(url.toString());
      }
    }}>Next</button>
   */}
    <pre>
      { JSON.stringify(supressionList.value, null, 2)}
    </pre>
  </div>
  </>);
});


export const head: DocumentHead = {
  title: 'Supression List',
  meta: [
    {
      name: 'description',
      content: 'AWS Email Supression List',
    },
  ],
};

