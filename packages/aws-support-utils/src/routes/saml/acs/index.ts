import { type RequestHandler } from '@builder.io/qwik-city';
import { type PostAssertOptions } from 'saml2-js';

const ONE_HR_MS = 1000 * 60 * 60;


export const onRequest: RequestHandler = async (ev) => {
  const { promisify } = await import('util');
  const crypto = await import('crypto');
  
  const { serviceProvider } = await import('../service-provider');
  const { awsIdentityProvider } = await import('./idp-assert');
  const { addSession } = await import('../sessions');
  const postAssert = promisify(serviceProvider.post_assert).bind(serviceProvider);
  const body = await ev.parseBody();
  console.log(`/saml/acs: onRequest`, { ev, body });
  const opt: PostAssertOptions = {
    audience: 'https://f82a563bbea7.ngrok.io/saml/metadata.xml',
    request_body: body as any,
  };
  try {
    const response = await postAssert(awsIdentityProvider, opt);
    const user = structuredClone(response.user);
    const sessionId = crypto.randomUUID();
    user.attributes = {
      ...user.attributes,
      sessionId,
    };
    addSession(user);
    console.log({ response });
    const b64User = Buffer.from(JSON.stringify(user)).toString('base64');
    ev.cookie.set('USER', b64User, { httpOnly: true, path: '/', expires: new Date(user.session_not_on_or_after ?? Date.now() + ONE_HR_MS) });
    // ev.json(200, { response });

    // redirect to home page
    ev.html(200, `<!DOCTYPE html>
    <html>
    <head>
      <title>Success</title>
      <meta http-equiv="refresh-NOT" content="0; url='/'" />
    </head>
    <body>
      <h1>Success</h1>
      <p>${sessionId}</p>
      <pre>${JSON.stringify(response, null, 2)}</pre>
    </body>
    </html>`);
    // ev.redirect(301, '/');
  } catch (err) {
    const error = err as any;
    throw ev.error(500, error?.message ?? `Error`);
  }
}
