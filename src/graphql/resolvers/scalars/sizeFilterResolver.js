import { createEnumScalarType } from './enumFilterResolver.js';

const sizes = ['MEDIUM', 'LARGE', 'TINY', 'HUGE', 'SMALL', 'GARGANTUAN'];

const getSize = size => size[0].toUpperCase() + size.slice(1).toLowerCase();

const SizeFilter = createEnumScalarType('SizeFilter', 'Size or list of sizes', sizes, getSize);

export default SizeFilter;
