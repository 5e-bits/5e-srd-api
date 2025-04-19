import { createEnumScalarType } from './enumFilterResolver'

const sizes = ['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'HUGE', 'GARGANTUAN']

const getSize = (size: string) => size[0].toUpperCase() + size.slice(1).toLowerCase()

const SizeFilter = createEnumScalarType(
  'SizeFilter',
  'Size ("TINY", "SMALL", "MEDIUM", "LARGE", "HUGE", "GARGANTUAN") or list of sizes',
  sizes,
  getSize
)

export default SizeFilter
