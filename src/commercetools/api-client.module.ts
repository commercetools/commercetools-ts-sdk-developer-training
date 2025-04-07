import { Module, DynamicModule, Provider } from '@nestjs/common';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ClientBuilder } from '@commercetools/ts-client';
import { APIClientModuleOptions } from './api-client.constant';

export const API_ROOT = 'ApiRoot';

@Module({})
export class ApiClientModule {
  static forRoot(options: APIClientModuleOptions): DynamicModule {
    const { clientId, clientSecret, projectKey, apiUrl, authUrl } = options;

    const client = new ClientBuilder()
      .withClientCredentialsFlow({
        credentials: {
          clientId,
          clientSecret,
        },
        projectKey,
        host: authUrl,
      })
      .withHttpMiddleware({
        host: apiUrl,
      })
      .build();

    const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey,
    });

    const apiRootProvider: Provider = {
      provide: API_ROOT,
      useValue: apiRoot,
    };

    return {
      module: ApiClientModule,
      providers: [apiRootProvider],
      exports: [apiRootProvider],
      global: true,
    };
  }
}
