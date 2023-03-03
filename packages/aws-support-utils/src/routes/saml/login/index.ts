import { type RequestHandler } from '@builder.io/qwik-city';
import { type CreateLoginRequestUrlOptions } from 'saml2-js';

export const onRequest: RequestHandler = async (ev) => {
  const { promisify } = await import('util');
  
  const { awsIdentityProvider } = await import('../acs/idp-assert');
  const { serviceProvider } = await import('../service-provider');
  
  const createLoginRequestUrl = promisify(serviceProvider.create_login_request_url).bind(serviceProvider);
  console.log(`/saml/login: onRequest`, { ev });
  const opt: CreateLoginRequestUrlOptions = {
    relay_state: 'aws',
    nameid_format: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
  };
  
  try {
    const loginUrl = await createLoginRequestUrl(awsIdentityProvider, opt);
    console.log(`loginUrl`, { loginUrl: loginUrl.substring(0, 50) });
    ev.redirect(301, loginUrl);
    return;
  } catch (err) {
    const error = err as any;
    ev.error(500, error?.message ?? `Error`);
    return;
  }
}
