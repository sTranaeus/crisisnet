var auth = require("./auth")
  , _ = require("underscore")
  , clauses = require("./search-clauses")
  , store = require("../cn-store-js");

var queryBuilder = function(dbConn) {
  return function(obj, cb) {
    var params = {};

    // before, after
    _.extend(params, clauses.addDateClause("createdAt", obj.before, obj.after));

    // orderBy
    var sort = { createdAt: -1 };

    // limit
    var limit = obj.limit || 25;
    
    // offset
    var offset = obj.offset || 0;
   
    find = store.User.find(params)
      .limit(limit)
      .skip(offset)
      .sort(sort);

    find.exec(function(err, results) {
      store.User.count(params, function(err, count) {
        cb(err, results, {total: count});
      });
    });
      
  };
};

module.exports = {
  middlewares: [],
  queryBuilder: queryBuilder
}