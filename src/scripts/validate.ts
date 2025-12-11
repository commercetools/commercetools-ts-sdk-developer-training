
import { apiRoot } from "./client";
import { Attribute } from "@commercetools/platform-sdk";

async function checkProductFeedReadiness() {
  const requiredAttributes = ['chatgptEnableSearch', 'chatgptEnableCheckout', 'brand', 'material', 'weight']; // Add attributes as per your business requirement
  const productsResponse  = await apiRoot
    .products()
    .get({
      queryArgs: {
        where: `masterData(current(variants(attributes(name = "chatgptEnableSearch" and value = true))))`}})
    .execute();

  const products = productsResponse.body.results;
  for (const product of products) {
    const prodName = product.masterData.current.name['en-US'] || product.id;
    console.log(`Validating product: ${prodName}`);
    const masterVariant = product.masterData.current.masterVariant;
    // Check basic fields
    let issues: string[] = [];
    if (!masterVariant.sku) {
      issues.push('Missing SKU (id)');
    }
    // Check required custom attributes
    for (const attrName of requiredAttributes) {
      const attr = masterVariant.attributes?.find((a: Attribute) => a.name === attrName);
      if (!attr || attr.value === null || attr.value === '') {
        issues.push(`Missing ${attrName}`);
      }
    }
    // Example: ensure at least one price is present
    if (!masterVariant.prices || masterVariant.prices.length === 0) {
      issues.push('No price');
    }
    // Example: ensure at least one image
    if (!masterVariant.images || masterVariant.images.length === 0) {
      issues.push('No image');
    }
    // Output any issues
    if (issues.length > 0) {
      console.log(issues); // Handle issue reporting
    }
  }
}

checkProductFeedReadiness().then(() => {
  console.log('Product feed readiness check completed.');
}).catch((error) => {
  console.log(error);
});
