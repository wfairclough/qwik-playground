import { SESv2Client } from "@aws-sdk/client-sesv2";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const credsProvider = fromCognitoIdentityPool({
  identityPoolId: '<Identity_Pool_id>',
});

export const sesClient = new SESv2Client({ region: 'us-east-1', credentials: credsProvider });
