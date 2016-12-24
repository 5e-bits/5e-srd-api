var express = require('express'),
    router = express.Router()

var Spellcasting = require('../models/spellcasting');

// Register class routes
router.use('/bard', require('./spellcasting-routes/bard'));
router.use('/cleric', require('./spellcasting-routes/cleric'));
router.use('/druid', require('./spellcasting-routes/druid'));

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