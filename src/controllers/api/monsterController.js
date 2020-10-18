const { promisify } = require('util');
const Monster = require('../../models/monster');
const utility = require('./utility');
const { redisClient } = require('../../util');
const getAsync = promisify(redisClient.get).bind(redisClient);

/**
 * Builds a MongoDB query based on provided URL query params in the request.
 * Used to filter entries to those matching particular values
 * @param queryParams URL query params in the API request
 */
function buildQuery(queryParams) {
  const query = {};

  if (queryParams.name) {
    query.name = { $regex: new RegExp(utility.escapeRegExp(queryParams.name), 'i') };
  }
  if (queryParams.challenge_rating) {
    query.challenge_rating = { $in: queryParams.challenge_rating.split(',') };
  }
  if (queryParams.alignment) {
    query.alignment = { $regex: utility.csvToIRegExp(queryParams.alignment) };
  }
  if (queryParams.type) {
    query.type = { $in: queryParams.type.split(',') };
  }
  if (queryParams.damage_resistances) {
    query.damage_resistances = {
      $elemMatch: { $regex: utility.csvToIRegExp(queryParams.damage_resistances) }
    };
  }
  if (queryParams.damage_vulnerabilities) {
    query.damage_vulnerabilities = {
      $elemMatch: { $regex: utility.csvToIRegExp(queryParams.damage_vulnerabilities) }
    };
  }
  if (queryParams.damage_immunities) {
    query.damage_immunities = {
      $elemMatch: { $regex: utility.csvToIRegExp(queryParams.damage_immunities) }
    };
  }
  if (queryParams.condition_immunities) {
    query.condition_immunities = {
      $elemMatch: { name: { $regex: utility.csvToIRegExp(queryParams.condition_immunities) } }
    };
  }
  return query;
}

exports.index = async (req, res, next) => {
  const query = buildQuery(req.query);

  const redisKey = req.originalUrl;
  const data = await getAsync(redisKey).catch(_err => {
    return;
  });

  if (data) {
    res.status(200).json(JSON.parse(data));
  } else {
    await Monster.find(query)
      .sort({ index: 'asc' })
      .then(async data => {
        const json_data = utility.NamedAPIResource(data);
        redisClient.set(redisKey, JSON.stringify(json_data));
        res.status(200).json(json_data);
      })
      .catch(err => {
        next(err);
      });
  }
};

exports.show = async (req, res, next) => {
  await Monster.findOne({ index: req.params.index })
    .then(data => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    })
    .catch(err => {
      next(err);
    });
};
