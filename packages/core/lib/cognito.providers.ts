import {
  COGNITO_IDENTITY_PROVIDER_CLIENT_INSTANCE_TOKEN,
  COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
  COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
  COGNITO_MODULE_OPTIONS,
} from "./cognito.constants";
import {
  createCognitoIdentityProviderClientInstance,
  createCognitoIdentityProviderInstance,
  createCognitoJwtVerifierInstance,
} from "./utils/cognito.utils";

export const cognitoProviders = [
  {
    provide: COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
    useFactory: createCognitoIdentityProviderInstance,
    inject: [COGNITO_MODULE_OPTIONS],
  },
  {
    provide: COGNITO_IDENTITY_PROVIDER_CLIENT_INSTANCE_TOKEN,
    useFactory: createCognitoIdentityProviderClientInstance,
    inject: [COGNITO_MODULE_OPTIONS],
  },
  {
    provide: COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
    useFactory: createCognitoJwtVerifierInstance,
    inject: [COGNITO_MODULE_OPTIONS],
  },
];
