import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: [
    '@ajgifford/keepwatching-types',
    '@emotion/react',
    '@emotion/styled',
    '@mui/icons-material',
    '@mui/material',
    'react',
    'react-dom',
    'react-router-dom',
    'recharts',
  ],
});
