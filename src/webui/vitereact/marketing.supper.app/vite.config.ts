import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@enterprise/config': path.resolve(__dirname, 'packages/config/src/index.ts'),
      '@enterprise/api-contracts': path.resolve(__dirname, 'packages/api-contracts/src/index.ts'),
      '@enterprise/api': path.resolve(__dirname, 'packages/api/src/index.ts'),
      '@enterprise/query': path.resolve(__dirname, 'packages/query/src/index.ts'),
      '@enterprise/state': path.resolve(__dirname, 'packages/state/src/index.ts'),
      '@enterprise/theme': path.resolve(__dirname, 'packages/theme/src/index.ts'),
      '@enterprise/localization': path.resolve(__dirname, 'packages/localization/src/index.ts'),
      '@enterprise/forms': path.resolve(__dirname, 'packages/forms/src/index.ts'),
      '@enterprise/ui': path.resolve(__dirname, 'packages/ui/src/index.ts'),
      '@enterprise/auth': path.resolve(__dirname, 'packages/auth/src/index.ts'),
      '@enterprise/observability': path.resolve(__dirname, 'packages/observability/src/index.ts'),
      '@enterprise/feature-flags': path.resolve(__dirname, 'packages/feature-flags/src/index.ts'),
      '@enterprise/schemas': path.resolve(__dirname, 'packages/schemas/src/index.ts'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
});
