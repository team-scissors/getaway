const Chance = require('chance');
const chance = new Chance(1234);

const generateNoise = distance => {
  return distance / chance.random() / 25;
};

const distances = [
  100,
  200,
  300,
  400,
  500,
  1000,
  2000,
  3000,
  4000
];

distances.forEach( d => {
  console.log(`d: ${d} -> `, generateNoise(d));
});
