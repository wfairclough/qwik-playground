import { IdentityProvider } from 'saml2-js';

const certificate = `-----BEGIN CERTIFICATE-----\n\n-----END CERTIFICATE-----`;


const idp_options = {
  sso_login_url: `https://portal.sso.ca-central-1.amazonaws.com/saml/assertion/<ID_HERE<>`,
  sso_logout_url: `https://portal.sso.ca-central-1.amazonaws.com/saml/logout/<ID_HERE<>`,
  certificates: [
    certificate,
    // idc_certificate,
  ],
  // force_authn: true,
  // sign_get_request: false,
  // allow_unencrypted_assertion: false,
};

// Call identity provider constructor with options
export const awsIdentityProvider = new IdentityProvider(idp_options);

