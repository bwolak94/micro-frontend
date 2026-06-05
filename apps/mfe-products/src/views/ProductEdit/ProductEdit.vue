<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import type { ProductCategory } from '@portfolio/shared-types';
import { useForm } from 'vee-validate';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';

import { useEventBus } from '../../composables/useEventBus/useEventBus';
import { useProductEdit } from '../../composables/useProducts/useProducts';

import { PRODUCT_CATEGORIES } from './ProductEdit.types';

const router = useRouter();
const route = useRoute();
const bus = useEventBus();
const { product, loading, saving, deleting, fetchProduct, saveProduct, deleteProduct } =
  useProductEdit();

const isNew = computed(() => route.path.endsWith('/new'));
const productId = computed<string | null>(() => {
  const id = route.params.id;
  return typeof id === 'string' ? id : null;
});

const showDeleteConfirm = ref(false);
const successMessage = ref<string | null>(null);

const productSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    description: z.string().min(1, 'Description is required').max(500, 'Description is too long'),
    category: z.enum(PRODUCT_CATEGORIES as [ProductCategory, ...ProductCategory[]], {
      required_error: 'Category is required',
    }),
    price: z.coerce.number().positive('Price must be positive'),
    stock: z.coerce
      .number()
      .int('Stock must be a whole number')
      .nonnegative('Stock must be 0 or more'),
  }),
);

const { handleSubmit, defineField, errors, setValues, resetForm } = useForm({
  validationSchema: productSchema,
});

const [name, nameAttrs] = defineField('name');
const [description, descriptionAttrs] = defineField('description');
const [category, categoryAttrs] = defineField('category');
const [price, priceAttrs] = defineField('price');
const [stock, stockAttrs] = defineField('stock');

onMounted(async () => {
  if (!isNew.value && productId.value !== null) {
    await fetchProduct(productId.value);
  }
});

watch(product, (p) => {
  if (p !== null) {
    setValues({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      stock: p.stock,
    });
  }
});

const onSubmit = handleSubmit(async (values) => {
  const saved = await saveProduct(productId.value, {
    name: values.name,
    description: values.description,
    category: values.category,
    price: values.price,
    stock: values.stock,
  });

  if (isNew.value) {
    bus.emit('product:created', { id: saved.id });
    void router.push(`/products/${saved.id}`);
  } else {
    bus.emit('product:updated', { id: saved.id });
    successMessage.value = 'Product saved successfully';
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  }
});

function cancel(): void {
  resetForm();
  void router.push('/products');
}

async function confirmDelete(): Promise<void> {
  if (productId.value === null) return;
  await deleteProduct(productId.value);
  bus.emit('product:deleted', { id: productId.value });
  void router.push('/products');
}
</script>

<template>
  <div class="products-p-6 products-mx-auto products-max-w-2xl">
    <!-- Header -->
    <div class="products-mb-6 products-flex products-items-center products-justify-between">
      <h1 class="products-text-2xl products-font-bold products-text-gray-900">
        {{ isNew ? 'Add Product' : 'Edit Product' }}
      </h1>
      <button
        v-if="!isNew"
        type="button"
        data-testid="delete-btn"
        class="products-rounded-md products-border products-border-red-300 products-px-4 products-py-2 products-text-sm products-font-medium products-text-red-600 hover:products-bg-red-50"
        @click="showDeleteConfirm = true"
      >
        Delete
      </button>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      data-testid="form-loading"
      class="products-flex products-h-48 products-items-center products-justify-center"
    >
      <span class="products-text-sm products-text-gray-500">Loading…</span>
    </div>

    <!-- Form -->
    <form v-else data-testid="product-form" class="products-space-y-5" @submit.prevent="onSubmit">
      <!-- Success message -->
      <div
        v-if="successMessage !== null"
        data-testid="success-message"
        class="products-rounded-md products-bg-green-50 products-p-3 products-text-sm products-text-green-700"
      >
        {{ successMessage }}
      </div>

      <!-- Name -->
      <div>
        <label
          for="product-name"
          class="products-mb-1 products-block products-text-sm products-font-medium products-text-gray-700"
        >
          Name
        </label>
        <input
          id="product-name"
          v-model="name"
          v-bind="nameAttrs"
          type="text"
          data-testid="name-input"
          class="products-w-full products-rounded-md products-border products-border-gray-300 products-px-3 products-py-2 products-text-sm focus:products-outline-none focus:products-ring-2 focus:products-ring-blue-500"
        />
        <p
          v-if="errors.name"
          data-testid="name-error"
          class="products-mt-1 products-text-xs products-text-red-600"
        >
          {{ errors.name }}
        </p>
      </div>

      <!-- Description -->
      <div>
        <label
          for="product-description"
          class="products-mb-1 products-block products-text-sm products-font-medium products-text-gray-700"
        >
          Description
        </label>
        <textarea
          id="product-description"
          v-model="description"
          v-bind="descriptionAttrs"
          rows="3"
          data-testid="description-input"
          class="products-w-full products-rounded-md products-border products-border-gray-300 products-px-3 products-py-2 products-text-sm focus:products-outline-none focus:products-ring-2 focus:products-ring-blue-500"
        />
        <p
          v-if="errors.description"
          data-testid="description-error"
          class="products-mt-1 products-text-xs products-text-red-600"
        >
          {{ errors.description }}
        </p>
      </div>

      <!-- Category -->
      <div>
        <label
          for="product-category"
          class="products-mb-1 products-block products-text-sm products-font-medium products-text-gray-700"
        >
          Category
        </label>
        <select
          id="product-category"
          v-model="category"
          v-bind="categoryAttrs"
          data-testid="category-select"
          class="products-w-full products-rounded-md products-border products-border-gray-300 products-px-3 products-py-2 products-text-sm focus:products-outline-none focus:products-ring-2 focus:products-ring-blue-500"
        >
          <option value="">Select a category</option>
          <option v-for="cat in PRODUCT_CATEGORIES" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        <p
          v-if="errors.category"
          data-testid="category-error"
          class="products-mt-1 products-text-xs products-text-red-600"
        >
          {{ errors.category }}
        </p>
      </div>

      <!-- Price -->
      <div>
        <label
          for="product-price"
          class="products-mb-1 products-block products-text-sm products-font-medium products-text-gray-700"
        >
          Price ($)
        </label>
        <input
          id="product-price"
          v-model.number="price"
          v-bind="priceAttrs"
          type="number"
          step="0.01"
          min="0"
          data-testid="price-input"
          class="products-w-full products-rounded-md products-border products-border-gray-300 products-px-3 products-py-2 products-text-sm focus:products-outline-none focus:products-ring-2 focus:products-ring-blue-500"
        />
        <p
          v-if="errors.price"
          data-testid="price-error"
          class="products-mt-1 products-text-xs products-text-red-600"
        >
          {{ errors.price }}
        </p>
      </div>

      <!-- Stock -->
      <div>
        <label
          for="product-stock"
          class="products-mb-1 products-block products-text-sm products-font-medium products-text-gray-700"
        >
          Stock
        </label>
        <input
          id="product-stock"
          v-model.number="stock"
          v-bind="stockAttrs"
          type="number"
          min="0"
          data-testid="stock-input"
          class="products-w-full products-rounded-md products-border products-border-gray-300 products-px-3 products-py-2 products-text-sm focus:products-outline-none focus:products-ring-2 focus:products-ring-blue-500"
        />
        <p
          v-if="errors.stock"
          data-testid="stock-error"
          class="products-mt-1 products-text-xs products-text-red-600"
        >
          {{ errors.stock }}
        </p>
      </div>

      <!-- Actions -->
      <div class="products-flex products-justify-end products-gap-3 products-pt-2">
        <button
          type="button"
          data-testid="cancel-btn"
          class="products-rounded-md products-border products-border-gray-300 products-px-4 products-py-2 products-text-sm products-font-medium products-text-gray-700 hover:products-bg-gray-50"
          @click="cancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          data-testid="save-btn"
          :disabled="saving"
          class="products-rounded-md products-bg-blue-600 products-px-4 products-py-2 products-text-sm products-font-medium products-text-white hover:products-bg-blue-700 disabled:products-opacity-50"
        >
          {{ saving ? 'Saving…' : 'Save' }}
        </button>
      </div>
    </form>

    <!-- Delete confirmation dialog -->
    <div
      v-if="showDeleteConfirm"
      data-testid="delete-confirm-dialog"
      class="products-fixed products-inset-0 products-flex products-items-center products-justify-center products-bg-black/50"
    >
      <div
        class="products-w-full products-max-w-sm products-rounded-lg products-bg-white products-p-6 products-shadow-xl"
      >
        <h2 class="products-mb-3 products-text-lg products-font-semibold products-text-gray-900">
          Delete product?
        </h2>
        <p class="products-mb-5 products-text-sm products-text-gray-600">
          This action cannot be undone.
        </p>
        <div class="products-flex products-justify-end products-gap-3">
          <button
            type="button"
            data-testid="cancel-delete-btn"
            class="products-rounded-md products-border products-border-gray-300 products-px-4 products-py-2 products-text-sm products-text-gray-700"
            @click="showDeleteConfirm = false"
          >
            Cancel
          </button>
          <button
            type="button"
            data-testid="confirm-delete-btn"
            :disabled="deleting"
            class="products-rounded-md products-bg-red-600 products-px-4 products-py-2 products-text-sm products-font-medium products-text-white hover:products-bg-red-700 disabled:products-opacity-50"
            @click="confirmDelete"
          >
            {{ deleting ? 'Deleting…' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
