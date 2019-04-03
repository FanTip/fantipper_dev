var express = require('express');
var router = express.Router();
var fs = require('fs');
var fuse = require('fuse.js');

var au_cities = JSON.parse(fs.readFileSync('cities-au/au.json'))

var fuseOptions = {
  shouldSort: true,
  tokenize: true,
  matchAllTokens: true,
  includeScore: true,
  threshold: 0.3,
  location: 0,
  distance: 50,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "city",
    "admin",
    "country"
  ]
};

var fuseSearch = new fuse(au_cities, fuseOptions);

router.get('/search', function (req, res) {
  if (!req.query.city) {
    return res.status(400).send('Not found');
  }

  var matches = fuseSearch.search(req.query.city.trim());
  res.status(200).json(matches.map(match => {
    return match.item;
  }))
});

module.exports = router;