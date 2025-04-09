import { Option } from '@/models/2014/common/index.js';

const MonsterActionOptionResolver = {
  __resolveType(option: Option) {
    if (option.option_type === 'action') {
      return 'ActionOption';
    }

    if (option.option_type === 'multiple') {
      return 'MultipleActionOption';
    }

    return null;
  },
};

export default MonsterActionOptionResolver;
