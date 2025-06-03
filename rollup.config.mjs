import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import typescript from 'rollup-plugin-typescript2';

const packagePath = join(
  dirname(fileURLToPath(import.meta.url)),
  './package.json',
);
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [typescript()],
  external: ['react', 'react-dom'],
};
