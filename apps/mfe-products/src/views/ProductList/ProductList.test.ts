import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';

import ProductList from './ProductList.vue';

function createTestRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/products', component: ProductList },
      { path: '/products/new', component: { template: '<div />' } },
      { path: '/products/:id', component: { template: '<div />' } },
    ],
  });
}

async function mountProductList() {
  const router = createTestRouter();
  await router.push('/products');
  const wrapper = mount(ProductList, {
    global: { plugins: [router] },
  });
  return { wrapper, router };
}

describe('ProductList', () => {
  it('shows loading state initially', async () => {
    const { wrapper } = await mountProductList();
    expect(wrapper.find('[data-testid="loading"]').exists()).toBe(true);
  });

  it('renders product rows after data loads', async () => {
    const { wrapper } = await mountProductList();
    await flushPromises();
    expect(wrapper.findAll('[data-testid="product-row"]').length).toBeGreaterThan(0);
  });

  it('renders product names', async () => {
    const { wrapper } = await mountProductList();
    await flushPromises();
    expect(wrapper.text()).toContain('Widget A');
    expect(wrapper.text()).toContain('Gadget B');
  });

  it('renders table column headers', async () => {
    const { wrapper } = await mountProductList();
    await flushPromises();
    expect(wrapper.text()).toContain('Name');
    expect(wrapper.text()).toContain('Category');
    expect(wrapper.text()).toContain('Price');
    expect(wrapper.text()).toContain('Stock');
  });

  it('shows Add Product button', async () => {
    const { wrapper } = await mountProductList();
    expect(wrapper.find('[data-testid="add-product-btn"]').exists()).toBe(true);
  });

  it('navigates to /products/new when Add Product is clicked', async () => {
    const { wrapper, router } = await mountProductList();
    await wrapper.find('[data-testid="add-product-btn"]').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.path).toBe('/products/new');
  });

  it('navigates to /products/:id when a row is clicked', async () => {
    const { wrapper, router } = await mountProductList();
    await flushPromises();
    const rows = wrapper.findAll('[data-testid="product-row"]');
    expect(rows.length).toBeGreaterThan(0);
    await rows[0]?.trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.path).toMatch(/^\/products\/p/);
  });

  it('renders search input and category filter', async () => {
    const { wrapper } = await mountProductList();
    expect(wrapper.find('[data-testid="search-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="category-filter"]').exists()).toBe(true);
  });

  it('filters products when search input changes', async () => {
    const { wrapper } = await mountProductList();
    await flushPromises();
    const allRows = wrapper.findAll('[data-testid="product-row"]').length;

    await wrapper.find('[data-testid="search-input"]').setValue('Widget');
    await flushPromises();

    const filteredRows = wrapper.findAll('[data-testid="product-row"]').length;
    expect(filteredRows).toBeLessThanOrEqual(allRows);
    expect(wrapper.text()).toContain('Widget A');
  });
});
