const tosource = require('tosource');
const _ = require('lodash');
const dataFunctions = require('./data-functions.js');

module.exports = function(router, db) {

// Expenditures

    router.get('/api/v1/expenditures', function (req, res) {
        let params = {};
        let query = 'MATCH (expenditure:Expenditure) RETURN expenditure';

        let collectionQuery = buildCollectionQuery(req.query);
        params = _.extend(params, collectionQuery.queryParams);
        query += collectionQuery.queryString;

        getQuery(query, params, res, false, function (row) {
            return row.properties;
        });
    });
    router.get('/api/v1/expenditures/by-month', function (req, res) {
        let params = {};
        let query = 'MATCH (e:Expenditure) RETURN e.year, e.month, sum(e.expenditure) AS cnt order by e.month';
        let collectionQuery = buildCollectionQuery(req.query);
        params = _.extend(params, collectionQuery.queryParams);
        query += collectionQuery.queryString;

        getQuery(query, params, res, false, function (row) {
            console.log(row);
            return row.properties;
        });
    });
    router.post('/api/v1/expenditures', function (req, res) {
        let expenditure = req.body;

        let query = 'CREATE (expenditure:Expenditure ' + tosource(expenditure) + ') RETURN expenditure;';
        postQuery(query, expenditure)
            .then(result => {
                sendResult(res, result);
            })
            .catch(error => {
                sendError(res, error);
            });
    });
    router.patch('/api/v1/expenditures', function (req, res) {
        const props = require('../raml/api/v1/expenditures/expenditure-collection.example.json');
        let params = {
            props: props
        };
        let query = 'UNWIND $props AS map CREATE (expenditure:Expenditure) SET expenditure = map';
        patchQuery(query, params, res);
    });

// Supporting Functions

    function sendResult(response, result) {
        response.status(result.status);
        response.send(result.send);
    }

    function sendError(response, errorDef) {
        console.log('sendError: ', errorDef);
        if (errorDef.message) {
            errorDef.send = JSON.stringify({message: errorDef.message});
        }
        response.status(errorDef.status);
        response.send(errorDef.send);
    }

    function buildCollectionQuery(requestParams) {
        let queryString = '';
        let queryParams = {};
        if (requestParams.sortDescending && requestParams.sortDescending === 'true') {
            queryString += ' DESC';
        }
        if (requestParams.page && requestParams.page > 0) {
            queryParams.skippage = (requestParams.page - 1) * requestParams.pageSize;
            queryString += ' SKIP {skippage}';
        }
        if (requestParams.pageSize) {
            queryParams.limit = requestParams.pageSize;
            queryString += ' LIMIT {limit}';
        }
        return {queryString, queryParams};
    }

    function getQuery(query, params, res, singleEntity, mapper) {

        // default to the identity function
        mapper = mapper || function (x) {
                return x;
            };

        let tx = db.beginTransaction();
        db.cypher({query, params}, function callback(err, results) {
            if (err) {
                console.log(query);
                console.log(err);
                sendError(res, {status: 409, send: ''});
            }
            else {
                console.log('successfully executed query. Going for commit');
                tx.commit(function (err) {
                    if (err) {
                        sendError(res, {status: 409, send: ''});
                    }
                    else {
                        results = results.map(r => mapper(_.values(r)[0]));
                        if (singleEntity) {
                            results = results.length ? results[0] : {};
                        }
                        sendResult(res, {status: 201, send: JSON.stringify(results)});
                    }
                });
            }
        });
    }

    function patchQuery(query, params, res) {

        let tx = db.beginTransaction();
        db.cypher({query, params}, function (err) {
            if (err) {
                console.log(query);
                console.log(err);
                sendError(res, {status: 409, send: ''});
            }
            else {
                console.log('successfully executed query. Going for commit');
                tx.commit(function (err) {
                    if (err) {
                        sendError(res, {status: 409, send: ''});
                    }
                    else {
                        sendResult(res, {status: 201, send: {patch: 'success'}});
                    }
                });
            }
        });
    }

    function postQuery(query, property) {

        let responseJSON = {};
        let tx = db.beginTransaction();
        return new Promise(function (resolve, reject) {
            db.cypher(query, function (err) {
                if (err) {
                    console.log(err);
                    responseJSON.status = 409;
                    responseJSON.send = '';
                    reject(responseJSON);
                }
                else {
                    console.log('successfully executed query. Going for commit');
                    tx.commit(function (err) {
                        if (err) {
                            responseJSON.status = 409;
                            responseJSON.send = '';
                            reject(responseJSON);
                        }
                        else {
                            responseJSON.status = 201;
                            responseJSON.send = JSON.stringify(property);
                            resolve(responseJSON);
                        }
                    });
                }
            });
        });
    }
};