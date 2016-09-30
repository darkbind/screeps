var Cache = {
    _cache: {},
    _persistence: false
};

Cache.setPersistence = function(state) {
    this._persistence = state;
};

Cache.has = function(key) {
    if (this._persistence) {
        return Memory[key] !== undefined;
    }

    return this._cache[key] !== undefined;
};

Cache.set = function(key, value) {
    if (this._persistence) {
        Memory[key] = value;
    } else {
        this._cache[key] = value;
    }
    return this;
};

Cache.get = function(key) {
    if (this._persistence) {
        return Memory[key];
    }

    return this._cache[key];
};

Cache.remove = function(key) {
    if (this._persistence) {
        return delete Memory[key];
    }

    return delete this._cache[key];
};

module.exports = Cache;