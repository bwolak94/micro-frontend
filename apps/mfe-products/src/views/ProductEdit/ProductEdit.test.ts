import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';

import ProductEdit from './ProductEdit.vue';

function createTestRouter() {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/products', component: { template: '<div />' } },
      { path: '/products/new', component: ProductEdit },
      { path: '/products/:id', component: ProductEdit },
    ],
  });
  return router;
}

async function mountEdit(path = '/products/new') {
  const router = createTestRouter(path);
  await router.push(path);
  const wrapper = mount(ProductEdit, {
    global: { plugins: [router] },
    attachTo: document.body,
  });
  return { wrapper, router };
}

describe('ProductEdit', () => {
  it('renders Add Product heading for new route', async () => {
    const { wrapper } = await mountEdit('/products/new');
    expect(wrapper.text()).toContain('Add Product');
  });

  it('renders Edit Product heading for existing product route', async () => {
    const { wrapper } = await mountEdit('/products/p1');
    await flushPromises();
    expect(wrapper.text()).toContain('Edit Product');
  });

  it('renders the form with all fields', async () => {
    const { wrapper } = await mountEdit('/products/new');
    expect(wrapper.find('[data-testid="product-form"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="name-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="description-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="category-select"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="price-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="stock-input"]').exists()).toBe(true);
  });

  it('shows Save and Cancel buttons', async () => {
    const { wrapper } = await mountEdit('/products/new');
    expect(wrapper.find('[data-testid="save-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="cancel-btn"]').exists()).toBe(true);
  });

  it('does not show delete button on new product form', async () => {
    const { wrapper } = await mountEdit('/products/new');
    expect(wrapper.find('[data-testid="delete-btn"]').exists()).toBe(false);
  });

  it('shows delete button when editing an existing product', async () => {
    const { wrapper } = await mountEdit('/products/p1');
    await flushPromises();
    expect(wrapper.find('[data-testid="delete-btn"]').exists()).toBe(true);
  });

  it('populates form fields when loading an existing product', async () => {
    const { wrapper } = await mountEdit('/products/p1');
    await flushPromises();
    const nameInput = wrapper.find<HTMLInputElement>('[data-testid="name-input"]');
    expect(nameInput.element.value).toBe('Widget A');
  });

  it('shows validation errors when submitted with empty fields', async () => {
    const { wrapper } = await mountEdit('/products/new');
    await wrapper.find('[data-testid="product-form"]').trigger('submit');
    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="name-error"]').exists()).toBe(true);
    });
  });

  it('shows delete confirmation dialog when Delete is clicked', async () => {
    const { wrapper } = await mountEdit('/products/p1');
    await flushPromises();
    await wrapper.find('[data-testid="delete-btn"]').trigger('click');
    expect(wrapper.find('[data-testid="delete-confirm-dialog"]').exists()).toBe(true);
  });

  it('hides delete confirmation dialog when Cancel is clicked in dialog', async () => {
    const { wrapper } = await mountEdit('/products/p1');
    await flushPromises();
    await wrapper.find('[data-testid="delete-btn"]').trigger('click');
    await wrapper.find('[data-testid="cancel-delete-btn"]').trigger('click');
    expect(wrapper.find('[data-testid="delete-confirm-dialog"]').exists()).toBe(false);
  });

  it('navigates back to /products when Cancel is clicked', async () => {
    const { wrapper, router } = await mountEdit('/products/new');
    await wrapper.find('[data-testid="cancel-btn"]').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.path).toBe('/products');
  });

  it('emits product:updated event and shows success message on save', async () => {
    const { eventBus } = await import('@portfolio/event-bus');
    const handler = vi.fn();
    const unsub = eventBus.on('product:updated', handler);

    const { wrapper } = await mountEdit('/products/p1');
    await flushPromises();

    await wrapper.find('[data-testid="name-input"]').setValue('Updated Widget');
    await wrapper.find('[data-testid="description-input"]').setValue('Updated description');
    await wrapper.find('[data-testid="category-select"]').setValue('electronics');
    await wrapper.find('[data-testid="price-input"]').setValue('39.99');
    await wrapper.find('[data-testid="stock-input"]').setValue('100');

    await wrapper.find('[data-testid="product-form"]').trigger('submit');
    await vi.waitFor(
      () => {
        expect(handler).toHaveBeenCalledWith(expect.objectContaining({ id: 'p1' }));
      },
      { timeout: 3000 },
    );
    unsub();
  });

  it('emits product:deleted and navigates after confirming delete', async () => {
    const { eventBus } = await import('@portfolio/event-bus');
    const handler = vi.fn();
    const unsub = eventBus.on('product:deleted', handler);

    const { wrapper, router } = await mountEdit('/products/p1');
    await flushPromises();

    await wrapper.find('[data-testid="delete-btn"]').trigger('click');
    await wrapper.find('[data-testid="confirm-delete-btn"]').trigger('click');
    await flushPromises();

    expect(handler).toHaveBeenCalledWith({ id: 'p1' });
    expect(router.currentRoute.value.path).toBe('/products');
    unsub();
  });
});
