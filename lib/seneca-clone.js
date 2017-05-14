function ee() {
  this.pending = [];
}

// return pending with highest match or null
ee.prototype._findMatch = function(payload) {
  function objectComparison(a, b) {
    return Object.keys(a).filter(function(key){
      return a[key] == b[key];
    }).length;
  }

  var match = this.pending
    .map(function(pending){
      pending._match = objectComparison(payload, pending.pattern);
      return pending;
    })
    .sort(function(a, b){
      return b._match - a._match;
    })[0];

    return (match._match > 0)? match: null;
}

ee.prototype.add = function(pattern, cb) {
  if (!pattern || !cb) {
    throw new Error('missing args');
  }

  this.pending.push({pattern, cb});
  return this;
}

ee.prototype.act = function(payload, cb) {
  if (!payload || !cb) {
    throw new Error('missing args');
  }

  if (!this.pending.length) {
    return false;
  }

  var match = this._findMatch(payload);

  if (match) {
    match.cb.call(this, payload, cb);
  }
  return this;
}

module.exports = ee;
