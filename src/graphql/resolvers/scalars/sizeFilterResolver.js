import { createEnumScalarType } from './enumFilterResolver.js';

const sizes = ['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'HUGE', 'GARGANTUAN'];

const getSize = size => size[0].toUpperCase() + size.slice(1).toLowerCase();

const SizeFilter = createEnumScalarType('SizeFilter', 'Size or list of sizes', sizes, getSize);

export default SizeFilter;
