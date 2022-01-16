const { createEnumScalarType } = require('./enumFilterResolver');

const times = ['ACTION', 'MINUTE', 'HOUR', 'BONUS_ACTION', 'MINUTES_10', 'DAY', 'REACTION'];

const getTime = time => {
  switch (time) {
    case 'ACTION':
      return '1 action';
    case 'MINUTE':
      return '1 minute';
    case 'HOUR':
      return '1 hour';
    case 'BONUS_ACTION':
      return '1 bonus action';
    case 'MINUTES_10':
      return '10 minutes';
    case 'DAY':
      return '24 hours';
    case 'REACTION':
      return '1 reaction';
  }
};

const CastingTimeFilter = createEnumScalarType(
  'CastingTimeFilter',
  'CastingTime or list of CastingTimes',
  times,
  getTime
);

module.exports = CastingTimeFilter;
