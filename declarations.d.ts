declare module "*.svg" {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
declare module 'eruda' {
  const eruda: {
    init: () => void;
    [key: string]: any; // Para permitir otras propiedades dinámicas
  };
  export default eruda;
}