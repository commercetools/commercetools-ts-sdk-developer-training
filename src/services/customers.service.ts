import {
  ByProjectKeyRequestBuilder,
  CustomerDraft,
  CustomerSignin,
} from '@commercetools/platform-sdk';
import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { CustomerRegisterDto } from 'src/dtos/customers.dto';
import { API_ROOT } from 'src/commercetools/api-client.module';
import { CustomerAuthenticateDto } from 'src/dtos/customers.dto';

@Injectable()
export class CustomersService {
  constructor(
    @Inject(API_ROOT) private readonly apiRoot: ByProjectKeyRequestBuilder,
  ) {}

  async createCustomer(customerRegistrationDetails: CustomerRegisterDto) {
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

    let body: CustomerDraft = {
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

    throw new NotImplementedException('This feature is not yet supported.');

    // return this.apiRoot
    //   .inStoreKeyWithStoreKeyValue({ storeKey })
    //   .customers()
    //   .post({
    //     body,
    //   })
    //   .execute()
    //   .then((response) => response.body);
  }

  authenticateCustomer(customerAuthenticationDetails: CustomerAuthenticateDto) {
    const { email, password, anonymousCartId, storeKey } =
      customerAuthenticationDetails;

    const body: CustomerSignin = {
      email,
      password,
      ...(anonymousCartId && {
        anonymousCart: {
          id: anonymousCartId,
          typeId: 'cart',
        },
        // anonymousCartSignInMode: 'MergeWithExistingCustomerCart', //UseAsNewActiveCustomerCart
      }),
    };

    throw new NotImplementedException('This feature is not yet supported.');
    //   return this.apiRoot
    //     .inStoreKeyWithStoreKeyValue({ storeKey })
    //     .login()
    //     .post({
    //       body,
    //     })
    //     .execute()
    //     .then((response) => response.body);
  }
}
