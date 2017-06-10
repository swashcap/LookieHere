/* eslint-disable import/no-extraneous-dependencies */
const Chance = require('chance');
/* eslint-enable import/no-extraneous-dependencies */

const chance = new Chance();

function generateMocks(totalProducts = 100) {
  return {
    products: Array.from(Array(totalProducts)).map(() => ({
      productId: chance.guid(),
      productName: chance.sentence({
        words: chance.integer({
          max: 11,
          min: 6,
        }),
      }),
      shortDescription: chance.sentence(),
      longDescription: chance.paragraph(),
      price: chance.dollar(),
      productImage: `https://placekitten.com/400/400?image=${chance.integer({
        max: 20,
        min: 1,
      })}`,
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
    })),
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

