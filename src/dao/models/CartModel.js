// models/CartModel.js
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // ref corregido
      quantity: { type: Number, default: 1 }
    }
  ]
});

const CartModel = mongoose.model('Cart', cartSchema); // nombre del modelo corregido

export default CartModel;

