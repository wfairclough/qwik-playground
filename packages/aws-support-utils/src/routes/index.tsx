import { component$ } from '@builder.io/qwik';
import { Link, routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import { type User } from './saml/sessions';

export const useCurrentUser = routeLoader$<User>((ev) => {
  const userCookie = ev.cookie.get('USER');
  if (!userCookie) {
    throw ev.redirect(302, '/auth');
  }
  const user: User = JSON.parse(Buffer.from(userCookie.value, 'base64').toString('utf8'));
  return user;
});

export default component$(() => {
  const user = useCurrentUser();
  return (<>
    <h1>SES Supression List</h1>
    <pre>{ JSON.stringify(user.value, null, 2) }</pre>
    <Link href="/email/supression-list">Email Supression List</Link>
  </>);
});

export const head: DocumentHead = {
  title: 'AWS Support Utils',
  meta: [
    {
      name: 'description',
      content: 'AWS Utilities for Support Engineers',
    },
  ],
};

