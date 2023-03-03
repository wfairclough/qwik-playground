import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { type CreateLoginRequestUrlOptions } from 'saml2-js';

export const useLoginUrl = routeLoader$<string>(async () => {
  const { awsIdentityProvider } = await import('../saml/acs/idp-assert');
  const { promisify } = await import('util');
  const { serviceProvider } = await import('../saml/service-provider');
  const createLoginRequestUrl = promisify(serviceProvider.create_login_request_url).bind(serviceProvider);
  const opt: CreateLoginRequestUrlOptions = {
    relay_state: 'support_utils',
    nameid_format: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
  };
  
  const loginUrl = await createLoginRequestUrl(awsIdentityProvider, opt);
  return loginUrl;
});

export default component$(() => {
  const loginUrl = useLoginUrl();
  return <div>
    <a href={loginUrl.value}>
    {/* <a href="/saml/login"> */}
      AWS Login
    </a>
  </div>
});
