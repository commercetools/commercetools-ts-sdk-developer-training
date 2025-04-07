import { Module, DynamicModule, Provider } from '@nestjs/common';
import { createApiBuilderFromCtpClient } from '@commercetools/importapi-sdk';
import { ClientBuilder } from '@commercetools/ts-client';
import { APIClientModuleOptions } from './api-client.constant';

export const IMPORT_API_ROOT = 'ImportApiRoot';

@Module({})
export class ImportApiClientModule {
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

    const importApiRoot = createApiBuilderFromCtpClient(
      client,
    ).withProjectKeyValue({
      projectKey,
    });

    const apiRootProvider: Provider = {
      provide: IMPORT_API_ROOT,
      useValue: importApiRoot,
    };

    return {
      module: ImportApiClientModule,
      providers: [apiRootProvider],
      exports: [apiRootProvider],
      global: true,
    };
  }
}
