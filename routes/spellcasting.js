var express = require('express'),
    router = express.Router()

var Spellcasting = require('../models/spellcasting');

let subfolder_name = "spellcasting-routes"

// Register class routes
router.use('/bard', require('./' + subfolder_name + '/bard'));
router.use('/cleric', require('./' + subfolder_name + '/cleric'));
router.use('/druid', require('./' + subfolder_name + '/druid'));
router.use('/paladin', require('./' + subfolder_name + '/paladin'));
router.use('/ranger', require('./' + subfolder_name + '/ranger'));
router.use('/sorcerer', require('./' + subfolder_name + '/sorcerer'));
router.use('/warlock', require('./' + subfolder_name + '/warlock'));
router.use('/wizard', require('./' + subfolder_name + '/wizard'));

router
.get('/', (req,res) => {
    Spellcasting.find((err,spellcasting) => {
        if (err) {
            res.send(err);
        }
        res.status(200).json(spellcasting);
    }).sort({index:'asc'}).exec((err,spellcasting) => {
        if (err) {
            res.send(err);
        }
    })
})

module.exports = router;