export function mountProductsApp(el: HTMLElement): { unmount: () => void } {
  el.innerHTML = '<div data-testid="mock-products-app"><h1>Products</h1></div>';
  return {
    unmount() {
      el.innerHTML = '';
    },
  };
}
