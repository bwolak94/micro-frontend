interface VueMountable {
  unmount: () => void;
}

declare module 'mfeProducts/ProductsApp' {
  export function mountProductsApp(el: HTMLElement, options: { initialPath: string }): VueMountable;
}
