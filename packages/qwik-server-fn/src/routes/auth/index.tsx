import { component$, useId, useStylesScoped$ } from '@builder.io/qwik';
import { action$, Form, type DocumentHead } from '@builder.io/qwik-city';
import crypto from 'crypto';
import { httpClient, HttpErrorResponse } from '../../http/client';

export const useLoginAction = action$(
  async (form, { fail, redirect, cookie }, options) => {
    console.log({ form, options });
    const passwordSha256 = crypto.createHash('sha256').update(form.password.toString()).digest('hex');
    try {
      const res = await httpClient('/api/login', {
        body: {
          username: form.email.toString(),
          password: passwordSha256,
        },
      });
      console.log({ res });
      cookie.set('auth_token', res?.token ?? 'asdasd', { httpOnly: true, path: '/' });
      return redirect(302, '/jobs');
    } catch (err) {
      if (err instanceof HttpErrorResponse) { 
        return fail(err.status, { message: err.message ?? 'Authentication Failure' });
      }
      return fail(500, { message: (err as any)?.message ?? 'Authentication Failure' });
    }
  },
  // zod$({
  //   email: z.string(),
  //   password: z.string(),
  // }),
);

export default component$(() => {
  const action = useLoginAction();
  const emailId = useId();
  const passwordId = useId();

  useStylesScoped$(`
    .login-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    form {
      display: flex;
      flex-direction: column;
    }
  `);

  return <div class="login-page">
    <h1>Welcome to SuiteSpot</h1>

    <Form action={action}>
      <label for={emailId}>Email</label>
      <input id={emailId} type="email" name="email" required />

      <label for={passwordId}>Password</label>
      <input id={passwordId} type="password" name="password" required />
      
      <button type="submit">Login</button>
    </Form>
    {action.value?.failed && <div>{action.value.message}</div>}
  </div>;
});

export const head: DocumentHead = {
  title: 'SuiteSpot Login',
  meta: [
    {
      name: 'description',
      content: 'Authenticate with the SuiteSpot platform',
    },
  ],
};
