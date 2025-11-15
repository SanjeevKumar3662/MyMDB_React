// src/declarations.d.ts
declare module "*.webp" {
  const value: string;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URI: string;
  // Add more if needed
  // readonly VITE_WHATEVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
