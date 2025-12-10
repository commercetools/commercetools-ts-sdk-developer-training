import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ClientBuilder } from '@commercetools/ts-client';
import fetch from 'node-fetch';
import 'dotenv/config';

const projectKey = process.env.CTP_PROJECT_KEY!;
const clientId = process.env.CTP_CLIENT_ID!;
const clientSecret = process.env.CTP_CLIENT_SECRET!;
const authUrl = process.env.CTP_AUTH_URL!;
const apiUrl = process.env.CTP_API_URL!;

const client = new ClientBuilder()
  .withClientCredentialsFlow({
    credentials: { clientId, clientSecret },
    projectKey,
    host: authUrl,
    httpClient: fetch,
  })
  .withHttpMiddleware({ host: apiUrl, httpClient: fetch })
  .build();

export const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });