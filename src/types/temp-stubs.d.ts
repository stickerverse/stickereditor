// Temporary type stubs for new dependencies until they are installed
declare module 'zustand' {
  export function create<T>(fn: any): T;
}

declare module 'zustand/middleware' {
  export function devtools(fn: any): any;
  export function persist(fn: any, options?: any): any;
  export function subscribeWithSelector(fn: any): any;
}

declare module 'framer-motion' {
  export interface Variants {
    [key: string]: any;
  }
}

declare module 'react-toastify' {
  export const ToastContainer: any;
}

declare module 'react-toastify/dist/ReactToastify.css';