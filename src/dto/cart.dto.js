export class CartDTO {
  constructor(cart) {
    this.id = cart._id || cart.id;
    this.products = cart.products?.map((item) => ({
      product: item.product?._id || item.product,
      quantity: item.quantity,
    })) || [];
  }
}
