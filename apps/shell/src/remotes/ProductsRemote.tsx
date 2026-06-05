import { useEffect, useRef, type FC } from 'react';
import { useLocation } from 'react-router-dom';

interface VueMountable {
  unmount: () => void;
}

interface ProductsAppModule {
  mountProductsApp: (el: HTMLElement, options: { initialPath: string }) => VueMountable;
}

const ProductsRemote: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const vueAppRef = useRef<VueMountable | null>(null);
  const location = useLocation();
  const initialPathRef = useRef(location.pathname);

  useEffect(() => {
    const el = containerRef.current;
    if (el === null) return;

    let active = true;

    import('mfeProducts/ProductsApp')
      .then((mod: ProductsAppModule) => {
        if (!active || containerRef.current === null) return;
        vueAppRef.current = mod.mountProductsApp(containerRef.current, {
          initialPath: initialPathRef.current,
        });
      })
      .catch((err: unknown) => {
        console.error('[ProductsRemote] Failed to mount Vue app:', err);
      });

    return () => {
      active = false;
      vueAppRef.current?.unmount();
      vueAppRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
};

ProductsRemote.displayName = 'ProductsRemote';

export default ProductsRemote;
