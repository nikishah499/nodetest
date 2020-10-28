const mongoose = require('mongoose');
const Products = require('./src/models/products');
const config = require('./src/config');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = `${config.mongo.host}`;
mongoose.connect(mongoUri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  promiseLibrary: Promise,
  useFindAndModify: false,
});

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

const productData = [
  {
    name: 'laptop',
    description: '8GB ram',
    price: 65000
  },
  {
    name: 'laptop',
    description: '4GB ram',
    price: 55000
  },
  {
    name: 'keyboard',
    price: 5000
  },
  {
    name: 'mouse',
    price: 4000
  },
  {
    name: 'keyboard',
    description: 'USB',
    price: 6000
  },
  {
    name: 'mouse',
    description: 'USB',
    price: 5000
  },
  {
    name: 'headphone',
    price: 4000
  },
  {
    name: 'headphone',
    description: 'with microphone',
    price: 7000
  },
  {
    name: 'mouse pad',
    price: 500
  },
  {
    name: 'cover',
    description: 'Avenger theme',
    price: 1000
  },
  {
    name: 'USB cable',
    price: 300
  },
  {
    name: 'laptop stand',
    description: 'with cooling fan',
    price: 5000
  },
  {
    name: 'laptop stand',
    price: 3000
  },
  {
    name: 'Macbook',
    description: '16GB ram',
    price: 155000
  },
  {
    name: 'Android phone',
    description: '8GB ram',
    price: 25000
  },
  {
    name: 'Iphone',
    description: '4GB ram',
    price: 30000
  },
  {
    name: 'Monitor screen',
    price: 25000
  },
  {
    name: 'Smart Tv',
    price: 70000
  },
  {
    name: 'Speaker',
    price: 10000
  },
  {
    name: 'Charger',
    price: 4000
  }
];

Products.insertMany(productData).then(() => {
  console.log(`${productData.length} records are successfully inserted`);
  process.exit(0);
}).catch((error) => {
  console.log('Error occurred while inserting product data', error);
  process.exit(0);
});
