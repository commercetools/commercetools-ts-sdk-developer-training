import { Inject, Injectable } from '@nestjs/common';
import {
  ByProjectKeyRequestBuilder,
  ProductSearchRequest,
} from '@commercetools/platform-sdk';
import { ProductsSearchDto } from 'src/dtos/products.dto';
import { SearchQueryBuilder } from '../types/search.type';
import { isSDKError } from '../types/error.type';
import { ObjectNotFoundException } from '../errors/object-not-found.error';
import { API_ROOT } from '../commercetools/api-client.module';
import { StoresService } from './stores.service';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(API_ROOT) private readonly apiRoot: ByProjectKeyRequestBuilder,
    private readonly storesService: StoresService,
  ) {}

  async searchProducts(searchDetails: ProductsSearchDto) {
    const { keyword, storeKey, facets, currency, country, locale } =
      searchDetails;

    const queryBuilder = new SearchQueryBuilder();

    if (storeKey) {
      const storeId = await this.getStoreId(storeKey);
      queryBuilder.addExactMatch('stores', storeId);
    }

    if (keyword) {
      queryBuilder.addFullTextSearch('name', keyword);
    }

    const query = queryBuilder.build();

    const productSearchRequest: ProductSearchRequest = {
      query,
      facets: facets ? createFacets() : undefined,
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
        localeProjection: locale ? [locale] : undefined,
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

function createFacets() {
  return [
    {
      distinct: {
        name: 'Color',
        field: 'variants.attributes.color',
        fieldType: 'ltext',
        language: 'en-US',
        level: 'variants',
        scope: 'query',
      },
    },
    {
      distinct: {
        name: 'Finish',
        field: 'variants.attributes.finish',
        fieldType: 'ltext',
        language: 'en-US',
        level: 'variants',
        scope: 'query',
      },
    },
  ];
}
