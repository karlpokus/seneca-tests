# seneca-tests
Exploring microservices with a single process seneca-clone.

# api
Similar to nodes [event emitter](https://nodejs.org/docs/latest/api/events.html) - add callbacks that depend on patterns matching.

### add(pattern, cb)
cb is run when pattern matches payload from `act`. Chainable. Similar to `on`.

##### Arguments
- pattern *Object*
- cb *Function* passed arguments from `act`.

### act(payload, cb)
Passes payload and cb to `add`. Chainable. Similar to `emit`.

##### Arguments
- payload *Object*
- cb *Function* Args: err *Error*, res *Any*

# test
```bash
$ npm test
```

# todos
- [ ] http
- [ ] tcp

# license
MIT
