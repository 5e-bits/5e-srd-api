let express = require('express'),
    router = express.Router();

var Proficiency = require('../models/proficiency');


let subfolder_name = "proficiency-routes"

// Register class routes
router.use('/barbarian', require('./' + subfolder_name + '/barbarian'));
router.use('/bard', require('./' + subfolder_name + '/bard'));
router.use('/cleric', require('./' + subfolder_name + '/cleric'));
router.use('/druid', require('./' + subfolder_name + '/druid'));
router.use('/fighter', require('./' + subfolder_name + '/fighter'));
router.use('/monk', require('./' + subfolder_name + '/monk'));
router.use('/paladin', require('./' + subfolder_name + '/paladin'));
router.use('/rogue', require('./' + subfolder_name + '/rogue'));
router.use('/ranger', require('./' + subfolder_name + '/ranger'));
router.use('/sorcerer', require('./' + subfolder_name + '/sorcerer'));
router.use('/warlock', require('./' + subfolder_name + '/warlock'));
router.use('/wizard', require('./' + subfolder_name + '/wizard'));

router.use('/weapons', require('./' + subfolder_name + '/weapons'));
router.use('/armor', require('./' + subfolder_name + '/armor'));
router.use('/saving-throws', require('./' + subfolder_name + '/saving-throws'));
router.use('/artisans-tools', require('./' + subfolder_name + '/artisans-tools'));
router.use('/musical-instruments', require('./' + subfolder_name + '/musical-instruments'));
router.use('/skills', require('./' + subfolder_name + '/skills'));

// -------------------------------------
router
.get('/', (req,res) => {
    Proficiency.find((err,proficiencies) => {
      if (err) {
        res.send(err);
      }
    }).sort( { index: 'asc'} ).exec( (err, proficiencies) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(proficiencies);
    })
})

// -------------------------------------
router
.get('/:index', (req,res) => {
  Proficiency.findOne( { index: parseInt(req.params.index) }, (err,proficiency) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(proficiency);
  })
})

module.exports = router;