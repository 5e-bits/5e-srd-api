let express = require('express'),
    router = express.Router();

var Table = require('../models/table');

let subfolder_name = "table-routes"

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


// -------------------------------------
router
.get('/', (req,res) => {
    Table.find((err,tables) => {
      if (err) {
        res.send(err);
      }
    }).sort( { index: 'asc'} ).exec( (err, tables) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(tables);
    })
})

// -------------------------------------
router
.get('/:index', (req,res) => {
  Table.findOne( { index: parseInt(req.params.index) }, (err,table) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(table);
  })
})

module.exports = router;