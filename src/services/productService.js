import ProductRepository from '../repositories/products.repository.js';

const productRepository = new ProductRepository();

export default class ProductService {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    try {
      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);

      let filter = {};
      if (query) {
        filter = { category: query }; // Puedes personalizar esto si tu búsqueda no es por categoría
      }

      let sortOptions = {};
      if (sort === 'asc') {
        sortOptions = { price: 1 };
      } else if (sort === 'desc') {
        sortOptions = { price: -1 };
      }

      const allProducts = await productRepository.getProducts();

      // Filtro por query si es necesario
      const filteredProducts = query
        ? allProducts.filter((product) => product.category === query)
        : allProducts;

      // Ordenamiento
      const sortedProducts = sort
        ? filteredProducts.sort((a, b) =>
            sort === 'asc' ? a.price - b.price : b.price - a.price
          )
        : filteredProducts;

      // Paginación manual
      const startIndex = (parsedPage - 1) * parsedLimit;
      const endIndex = startIndex + parsedLimit;
      const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

      const totalPages = Math.ceil(sortedProducts.length / parsedLimit);

      return {
        status: 'success',
        payload: paginatedProducts,
        totalPages,
        prevPage: parsedPage > 1 ? parsedPage - 1 : null,
        nextPage: parsedPage < totalPages ? parsedPage + 1 : null,
        page: parsedPage,
        hasPrevPage: parsedPage > 1,
        hasNextPage: parsedPage < totalPages,
      };
    } catch (error) {
      console.error('Error in ProductService getProducts:', error);
      throw new Error('Error al obtener los productos');
    }
  }

  async getProductById(id) {
    const product = await productRepository.getProductById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  async createProduct(data) {
    return await productRepository.createProduct(data);
  }

  async updateProduct(id, data) {
    return await productRepository.updateProduct(id, data);
  }

  async deleteProduct(id) {
    return await productRepository.deleteProduct(id);
  }
}
