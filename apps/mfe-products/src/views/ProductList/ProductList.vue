<script setup lang="ts">
import type { ProductCategory } from '@portfolio/shared-types';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useProductList } from '../../composables/useProducts/useProducts';

import type { ProductListFilters, ProductListPagination } from './ProductList.types';

const router = useRouter();
const { products, total, loading, error, fetchProducts } = useProductList();

const filters = ref<ProductListFilters>({ search: '', category: '' });
const pagination = ref<ProductListPagination>({ page: 1, pageSize: 10 });

const categories: readonly ProductCategory[] = [
  'electronics',
  'clothing',
  'food',
  'books',
  'other',
];

const totalPages = ref(0);

async function load(): Promise<void> {
  await fetchProducts({
    ...(filters.value.search !== '' && { search: filters.value.search }),
    ...(filters.value.category !== '' && { category: filters.value.category }),
    page: pagination.value.page,
    pageSize: pagination.value.pageSize,
  });
  totalPages.value = Math.ceil(total.value / pagination.value.pageSize);
}

onMounted(() => {
  void load();
});

watch(
  filters,
  () => {
    pagination.value = { ...pagination.value, page: 1 };
    void load();
  },
  { deep: true },
);

watch(
  () => pagination.value.page,
  () => {
    void load();
  },
);

function navigateToProduct(id: string): void {
  void router.push(`/products/${id}`);
}

function navigateToNew(): void {
  void router.push('/products/new');
}

function setPage(page: number): void {
  pagination.value = { ...pagination.value, page };
}
</script>

<template>
  <div class="products-p-6">
    <!-- Header -->
    <div class="products-mb-6 products-flex products-items-center products-justify-between">
      <h1 class="products-text-2xl products-font-bold products-text-gray-900">Products</h1>
      <button
        type="button"
        data-testid="add-product-btn"
        class="products-rounded-md products-bg-blue-600 products-px-4 products-py-2 products-text-sm products-font-medium products-text-white hover:products-bg-blue-700"
        @click="navigateToNew"
      >
        Add Product
      </button>
    </div>

    <!-- Filters -->
    <div class="products-mb-4 products-flex products-gap-4">
      <input
        v-model="filters.search"
        type="search"
        placeholder="Search by name…"
        data-testid="search-input"
        class="products-w-64 products-rounded-md products-border products-border-gray-300 products-px-3 products-py-2 products-text-sm focus:products-outline-none focus:products-ring-2 focus:products-ring-blue-500"
      />
      <select
        v-model="filters.category"
        data-testid="category-filter"
        class="products-rounded-md products-border products-border-gray-300 products-px-3 products-py-2 products-text-sm focus:products-outline-none focus:products-ring-2 focus:products-ring-blue-500"
      >
        <option value="">All categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      data-testid="loading"
      class="products-flex products-h-48 products-items-center products-justify-center"
    >
      <span class="products-text-sm products-text-gray-500">Loading products…</span>
    </div>

    <!-- Error -->
    <div
      v-else-if="error !== null"
      data-testid="error"
      class="products-flex products-h-48 products-flex-col products-items-center products-justify-center products-gap-3"
    >
      <p class="products-text-sm products-text-red-600">{{ error }}</p>
      <button
        type="button"
        class="products-rounded products-bg-blue-600 products-px-4 products-py-2 products-text-sm products-text-white"
        @click="load"
      >
        Retry
      </button>
    </div>

    <!-- Table -->
    <template v-else>
      <div
        class="products-overflow-x-auto products-rounded-lg products-border products-border-gray-200"
      >
        <table class="products-w-full products-text-sm" data-testid="products-table">
          <thead class="products-bg-gray-50">
            <tr>
              <th
                scope="col"
                class="products-px-4 products-py-3 products-text-left products-font-medium products-text-gray-500"
              >
                Name
              </th>
              <th
                scope="col"
                class="products-px-4 products-py-3 products-text-left products-font-medium products-text-gray-500"
              >
                Category
              </th>
              <th
                scope="col"
                class="products-px-4 products-py-3 products-text-right products-font-medium products-text-gray-500"
              >
                Price
              </th>
              <th
                scope="col"
                class="products-px-4 products-py-3 products-text-right products-font-medium products-text-gray-500"
              >
                Stock
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in products"
              :key="product.id"
              data-testid="product-row"
              class="products-cursor-pointer products-border-t products-border-gray-100 hover:products-bg-gray-50"
              @click="navigateToProduct(product.id)"
            >
              <td class="products-px-4 products-py-3 products-font-medium products-text-gray-900">
                {{ product.name }}
              </td>
              <td class="products-px-4 products-py-3 products-capitalize products-text-gray-600">
                {{ product.category }}
              </td>
              <td class="products-px-4 products-py-3 products-text-right products-text-gray-900">
                ${{ product.price.toFixed(2) }}
              </td>
              <td class="products-px-4 products-py-3 products-text-right products-text-gray-600">
                {{ product.stock }}
              </td>
            </tr>
            <tr v-if="products.length === 0">
              <td
                colspan="4"
                class="products-px-4 products-py-8 products-text-center products-text-gray-500"
              >
                No products found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="products-mt-4 products-flex products-items-center products-justify-between"
        data-testid="pagination"
      >
        <span class="products-text-sm products-text-gray-600">
          Page {{ pagination.page }} of {{ totalPages }} ({{ total }} total)
        </span>
        <div class="products-flex products-gap-2">
          <button
            type="button"
            :disabled="pagination.page <= 1"
            data-testid="prev-page"
            class="products-rounded products-border products-border-gray-300 products-px-3 products-py-1 products-text-sm disabled:products-opacity-50"
            @click="setPage(pagination.page - 1)"
          >
            Previous
          </button>
          <button
            type="button"
            :disabled="pagination.page >= totalPages"
            data-testid="next-page"
            class="products-rounded products-border products-border-gray-300 products-px-3 products-py-1 products-text-sm disabled:products-opacity-50"
            @click="setPage(pagination.page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
