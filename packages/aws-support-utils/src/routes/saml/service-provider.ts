import { ServiceProvider, type ServiceProviderOptions } from 'saml2-js';

const privateKey = `-----BEGIN PRIVATE KEY-----\n-----END PRIVATE KEY-----`;
const certificate = `-----BEGIN CERTIFICATE-----\n-----END CERTIFICATE-----`; // readFileSync("cert-file.crt").toString();

const baseUrl = process.env['NGROK_URL'] || 'https://support-utils.suitespot.dev';

const spOptions: ServiceProviderOptions = {
  entity_id: `${baseUrl}/saml/metadata.xml`,
  private_key: privateKey,
  certificate: certificate,
  assert_endpoint: `${baseUrl}/saml/asc`,
  force_authn: false,
  // auth_context: { comparison: `exact`, class_refs: [`urn:oasis:names:tc:SAML:1.0:am:password`] },
  nameid_format: `urn:oasis:names:tc:SAML:2.0:nameid-format:transient`,
  // nameid_format: `urn:oasis:names:tc:SAML:2.0:nameid-format:persistent`,
  sign_get_request: false,
  allow_unencrypted_assertion: true,
};

// Call service provider constructor with options
export const serviceProvider = new ServiceProvider(spOptions);

// Example use of service provider.
// Call metadata to get XML metatadata used in configuration.
export const metadata = serviceProvider.create_metadata();
