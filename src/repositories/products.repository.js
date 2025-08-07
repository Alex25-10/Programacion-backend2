import ProductDAO from '../dao/models/ProductModel.js';

const productDAO = new ProductDAO();

export default class ProductRepository {
  getProducts() {
    return productDAO.getAll();
  }

  getProductById(id) {
    return productDAO.getById(id);
  }

  createProduct(data) {
    return productDAO.create(data);
  }

  updateProduct(id, data) {
    return productDAO.update(id, data);
  }

  deleteProduct(id) {
    return productDAO.delete(id);
  }
}
