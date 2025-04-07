import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
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
    throw new NotImplementedException('This feature is not yet supported.');
  }

  getShippingMethodByKey(key: string) {
    throw new NotImplementedException('This feature is not yet supported.');
  }

  checkShippingMethodExists(key: string) {
    throw new NotImplementedException('This feature is not yet supported.');
  }

  getShippingMethodsByLocation(countryCode: string) {
    throw new NotImplementedException('This feature is not yet supported.');
  }
}

function handleError(error: unknown) {
  if (isSDKError(error)) {
    if (error.statusCode === 404) {
      throw new ObjectNotFoundException(
        `Shipping method with given key not found`,
      );
    } else if (error.statusCode === 400) {
      throw new RequestParamMalformedException(`Parameter is malformed`);
    } else {
      throw error;
    }
  } else {
    throw error;
  }
}
