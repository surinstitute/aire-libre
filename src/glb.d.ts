/// <reference types="vite/client" />

// Allow importing .glb files as URL
declare module '*.glb?url' {
  const src: string;
  export default src;
}

declare module '*.glb' {
  const src: string;
  export default src;
}
