/* eslint-disable import/no-extraneous-dependencies */
const Chance = require('chance');
/* eslint-enable import/no-extraneous-dependencies */

const chance = new Chance();

function generateMocks(totalProducts = 100) {
  return {
    products: Array.from(Array(totalProducts)).map(() => {
      const imageId = chance.integer({
        max: 20,
        min: 1,
      });
      const product = {
        productId: chance.guid(),
        productName: chance.sentence({
          words: chance.integer({
            max: 11,
            min: 6,
          }),
        }),
        shortDescription: chance.sentence(),
        price: chance.dollar(),
        productImage: `https://placekitten.com/400/400?image=${imageId}`,
        reviewRating: chance.floating({
          fixed: 2,
          max: 5,
          min: 0,
        }),
        reviewCount: chance.integer({
          max: 99,
          min: 1,
        }),
        inStock: chance.bool({
          likelihood: 75,
        }),
      };

      // Some long descriptions are missing
      if (chance.bool({ likelihood: 90 })) {
        product.longDescription = chance.paragraph();
      }

      return product;
    }),
    totalProducts,
    pageNumber: 0,
    pageSize: 10,
    status: 200,
  };
}

if (require.main === module) {
  /* eslint-disable no-console */
  console.log(JSON.stringify(generateMocks(), null, 2));
  /* eslint-enable no-console */
}

module.exports = generateMocks;

