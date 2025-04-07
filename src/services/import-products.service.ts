import {
  ByProjectKeyRequestBuilder,
  ProductDraftImport,
} from '@commercetools/importapi-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { API_ROOT } from 'src/commercetools/api-client.module';
import { IMPORT_API_ROOT } from 'src/commercetools/import-api-client.module';
import csvtojson from 'csvtojson';

const participantNamePrefix = 'tt';

@Injectable()
export class ImportProductsService {
  constructor(
    @Inject(IMPORT_API_ROOT)
    private readonly importApiRoot: ByProjectKeyRequestBuilder,
  ) {}

  async importProductData(csvString: string) {
    const importContainerKey = 'sf-import-container';
    const productDrafts = await this.convertCsvToProductDrafts(csvString);

    return this.importApiRoot
      .productDrafts()
      .importContainers()
      .withImportContainerKeyValue({ importContainerKey })
      .post({
        body: {
          type: 'product-draft',
          resources: productDrafts,
        },
      })
      .execute()
      .then((response) => response.body);
  }

  getImportSummary(importContainerKey: string) {
    return this.importApiRoot
      .importContainers()
      .withImportContainerKeyValue({ importContainerKey })
      .importSummaries()
      .get()
      .execute()
      .then((response) => response.body);
  }

  async convertCsvToProductDrafts(csvString: string) {
    const products = await csvtojson().fromString(csvString);
    return products.map((product) =>
      mapProductToDraft(product, participantNamePrefix),
    );
  }
}

function mapProductToDraft(
  product: any,
  participantNamePrefix: string,
): ProductDraftImport {
  return {
    key: participantNamePrefix + '-' + product.productName,
    name: {
      'en-US': product.productName,
      'en-GB': product.productName,
      'de-DE': product.productName,
    },
    productType: {
      typeId: 'product-type',
      key: product.productType,
    },
    slug: {
      'en-US': participantNamePrefix + '-' + product.productName,
      'en-GB': participantNamePrefix + '-' + product.productName,
      'de-DE': participantNamePrefix + '-' + product.productName,
    },
    description: {
      'en-US': product.productDescription,
      'en-GB': product.productDescription,
      'de-DE': product.productDescription,
    },
    masterVariant: {
      sku: participantNamePrefix + '-' + product.inventoryId,
      key: participantNamePrefix + '-' + product.productName,
      prices: [
        {
          key: 'price1',
          value: {
            type: 'centPrecision',
            currencyCode: product.currencyCode,
            centAmount: parseInt(product.basePrice, 10),
          },
        },
      ],
      images: [
        {
          url: product.imageUrl,
          dimensions: { w: 177, h: 237 },
        },
      ],
    },
  };
}
