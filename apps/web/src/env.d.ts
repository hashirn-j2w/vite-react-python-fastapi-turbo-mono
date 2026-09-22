interface ImportMetaEnv {
  /** API origin, e.g. https://api.example.com. Leave unset to call the same origin (`/api/*`). */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
