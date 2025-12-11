
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
    const variants = [
      ...product.masterData.current.variants,
      product.masterData.current.masterVariant,
    ];
    variants.forEach((variant, idx) => {
      let issues: string[] = [];
      const variantLabel = idx === variants.length - 1 ? 'masterVariant' : `variant ${idx + 1}`;
      if (!variant.sku) {
        issues.push('Missing SKU (id)');
      }
      // Check required custom attributes
      for (const attrName of requiredAttributes) {
        const attr = variant.attributes?.find((a: Attribute) => a.name === attrName);
        if (!attr || attr.value === null || attr.value === '') {
          issues.push(`Missing ${attrName}`);
        }
      }
      // Only check for mpn if gtin is missing
      const gtinAttr = variant.attributes?.find((a: Attribute) => a.name === 'gtin');
      const hasGtin = gtinAttr && gtinAttr.value !== null && gtinAttr.value !== '';
      if (!hasGtin) {
        const mpnAttr = variant.attributes?.find((a: Attribute) => a.name === 'mpn');
        const hasMpn = mpnAttr && mpnAttr.value !== null && mpnAttr.value !== '';
        if (!hasMpn) {
          issues.push('Missing mpn (required if gtin is missing)');
        }
      }
      // Example: ensure at least one price is present
      if (!variant.prices || variant.prices.length === 0) {
        issues.push('No price');
      }
      // Example: ensure at least one image
      if (!variant.images || variant.images.length === 0) {
        issues.push('No image');
      }
      // Output any issues
      if (issues.length > 0) {
        console.log(`[${prodName}] ${variantLabel}:`, issues);
      }
    });
  }
}

checkProductFeedReadiness().then(() => {
  console.log('Product feed readiness check completed.');
}).catch((error) => {
  console.log(error);
});
