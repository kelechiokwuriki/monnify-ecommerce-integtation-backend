const NodeCache = require( "node-cache" );
const cache = new NodeCache();

async function set(key, value, ttl = null) {
    if (ttl) {
        return cache.set(key, value, ttl);
    }

    return cache.set(key, value);
}

async function get(key) {
    return cache.get(key);
}

async function del(key) {
    return cache.del(key);
}

module.exports = {
    set: set,
    get: get,
    del: del
}