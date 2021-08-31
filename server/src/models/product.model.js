const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: String,
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: String,
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    sizes: {
      type: [String],
      required: true,
    },
    stocks: {
      type: Number,
      required: true,
      default: 1,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5, // min and max values are defined in product.validation.js
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

productSchema.plugin(toJSON);
productSchema.plugin(paginate);

productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

productSchema.virtual('totalPrice').get(function () {
  const subtractionPrice = this.price * (this.discount / 100);
  return this.price - subtractionPrice;
});

productSchema.statics.isProductNameTaken = async function (slug) {
  const productSlug = await this.findOne({ slug });
  return !!productSlug;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
