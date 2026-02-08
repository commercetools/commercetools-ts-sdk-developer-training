import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ByProjectKeyRequestBuilder,
  GraphQLResponse,
} from '@commercetools/platform-sdk';
import { ProductsSearchDto } from 'src/dtos/products.dto';
import { isSDKError } from '../types/error.type';
import { ObjectNotFoundException } from '../errors/object-not-found.error';
import { API_ROOT } from '../commercetools/api-client.module';
import { StoresService } from './stores.service';


@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @Inject(API_ROOT) private readonly apiRoot: ByProjectKeyRequestBuilder,
    private readonly storesService: StoresService,
  ) {}

  async searchProducts(
    searchDetails: ProductsSearchDto,
  ): Promise<GraphQLResponse> {
    this.logger.log(`Searching products with parameters: ${JSON.stringify(searchDetails)}`);

    const {
      keyword,
      storeKey,
      facets: useFacets,
      currency,
      country,
      locale,
    } = searchDetails;

    let searchQuery: SearchQueryInput | undefined;

    if (storeKey || keyword) {
      let storeQueryExpression: SearchQueryInput | undefined;
      let fullTextQueryExpression: SearchQueryInput | undefined;

      if (storeKey) {
        const storeId = await this.getStoreId(storeKey!);
        storeQueryExpression = {
          exact: { field: 'stores', value: storeId },
        };
      }

      if (keyword) {
        fullTextQueryExpression = {
          fullText: {
            field: 'name',
            language: locale ?? 'en-US',
            value: keyword,
            mustMatch: 'any',
          },
        };
      }

      if (storeQueryExpression && fullTextQueryExpression) {
        searchQuery = { and: [storeQueryExpression, fullTextQueryExpression] };
      } else {
        searchQuery = storeQueryExpression || fullTextQueryExpression;
      }
    }

    const facets = useFacets ? createFacets(locale) : undefined;

    const sort: SearchSortingInput[] = [
      {
        field: 'variants.prices.centAmount',
        order: 'asc',
        mode: 'min',
        filter: {
          and: [
            {
              exact: {
                field: 'variants.prices.country',
                value: country,
              },
            },
            {
              exact: {
                field: 'variants.prices.currencyCode',
                value: currency,
              },
            },
          ],
        },
      },
    ];

    const query = `
      query ProductsSearch(
        $query: SearchQueryInput
        $facets: [ProductSearchFacetExpressionInput!]
        $sort: [SearchSortingInput!]
        $markMatchingVariants: Boolean
        $locale: Locale!
        $currency: Currency!
        $country: Country!
      ) {
        productsSearch(
          query: $query
          facets: $facets
          sort: $sort
          markMatchingVariants: $markMatchingVariants
        ) {
          total
          offset
          limit
          results {
            id
            product {
              id
              key
              masterData {
                current {
                  name(locale: $locale)
                  slug(locale: $locale)
                  masterVariant {
                    sku
                    images {
                      url
                    }
                    price(currency: $currency, country: $country) {
                      value {
                        centAmount
                        currencyCode
                      }
                      discounted {
                        value {
                          centAmount
                          currencyCode
                        }
                      }
                    }
                    attributesRaw {
                      name
                      value
                    }
                  }
                }
              }
            }
          }
          facets {
            ... on ProductSearchFacetResultBucket {
              name
              buckets {
                count
                key
              }
            }
          }
        }
      }
    `;

    const variables = {
      query: searchQuery,
      facets,
      sort,
      markMatchingVariants: true,
      locale,
      currency,
      country,
    };

    return this.apiRoot
      .graphql()
      .post({ body: { query, variables } })
      .execute()
      .then((response) => response.body)
      .catch((error) => {
        throw error;
      });
  }

  private async getStoreId(storeKey: string): Promise<string> {
    try {
      const store = await this.storesService.getStoreByKey(storeKey);

      return store.id;
    } catch (error) {
      if (isSDKError(error) && error.statusCode === 404) {
        throw new ObjectNotFoundException(
          `Store with key '${storeKey}' not found`,
        );
      }
      throw error;
    }
  }
}

type SearchQueryInput = Record<string, unknown>;

type SearchSortingInput = {
  field: string;
  order: 'asc' | 'desc';
  mode?: 'min' | 'max';
  filter?: SearchFilterExpressionInput;
  language?: string;
};

type SearchFilterExpressionInput = Record<string, unknown>;

type ProductSearchFacetExpressionInput = Record<string, unknown>;

function createFacets(locale: string): ProductSearchFacetExpressionInput[] {
  return [
    {
      distinct: {
        name: 'Color',
        field: 'variants.attributes.search-color.label',
        fieldType: 'lenum',
        language: locale,
        level: 'variants',
        scope: 'query',
      },
    },
    {
      distinct: {
        name: 'Finish',
        field: 'variants.attributes.search-finish.label',
        fieldType: 'lenum',
        language: locale,
        level: 'variants',
        scope: 'query',
      },
    }
  ];
}
