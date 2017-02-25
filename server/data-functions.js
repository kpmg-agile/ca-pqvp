module.exports = {

    groupBy: function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }, groupByTwoKeys: function (xs, key1, key2) {
        return xs.reduce(function (rv, x) {
            let key = x[key1] + '_' + x[key2];
            rv[key] = rv[key] || {keys: {}, data: []};
            rv[key].keys[key1] = x[key1];
            rv[key].keys[key2] = x[key2];
            rv[key].data.push(x);
            return rv;
        }, {});
    }, sum: function (d, property) {
        return d.reduce(function (a, b) {
            return a + b[property];
        }, 0);
    }
};
