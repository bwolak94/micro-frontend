import { Spinner } from '@portfolio/ui';

import { useRecentProducts } from '../../hooks/useRecentProducts';

import type { ProductActivityProps } from './ProductActivity.types';
import type { FC } from 'react';

const ProductActivity: FC<ProductActivityProps> = () => {
  const { data: products, isLoading, isError, refetch } = useRecentProducts();

  return (
    <section
      aria-label="Product Activity"
      className="db-rounded-lg db-border db-border-gray-200 db-bg-white db-p-6 db-shadow-sm dark:db-border-gray-700 dark:db-bg-gray-800"
    >
      <h2 className="db-mb-4 db-text-lg db-font-semibold db-text-gray-900 dark:db-text-white">
        Product Activity
      </h2>

      {isLoading && (
        <div className="db-flex db-h-48 db-items-center db-justify-center">
          <Spinner label="Loading products..." />
        </div>
      )}

      {isError && (
        <div className="db-flex db-h-48 db-flex-col db-items-center db-justify-center db-gap-3">
          <p className="db-text-sm db-text-red-600 dark:db-text-red-400">
            Failed to load product activity
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="db-rounded db-bg-blue-600 db-px-4 db-py-2 db-text-sm db-text-white hover:db-bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && products !== undefined && (
        <ul
          aria-label="Product list"
          className="db-divide-y db-divide-gray-100 dark:db-divide-gray-800"
        >
          {products.map((product) => (
            <li key={product.id} className="db-py-3">
              <div className="db-flex db-items-start db-justify-between">
                <div>
                  <p className="db-font-medium db-text-gray-900 dark:db-text-white">
                    {product.name}
                  </p>
                  <p className="db-mt-0.5 db-text-xs db-text-gray-500 dark:db-text-gray-400">
                    {product.category} &middot; ${product.price.toFixed(2)} &middot; Stock:{' '}
                    {product.stock}
                  </p>
                </div>
                <time
                  dateTime={product.updatedAt}
                  className="db-text-xs db-text-gray-400 dark:db-text-gray-500"
                >
                  {new Date(product.updatedAt).toLocaleDateString()}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

ProductActivity.displayName = 'ProductActivity';

export default ProductActivity;
