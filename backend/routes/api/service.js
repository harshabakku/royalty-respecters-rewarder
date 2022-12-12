/**
 * @author harsha bakku
 * @since 0.1
 * @version 0.1
 */
require('log-timestamp');
const express = require('express');
const router = express.Router();
const { fetchRoyaltyRespecters } = require('../../src/common/collection');


router.get('/royaltyRespecters', async function (req, res) {
        
    const collectionSymbol = req.query.collectionSymbol;

    const royaltyrRespecters = await fetchRoyaltyRespecters(collectionSymbol)
    res.json(royaltyrRespecters);

});
 
module.exports = router;