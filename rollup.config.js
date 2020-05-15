import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		file: 'dist/bundle.js',
		format: 'esm',
		sourcemap: true
	},
	plugins: [
		resolve(),
		commonjs(),
		babel({ babelHelpers: 'bundled' }),
		postcss({ extract: true }),
		production && terser()
	]
};
