import {
  ByProjectKeyRequestBuilder,
  CustomerDraft,
  CustomerSignin,
  CustomerSignInResult,
} from '@commercetools/platform-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { CustomerRegisterDto } from 'src/dtos/customers.dto';
import { API_ROOT } from 'src/commercetools/api-client.module';
import { CustomerAuthenticateDto } from 'src/dtos/customers.dto';

@Injectable()
export class CustomersService {
  constructor(
    @Inject(API_ROOT) private readonly apiRoot: ByProjectKeyRequestBuilder,
  ) {}

  async createCustomer(
    customerRegistrationDetails: CustomerRegisterDto,
  ): Promise<CustomerSignInResult> {
    const {
      email,
      password,
      key,
      country,
      anonymousCartId,
      storeKey,
      firstName,
      lastName,
      sessionId,
      defaultShippingAddress,
      defaultBillingAddress,
    } = customerRegistrationDetails;

    let customerDraft: CustomerDraft = {
      email,
      password,
      firstName,
      lastName,
      ...(key && { key }), // Adds key only if it exists
      ...(anonymousCartId && {
        anonymousCart: {
          id: anonymousCartId,
          typeId: 'cart',
        },
      }), // Adds anonymousCart anonymousCartId exists
      ...(sessionId && { anonymousId: sessionId }), // Adds anonymousId if sessionId exists
      ...(country && {
        addresses: [{ country }],
        ...(defaultShippingAddress && {
          defaultShippingAddress: 0,
        }),
        ...(defaultBillingAddress && {
          defaultBillingAddress: 0,
        }),
      }), // Adds address and default address logic if country is provided
    };

    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .customers()
      .post({
        body: customerDraft,
      })
      .execute()
      .then((response) => response.body);
  }

  authenticateCustomer(
    customerAuthenticationDetails: CustomerAuthenticateDto,
  ): Promise<CustomerSignInResult> {
    const { email, password, anonymousCartId, storeKey } =
      customerAuthenticationDetails;

    const customerSignIn: CustomerSignin = {
      email,
      password,
      ...(anonymousCartId && {
        anonymousCart: {
          id: anonymousCartId,
          typeId: 'cart',
        },
        // anonymousCartSignInMode: 'UseAsNewActiveCustomerCart',
      }),
    };

    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .login()
      .post({
        body: customerSignIn,
      })
      .execute()
      .then((response) => response.body);
  }
}
