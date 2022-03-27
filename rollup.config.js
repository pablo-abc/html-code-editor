import typescript from 'rollup-plugin-ts';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import bundleSize from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const prod = !process.env.ROLLUP_WATCH;

export default [
  {
    input: './src/index.ts',
    output: [
      prod && {
        file: 'dist/src/index.min.js',
        format: 'esm',
        sourcemap: prod,
        exports: 'named',
        plugins: [terser(), bundleSize()],
      },
      { file: pkg.module, format: 'esm', sourcemap: prod, exports: 'named' },
    ],
    plugins: [resolve({ browser: true }), commonjs(), typescript()],
  },
  {
    input: './src/html-code-editor.ts',
    output: [
      prod && {
        file: 'dist/src/html-code-editor.min.js',
        format: 'esm',
        sourcemap: prod,
        exports: 'named',
        plugins: [terser(), bundleSize()],
      },
      {
        file: 'dist/src/html-code-editor.js',
        format: 'esm',
        sourcemap: prod,
        exports: 'named',
      },
    ],
    plugins: [resolve({ browser: true }), commonjs(), typescript()],
  },
];
