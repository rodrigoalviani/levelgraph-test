'use strict';

var express = require('express')
  , bodyParser = require('body-parser')
  , levelgraph = require('levelgraph')
  , async = require('async')
  , _ = require('underscore')
  , db = levelgraph('test')
  , app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.post('/', function (req, res) {
  if (req.body.subject && req.body.predicate && req.body.object) {
    db.put({subject: req.body.subject, predicate: req.body.predicate, object: req.body.object}, function (err) {
      if (err)
      res.status(500).json({desc: err});
    else
      res.status(200).json({desc: 'Success'});
      res.end();
    });
  } else {
    res.status(500).json({desc: 'Subject, predicate and object is required!'});
    res.end();
  }
});

app.get('/', function (req, res) {
  var query = {};

  if (req.query.subject) query.subject = req.query.subject;
  if (req.query.predicate) query.predicate = req.query.predicate;
  if (req.query.object) query.object = req.query.object;

  db.get(query, function (err, list) {
    if (err)
      res.status(500).json({desc: err});
    else
      res.status(200).json({desc: list});
    res.end();
  });
});

app.get('/search/:subject/:predicate', function (req, res) {
  var r = {}
    , tmp = {};

  db.search({
    subject: req.params.subject,
    predicate: req.params.predicate,
    object: db.v('x')
  }, function (err, list) {
    if (err) {
      res.status(500).json({desc: err});
      res.end();
    } else {
      async.each(list
        , function getTriple (s, cb) {
            db.search({
              subject: s.x,
              predicate: req.params.predicate,
              object: db.v('x'),
              filter: function filter (triple) {
                return triple.object !== req.params.subject;
              }
            }, function (err, lst) {
              tmp[s.x] = {'friends-of-friend': _.pluck(lst, 'x')};
              r.friends = tmp;
              return cb(err);
            });
        }
        , function (err) {
        if (err)
          res.status(500).json({desc: err});
        else
          res.status(200).json({desc: r});
        res.end();
      });
    }
  });
});

app.listen(3000, function () {
  console.log('Server listen port 3000...');
});
