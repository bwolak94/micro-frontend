import type {
  CreateProductBody,
  ProductParams,
  ProductsQuery,
  UpdateProductBody,
} from '../../schemas/products.schema';
import type { ProductsService } from '../../services/products/products.service.types';

export interface ProductsRoutesOpts {
  productsService: ProductsService;
}

export interface GetProductsRoute {
  Querystring: ProductsQuery;
}

export interface GetProductRoute {
  Params: ProductParams;
}

export interface CreateProductRoute {
  Body: CreateProductBody;
}

export interface UpdateProductRoute {
  Params: ProductParams;
  Body: UpdateProductBody;
}

export interface DeleteProductRoute {
  Params: ProductParams;
}
