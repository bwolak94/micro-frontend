import { zodToJsonSchema } from 'zod-to-json-schema';

import {
  createProductBodySchema,
  productParamsSchema,
  productsQuerySchema,
  updateProductBodySchema,
} from '../../schemas/products.schema';

import type {
  CreateProductRoute,
  DeleteProductRoute,
  GetProductRoute,
  GetProductsRoute,
  ProductsRoutesOpts,
  UpdateProductRoute,
} from './products.routes.types';
import type { FastifyInstance } from 'fastify';

export async function productsRoutes(
  fastify: FastifyInstance,
  opts: ProductsRoutesOpts,
): Promise<void> {
  const { productsService } = opts;

  fastify.get<GetProductsRoute>(
    '/api/products',
    {
      preHandler: [fastify.authenticate],
      schema: { querystring: zodToJsonSchema(productsQuerySchema) },
    },
    async (req, reply) => {
      const query = productsQuerySchema.parse(req.query);
      const result = await productsService.getProducts(query);
      return reply.send(result);
    },
  );

  fastify.get<GetProductRoute>(
    '/api/products/:id',
    {
      preHandler: [fastify.authenticate],
      schema: { params: zodToJsonSchema(productParamsSchema) },
    },
    async (req, reply) => {
      const product = await productsService.getProduct(req.params.id);
      if (product === null) {
        return reply
          .status(404)
          .send({ statusCode: 404, message: 'Product not found', error: 'Not Found' });
      }
      return reply.send({ data: product });
    },
  );

  fastify.post<CreateProductRoute>(
    '/api/products',
    {
      preHandler: [fastify.authorize('admin')],
      schema: { body: zodToJsonSchema(createProductBodySchema) },
    },
    async (req, reply) => {
      const product = await productsService.createProduct(req.body);
      return reply.status(201).send({ data: product });
    },
  );

  fastify.put<UpdateProductRoute>(
    '/api/products/:id',
    {
      preHandler: [fastify.authorize('admin')],
      schema: {
        params: zodToJsonSchema(productParamsSchema),
        body: zodToJsonSchema(updateProductBodySchema),
      },
    },
    async (req, reply) => {
      const product = await productsService.updateProduct(req.params.id, req.body);
      if (product === null) {
        return reply
          .status(404)
          .send({ statusCode: 404, message: 'Product not found', error: 'Not Found' });
      }
      return reply.send({ data: product });
    },
  );

  fastify.delete<DeleteProductRoute>(
    '/api/products/:id',
    {
      preHandler: [fastify.authorize('admin')],
      schema: { params: zodToJsonSchema(productParamsSchema) },
    },
    async (req, reply) => {
      const deleted = await productsService.deleteProduct(req.params.id);
      if (!deleted) {
        return reply
          .status(404)
          .send({ statusCode: 404, message: 'Product not found', error: 'Not Found' });
      }
      return reply.send({ message: 'Product deleted successfully' });
    },
  );
}
