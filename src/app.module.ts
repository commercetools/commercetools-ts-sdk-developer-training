import { Module } from '@nestjs/common';
import { join } from 'path';
import { ApiClientModule } from './commercetools/api-client.module';
import { ImportApiClientModule } from './commercetools/import-api-client.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { CartsController } from './controllers/carts.controller';
import { CustomersController } from './controllers/customers.controller';
import { ExtensionsController } from './controllers/extensions.controller';
import { GraphqlController } from './controllers/graphql.controller';
import { ImportProductsController } from './controllers/import-products.controller';
import { OrdersController } from './controllers/orders.controller';
import { ProductsController } from './controllers/products.controller';
import { ShippingMethodsController } from './controllers/shipping-methods.controller';
import { AppService } from './app.service';
import { CartsService } from './services/carts.service';
import { CustomersService } from './services/customers.service';
import { ExtensionsService } from './services/extensions.service';
import { GraphqlService } from './services/graphql.service';
import { ImportProductsService } from './services/import-products.service';
import { OrdersService } from './services/orders.service';
import { ProductsService } from './services/products.service';
import { ShippingMethodsService } from './services/shipping-methods.service';
import { StoresService } from './services/stores.service';
import { StoresController } from './controllers/stores.controller';
import { ProjectSettingsController } from './controllers/project-settings.controller';
import { ProjectSettingsService } from './services/project-settings.service';

@Module({
  imports: [
    ApiClientModule.forRoot({
      clientId: process.env.CTP_CLIENT_ID!,
      clientSecret: process.env.CTP_CLIENT_SECRET!,
      projectKey: process.env.CTP_PROJECT_KEY!,
      apiUrl: process.env.CTP_API_URL!,
      authUrl: process.env.CTP_AUTH_URL!,
    }),
    ImportApiClientModule.forRoot({
      clientId: process.env.CTP_CLIENT_ID!,
      clientSecret: process.env.CTP_CLIENT_SECRET!,
      projectKey: process.env.CTP_PROJECT_KEY!,
      apiUrl: process.env.CTP_IMPORT_API_URL!,
      authUrl: process.env.CTP_AUTH_URL!,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'), // Change to your static files directory
      exclude: ['/api*'], // Ensures API routes are not overridden
    }),
  ],
  controllers: [
    AppController,
    ShippingMethodsController,
    ProductsController,
    CartsController,
    CustomersController,
    OrdersController,
    ExtensionsController,
    ImportProductsController,
    GraphqlController,
    StoresController,
    ProjectSettingsController,
  ],
  providers: [
    AppService,
    StoresService,
    ShippingMethodsService,
    ProductsService,
    CartsService,
    CustomersService,
    OrdersService,
    ExtensionsService,
    ImportProductsService,
    GraphqlService,
    ProjectSettingsService,
  ],
})
export class AppModule {}
