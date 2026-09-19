import SimpleController from '@/controllers/simpleController'
import MagicItem from '@/models/2014/magicItem'

export default new SimpleController(MagicItem, { cache: true })
