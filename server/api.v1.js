const Router = require('express').Router;
const router = new Router();
const neo4j = require('neo4j');
const fs = require('fs');
const dbconnection = JSON.parse(fs.readFileSync('config/.dbconfig', 'utf8'));
//const tosource = require('tosource');
const _ = require('lodash');
const db = new neo4j.GraphDatabase('http://' + dbconnection.dbaccount + ':' + dbconnection.dbpassword + '@' + dbconnection.dblocation);
const jwt = require('jsonwebtoken');
const appConfig = require('../config/app.config');
const authConfig = require('../config/auth.config');

// What's the preferred exports pattern?
_.extend(router, require('./api.v1.expenditures.js'));

/**
 * Login
 */
router.post('/api/v1/login', function (req, res) {
    let credentials = req.body;
    let query = 'MATCH (user:User {userName:{username}, password:{password}}) RETURN {firstName: user.firstName, lastName: user.lastName, userName: user.userName, userId: user.userId };';
    let params = {username: credentials.userName, password: credentials.password};
    authenticate(req, res, query, params);
});

/**
 * Logout
 */
router.delete('/api/v1/login', function (req, res) {
    res.clearCookie(appConfig.authentication.cookieName);
    res.status(204);
    res.send();
});

// Users

// router.post('/api/v1/users', function (req, res) {
//     let user = req.body;
//     let query = 'CREATE (user:User' + tosource(user) + ') RETURN user;';
//     postQuery(query, user)
//         .then(result => {
//             sendResult(res, result);
//         })
//         .catch(error => {
//             sendError(res, error);
//         });
// });

router.get('/api/v1/users', function (req, res) {
    // console.log(req);
    let params = {};
    let query = 'MATCH (user: User) return {userId: ID(user), firstName: user.firstName, lastName: user.lastName, userName: user.userName}';

    let collectionQuery = buildCollectionQuery(req.query);
    params = _.extend(params, collectionQuery.queryParams);
    query += collectionQuery.queryString;

    getQuery(query, params, res, false, (u) => u);
});

// router.get('/api/v1/users/:user', function (req, res) {
//     let userName = req.params.user;
//     let query = 'MATCH (user:User {userName: {name}}) RETURN {firstName: user.firstName, lastName: user.lastName, userName: user.userName, userId: user.userId }';
//     let params = { name: userName };
//     getQuery(query, params, 'user.properties')
//         .then(result => {
//             sendResult(res, result);
//         })
//         .catch(error => {
//             sendError(res, error);
//         });
// });
//
// router.delete('/api/v1/users/:user', function (req, res) {
//     let userName = req.params.user;
//     let query = 'MATCH (user:User {userName: {name}}) DELETE user;';
//     let params = { name: userName };
//     deleteQuery(query, params)
//         .then(result => {
//             sendResult(res, result);
//         })
//         .catch(error => {
//             sendError(res, error);
//         });
// });
//
// Products
//
// router.post('/api/v1/products', function (req, res) {
//     let product = req.body;
//     let items = product.images;
//     delete (product.images);
//     let query = 'CREATE (product:Product ' + tosource(product) + ') WITH product MATCH(i:Image) where i.imageId in ' + tosource(items) + ' Create(product)-[:hasImage]->(i)';
//     postQuery(query, [product])
//         .then(result => {
//             sendResult(res, result);
//         })
//         .catch(error => {
//             sendError(res, error);
//         });
// });

function productMapper(row) {
    let consolidatedRow = row.product.properties;
    consolidatedRow.productId = row.product._id;
    consolidatedRow.images = row.imageIds;
    consolidatedRow.defaultImageId = row.imageIds.length ? row.imageIds[0] : null;
    return consolidatedRow;
}

router.get('/api/v1/products', function (req, res) {
    let params = {};
    let query = 'MATCH (product: Product) \
                 MATCH (product)-[:hasImage]->(image:Image) \
                 RETURN { product:product, imageIds:collect(ID(image)) }';

    let collectionQuery = buildCollectionQuery(req.query);
    params = _.extend(params, collectionQuery.queryParams);
    query += collectionQuery.queryString;

    getQuery(query, params, res, false, productMapper);
});

router.get('/api/v1/products/popular', function (req, res) {
    let params = {};
    let query = 'MATCH (product: Product {popular:"TRUE"}) \
                 MATCH (product)-[:hasImage]->(image:Image) \
                 RETURN { product:product, imageIds:collect(ID(image)) }';

    let collectionQuery = buildCollectionQuery(req.query);
    params = _.extend(params, collectionQuery.queryParams);
    query += collectionQuery.queryString;

    getQuery(query, params, res, false, productMapper);
});

router.get('/api/v1/products/:product', function (req, res) {
    let query, params;
//    query = 'MATCH (product: Product)-[r:hasImage]->(i:Image) WHERE ID(product) = {productid} RETURN product,r,i;';
    query = 'MATCH (product: Product) WHERE ID(product) = {productId} \
             MATCH (product)-[:hasImage]->(image:Image) \
             RETURN { product:product, imageIds:collect(ID(image)) }';

    params = {productId: parseInt(req.params.product, 10)};
    getQuery(query, params, res, true, productMapper);
});

// router.delete('/api/v1/products/:product', function (req, res) {

//     let query = 'MATCH (product: Product) WHERE ID(product) = {productid} DETACH DELETE product;';
//     let params = { productid: parseInt(req.params.product,10) };
//     deleteQuery(query, params)
//         .then(result => {
//             sendResult(res, result);
//         })
//         .catch(error => {
//             sendError(res, error);
//         });
// });
//
//// Images
//
// router.post('/api/v1/images', function (req, res) {
//     let image = req.body;
//
//     let query = 'CREATE (image:Image ' + tosource(image) + ') RETURN image;';
//     postQuery(query, image)
//         .then(result => {
//             sendResult(res, result);
//         })
//         .catch(error => {
//             sendError(res, error);
//         });
//
// });
//
// router.get('/api/v1/images', function (req, res) {
//     let params = {};
//     let query = 'MATCH (image: Image) return image';
//
//     let collectionQuery = buildCollectionQuery(req.query);
//     params = _.extend(params, collectionQuery.queryParams);
//     query += collectionQuery.queryString;
//
//     getQuery(query, params, 'image', 'imageId')
//         .then(result => {
//             sendResult(res, result);
//         })
//         .catch(error => {
//             sendError(res, error);
//         });
//
// });

router.get('/api/v1/images/:image', function (req, res) {

    let query = 'MATCH (image: Image) where ID(image)={imageid} RETURN image;';
    let params = {imageid: parseInt(req.params.image, 10)};
    getQuery(query, params, res, true, image => image.properties);
});

// // router.delete('/api/v1/images/:image', function (req, res) {
// //     let query = 'MATCH (image: Image) where ID(image)={imageid} DETACH DELETE image;';
// //     let params = { imageid: parseInt(req.params.image,10) };
// //     deleteQuery(query, params)
// //         .then(result => {
// //             sendResult(res, result);
// //         })
// //         .catch(error => {
// //             sendError(res, error);
// //         });
//
// // });
//
// // OrderItems
//
// // router.get('/api/v1/order-items', function (req, res) {
// //     let params = {};
// //     let query = 'MATCH (orderitems: OrderItems) return orderitems';
//
// //     let collectionQuery = buildCollectionQuery(req.query);
// //     params = _.extend(params, collectionQuery.queryParams);
// //     query += collectionQuery.queryString;
//
// //     getQuery(query, params, 'orderitems.properties')
// //         .then(result => {
// //             sendResult(res, result);
// //         })
// //         .catch(error => {
// //             sendError(res, error);
// //         });
// // });
//
// // router.get('/api/v1/order-items/:orderitems', function (req, res) {
// //     let query = 'MATCH (orderitems: OrderItem orderItemId:{orderitemid}}) RETURN orderitems;';
// //     let params = { orderitemid: req.params.orderitems };
// //     getQuery(query, params, 'orderitems', 'orderItemId', true)
// //         .then(result => {
// //             sendResult(res, result);
// //         })
// //         .catch(error => {
// //             sendError(res, error);
// //         });
//
// // });
//
// // router.delete('/api/v1/order-items/:orderitems', function (req, res) {
// //     let query = 'MATCH (orderitems: OrderItem orderItemId:{orderitemid}}) DETACH DELETE orderitems;';
// //     let params = { orderitemid: req.params.orderitems };
// //     deleteQuery(query, params)
// //         .then(result => {
// //             sendResult(res, result);
// //         })
// //         .catch(error => {
// //             sendError(res, error);
// //         });
//
// // });
//
// // Orders
//
// /*router.post('/api/v1/orders/current/add-item', function (req, res) {
//  let orders = req.body;
//  let tx = db.beginTransaction();
//  if (Number.isInteger(orders.orderId) && checkforspecialcharacters(orders.dateCreated))
//  {
//  let items=orders.orderItems;
//  delete(orders.orderItems);
//  let listOfOrderItemIds=[];
//  for (let i=0; i<items.length; i++)
//  {
//  listOfOrderItemIds.push(items[i].orderItemId);
//  }
//  let query = 'CREATE (orderitems:OrderItems ' + tosource(items) + ') CREATE (orders:Orders ' + tosource(orders) + ') WITH orders MATCH(o:OrderItems) where o.orderItemId in '+ tosource(listOfOrderItemIds) + ' Create(orders)-[:hasOrders]->(i)';
//  console.log(query);
//  db.cypher(query, function (err) {
//  if (err) {
//  res.status(409);
//  res.send();
//  }
//  else {
//  console.log('successfully executed query. Going for commit');
//  tx.commit(function (err) {
//  if (err)
//  {
//  res.status(409);
//  res.send();
//  }
//  else
//  {
//  res.status(201);
//  res.send(JSON.stringify(orders));
//  }
//  });
//  }
//  });
//  }
//  else
//  {
//  res.status(401);
//  res.send('{\'message\':\'Invalid Request\'}');
//  }
//  });*/
//
// // router.get('/api/v1/orders', function (req, res) {
// //     let params = {};
// //     let query = 'MATCH (orders: Orders) return orders';
//
// //     let collectionQuery = buildCollectionQuery(req.query);
// //     params = _.extend(params, collectionQuery.queryParams);
// //     query += collectionQuery.queryString;
//
// //     getQuery(query, params, 'orders', 'orderId')
// //         .then(result => {
// //             sendResult(res, result);
// //         })
// //         .catch(error => {
// //             sendError(res, error);
// //         });
//
// // });
//
// // router.get('/api/v1/orders/:orders', function (req, res) {
// //     let query = 'MATCH (orders: Orders {orderId: {orderid}}) RETURN orders;';
// //     let params = { orderid: req.params.orders };
// //     getQuery(query, params, 'orders', 'orderId', true)
// //         .then(result => {
// //             sendResult(res, result);
// //         })
// //         .catch(error => {
// //             sendError(res, error);
// //         });
//
// // });
//
// // router.delete('/api/v1/orders/:orders', function (req, res) {
// //     let query = 'MATCH (orders: Orders {orderId: {orderid}}) DETACH DELETE orders;';
// //     let params = { orderid: req.params.orders };
// //     deleteQuery(query, params)
// //         .then(result => {
// //             sendResult(res, result);
// //         })
// //         .catch(error => {
// //             sendError(res, error);
// //         });
//
// // });

/**
 * Authenticate with the database user record using the supplied credentials
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} query - Database query
 * @param {string} params - Database query parameters
 * @return {undefined}
 */
function authenticate(req, res, query, params) {
    let responseDef;
    let tx = db.beginTransaction();

    db.cypher({query, params}, function (err, results) {
        if (!err) {
            results = results.map(r => _.values(r)[0]);
            console.log(JSON.stringify(results));
            tx.commit(function (err) {
                if (!err && results.length > 0) {
                    let user = results[0];

                    // Attach set-cookie to the response with token
                    const token = jwt.sign(user, authConfig.secret);
                    res.cookie(appConfig.authentication.cookieName, token);

                    responseDef = {status: 201, send: JSON.stringify(user)};
                }
            });
        }

        if (responseDef) {
            sendResult(res, responseDef);
        }
        else {
            sendError(res, {status: 401, message: 'Invalid username or password'});
        }
    });
}

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

// function deleteQuery(query, params) {
//     let responseJSON = {};
//     let tx = db.beginTransaction();
//     return new Promise(function (resolve, reject) {
//         db.cypher({ query, params }, function (err) {
//             if (err) {
//                 responseJSON.status = 401;
//                 responseJSON.send = 'message: oops we need to start over again';
//                 reject(responseJSON);
//             }
//             else {
//                 console.log('successfully executed query. Going for commit');
//                 tx.commit(function (err) {
//                     if (err) {
//                         responseJSON.status = 401;
//                         responseJSON.send = 'message: oops we need to start over again';
//                         reject(responseJSON);
//                     }
//                     else {
//                         responseJSON.status = 204;
//                         responseJSON.send = '';
//                         resolve(responseJSON);
//                     }
//                 });
//             }
//         });
//     });
// }

// function postQuery(query, property) {
//
//     let responseJSON = {};
//     let tx = db.beginTransaction();
//     return new Promise(function (resolve, reject) {
//         db.cypher(query, function (err) {
//             if (err) {
//                 console.log(err);
//                 responseJSON.status = 409;
//                 responseJSON.send = '';
//                 reject(responseJSON);
//             }
//             else {
//                 console.log('successfully executed query. Going for commit');
//                 tx.commit(function (err) {
//                     if (err) {
//                         responseJSON.status = 409;
//                         responseJSON.send = '';
//                         reject(responseJSON);
//                     }
//                     else {
//                         responseJSON.status = 201;
//                         responseJSON.send = JSON.stringify(property);
//                         resolve(responseJSON);
//                     }
//                 });
//             }
//         });
//     });
// }

module.exports = router;
