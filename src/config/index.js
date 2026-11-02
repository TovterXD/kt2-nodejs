const path = require('node:path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

module.exports = {
  port: process.env.PORT || 3000,
  uploads: path.resolve(__dirname, '../../uploads/products'),
};