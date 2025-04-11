import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { isSDKError } from '../types/error.type';
import { ObjectNotFoundException } from '../errors/object-not-found.error';
import { RequestParamMalformedException } from '../errors/request-param-malformed.error';
import { API_ROOT } from 'src/commercetools/api-client.module';

@Injectable()
export class ShippingMethodsService {
  constructor(
    @Inject(API_ROOT) private readonly apiRoot: ByProjectKeyRequestBuilder,
  ) {}

  getAllShippingMethods() {
    return this.apiRoot
      .shippingMethods()
      .get()
      .execute()
      .then((response) => response.body);
  }

  getShippingMethodByKey(key: string) {
    return this.apiRoot
      .shippingMethods()
      .withKey({ key })
      .get()
      .execute()
      .then((response) => response.body)
      .catch((error) => {
        if (isSDKError(error) && error.statusCode === 404) {
          throw new ObjectNotFoundException(
            `Shipping method with key '${key}' not found`,
          );
        }
        throw error;
      });
  }

  checkShippingMethodExists(key: string) {
    return this.apiRoot
      .shippingMethods()
      .withKey({ key })
      .head()
      .execute()
      .then((response) => response.body)
      .catch((error) => {
        if (isSDKError(error) && error.statusCode === 404) {
          throw new ObjectNotFoundException(
            `Shipping method with key '${key}' does not exist`,
          );
        }
        throw error;
      });
  }

  getShippingMethodsByLocation(countryCode: string) {
    return this.apiRoot
      .shippingMethods()
      .matchingLocation()
      .get({
        queryArgs: {
          country: countryCode,
        },
      })
      .execute()
      .then((response) => response.body)
      .catch((error) => {
        if (isSDKError(error) && error.statusCode === 400) {
          throw new RequestParamMalformedException(
            `Country code '${countryCode}' is malformed`,
          );
        }
        throw error;
      });
  }

  getMatchingShippingMethods(storeKey: string, cartId: string) {
    return this.apiRoot
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .shippingMethods()
      .matchingCart()
      .get({
        queryArgs: {
          cartId,
        },
      })
      .execute()
      .then((response) => response.body);
  }
}
