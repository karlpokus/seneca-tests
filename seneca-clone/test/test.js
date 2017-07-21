var test = require('tape'),
    path = require('path'),
    ee = require(path.resolve('lib', 'seneca-clone'));

test('ctor', function(t){
  t.true(new ee().pending, 'has pending array');
  t.end();
});

test('add', function(t){
  let temp = new ee();
  t.throws(temp.add.bind(temp), /missing args/, 'missing args throws');
  t.throws(temp.add.bind(temp, {}), /missing args/, 'missing args throws');

  temp
    .add({foo: true}, true)
    .add({bar: true}, true);

  t.equal(temp.pending.length, 2, 'chaining calls');
  t.end();
});

test('act', function(t){
  function cb(x, msg, reply) {
    reply(null, x + msg.data);
  }

  let temp = new ee();
  t.throws(temp.act.bind(temp), /missing args/, 'missing args throws');
  t.throws(temp.act.bind(temp, {}), /missing args/, 'missing args throws');
  t.false(temp.act({}, true), 'returns false on missing pending data');

  temp
    .add({x: 1}, cb.bind(null, 1))
    .add({x: 1, y: 2}, cb.bind(null, 2))
    .add({x: 1, y: 2, z: 3}, cb.bind(null, 3))
    .act({x: 1, y: 2, z: 3, data: 4}, (err, res) => {
      t.error(err);
      t.equal(res, 7, 'calls and passes payload to top match fn');
      t.end();
    })
});

test('awesome math', function(t){
  const awesomeMath = {
    sum(...args) {
      return args.reduce((acc, num) => acc + num, 0);
    },
    product(...args) {
      return args.reduce((acc, num) => acc * num);
    }
  },
  data = [2, 2, 2],
  payloads = {
    sum: {type: 'math', fn: 'sum', data: data},
    product: {type: 'math', fn: 'product', data: data},
    fail: {type: 'math'}
  },
  temp = new ee();

  temp
    .add({type: 'math'}, (msg, reply) => {
      if (msg.fn && awesomeMath[msg.fn]) {
        var res = {data: awesomeMath[msg.fn].apply(null, msg.data)};
        reply(null, res);
      } else {
        reply(new Error('missing math fn'));
      }
    })
    .act(payloads.sum, (err, res) => {
      t.error(err);
      t.equal(res.data, 6, 'sum fn');
    })
    .act(payloads.product, (err, res) => {
      t.error(err);
      t.equal(res.data, 8, 'product fn');
    })
    .act(payloads.fail, (err, res) => {
      t.equal(err.message, 'missing math fn', 'error is set');
      t.end();
    });
});
