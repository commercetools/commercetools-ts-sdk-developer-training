import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { API_ROOT } from 'src/commercetools/api-client.module';
import { OrdersGetDto } from 'src/dtos/graphql.dto';

@Injectable()
export class GraphqlService {
  constructor(
    @Inject(API_ROOT) private readonly apiRoot: ByProjectKeyRequestBuilder,
  ) {}

  getOrdersByEmail(orderDetails: OrdersGetDto) {
    const { storeKey, email } = orderDetails;

    // TODO: Use GraphQL Explorer to build a query that returns orders for the customer email in the request.

    const query = `
    query MyQuery($storeKey: KeyReferenceInput!, $condition: String!) {
      inStore(key: $storeKey) {
        orders(where: $condition) {
          results {
            customerEmail
            totalPrice {
              centAmount
              currencyCode
            }
          }
        }
      }
    }
    `;

    let variables = {
      storeKey,
      condition: `customerEmail="${email}"`,
    };

    return this.apiRoot
      .graphql()
      .post({
        body: { query, variables },
      })
      .execute()
      .then((response) => response.body);
  }
}
