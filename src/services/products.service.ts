import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import {
  _SearchQuery,
  _SearchQueryExpression,
  ByProjectKeyRequestBuilder,
  ProductSearchRequest,
} from '@commercetools/platform-sdk';
import { ProductsSearchDto } from 'src/dtos/products.dto';
import { SearchQueryBuilder } from '../types/search.type';
import { isSDKError } from '../types/error.type';
import { ObjectNotFoundException } from '../errors/object-not-found.error';
import { API_ROOT } from '../commercetools/api-client.module';
import { StoresService } from './stores.service';

// interface _SearchQueryExpression {
//   exact?: { field: string; value: string };
//   fullText?: {
//     field: string;
//     language: string;
//     value: string;
//     mustMatch: 'any' | 'all';
//     caseInsensitive: boolean;
//   };
// }

@Injectable()
export class ProductsService {
  constructor(
    @Inject(API_ROOT) private readonly apiRoot: ByProjectKeyRequestBuilder,
    private readonly storesService: StoresService,
  ) {}

  async searchProducts(searchDetails: ProductsSearchDto) {
    const { keyword, storeKey, facets, currency, country, locale } =
      searchDetails;

    throw new NotImplementedException('This feature is not yet supported.');

    let query: _SearchQuery | undefined;

    // if (storeKey || keyword) {
    //   let storeQueryExpression: _SearchQueryExpression | undefined;
    //   let fullTextQueryExpression: _SearchQueryExpression | undefined;

    //   if (storeKey) {
    //     const storeId = await this.getStoreId(storeKey!);
    //     storeQueryExpression = {
    //       exact: { field: 'stores', value: storeId },
    //     };
    //   }

    //   if (keyword) {
    //     fullTextQueryExpression = {
    //       fullText: {
    //         field: 'name',
    //         language: locale ?? 'en-US',
    //         value: keyword,
    //         mustMatch: 'any',
    //         caseInsensitive: true,
    //       },
    //     };
    //   }

    //   if (storeQueryExpression && fullTextQueryExpression) {
    //     query = { and: [storeQueryExpression, fullTextQueryExpression] };
    //   } else {
    //     query = storeQueryExpression || fullTextQueryExpression;
    //   }
    // }

    const productSearchRequest: ProductSearchRequest = {
      query,
      facets: facets ? createFacets(locale) : undefined,
      sort: [
        {
          field: 'variants.prices.centAmount',
          order: 'asc',
          mode: 'max',
        },
      ],
      markMatchingVariants: true,
      productProjectionParameters: {
        priceCurrency: currency ?? 'EUR',
        priceCountry: country ?? 'DE',
        storeProjection: storeKey || undefined,
        localeProjection: locale ? [locale!] : undefined,
      },
    };

    return this.apiRoot
      .products()
      .search()
      .post({ body: productSearchRequest })
      .execute()
      .then((response) => response.body);
  }

  private async getStoreId(storeKey: string) {
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

function createFacets(locale: string = 'en-US') {
  return [
    {
      distinct: {
        name: 'Color',
        field: 'variants.attributes.color',
        fieldType: 'ltext',
        language: locale,
        level: 'variants',
        scope: 'query',
      },
    },
    {
      distinct: {
        name: 'Finish',
        field: 'variants.attributes.finish',
        fieldType: 'ltext',
        language: locale,
        level: 'variants',
        scope: 'query',
      },
    },
  ];
}
