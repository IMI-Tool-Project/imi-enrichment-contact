import resolve from '@rollup/plugin-node-resolve';
import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'main.js',
  output: {
    file: 'dist/imi-enrichment-contact.js',
    format: 'umd',
    name:'IMIEnrichmentContact'
  },
  plugins: [
    resolve(),
    buble(),
    commonjs(),
    json()
  ]
};
