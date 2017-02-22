const Router = require('express').Router;
const router = new Router();
const neo4j = require('neo4j');
const fs = require('fs');
const dbconnection = JSON.parse(fs.readFileSync('config/.dbconfig', 'utf8'));
const tosource = require('tosource');
const _ = require('lodash');
const db = new neo4j.GraphDatabase('http://' + dbconnection.dbaccount + ':' + dbconnection.dbpassword + '@' + dbconnection.dblocation);
router.post('/api/v1/login', function (req, res) {
    let credentials = req.body;
    console.log(credentials);
    let query = 'MATCH (user:User {userName:{username}, password:{password}}) RETURN user;';
    let params = { username: credentials.userName, password: credentials.password };
    checkforlogin(query, params)
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });

});
router.post('/api/v1/users', function (req, res) {
    let user = req.body;
    let query = 'CREATE (user:User' + tosource(user) + ') RETURN user;';
    postquery(query, user)
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });

});

router.get('/api/v1/users', function (req, res) {
    // console.log(req);
    let params = {};
    let query = 'MATCH (user: User) return user';
    if (req.query.sortDescending && req.query.sortDescending === 'true') {
        query += 'DESC';
    }
    if (req.query.page && req.query.page > 0) {
        params.skippage = (req.query.page - 1) * req.query.pageSize;
        query += ' SKIP {skippage}';
    }
    if (req.query.pageSize) {
        params.limit = req.query.pageSize;
        query += ' LIMIT {limit}';
    }
    getquery(query, params, 'user.properties')
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });

});
router.get('/api/v1/users/:user', function (req, res) {
    let userName = req.params.user;
    console.log('values', userName);
    let query = 'MATCH (user:User {userName: {name}}) RETURN user';
    let params = { name: userName };
    getquery(query, params, 'user.properties')
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });

});
router.delete('/api/v1/users/:user', function (req, res) {
    let userName = req.params.user;
    let query = 'MATCH (user:User {userName: {name}}) DELETE user;';
    let params = { name: userName };
    deletequery(query, params)
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });

});
//Products
router.post('/api/v1/products', function (req, res) {
    let product = req.body;
    let items = product.images;
    delete (product.images);
    let query = 'CREATE (product:Product ' + tosource(product) + ') WITH product MATCH(i:Image) where i.imageId in ' + tosource(items) + ' Create(product)-[:hasImage]->(i)';
    postquery(query, [product])
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });
});
router.get('/api/v1/products', function (req, res) {
    let params = {};
    let query = 'MATCH (product: Product) return product';
    if (req.query.sortDescending && req.query.sortDescending === 'true') {
        query += 'DESC';
    }
    if (req.query.page && req.query.page > 0) {
        params.skippage = (req.query.page - 1) * req.query.pageSize;
        query += ' SKIP {skippage}';
    }
    if (req.query.pageSize) {
        params.limit = req.query.pageSize;
        query += ' LIMIT {limit}';
    }
    getquery(query, params, 'product.properties')
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });
});

router.get('/api/v1/products/:product', function (req, res) {

    if (req.params.product !== 'popular') {
        let query = 'MATCH (product: Product {productId:{productid}}) RETURN product;';
        let params = { productid: req.params.product };
        getquery(query, params, 'product.properties')
            .then(result => {
                res.status(result.status);
                res.send(result.send);
            })
            .catch(error => {
                res.status(error.status);
                res.send(error.send);
            });
    }
    else {
        let query = 'MATCH (product: Product {popular:{popular}}) RETURN product;';
        let params = { popular: true };
        getquery(query, params, 'product.properties')
            .then(result => {
                res.status(result.status);
                res.send(result.send);
            })
            .catch(error => {
                res.status(error.status);
                res.send(error.send);
            });

    }
});


router.delete('/api/v1/products/:product', function (req, res) {

    let query = 'MATCH (product: Product {productId:{productid}) DETACH DELETE product;';
    let params = { productid: req.params.product };
    deletequery(query, params)
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });
});


//Images


router.post('/api/v1/images', function (req, res) {
    let image = req.body;

    let query = 'CREATE (image:Image ' + tosource(image) + ') RETURN image;';
    postquery(query, image)
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });

});
router.get('/api/v1/images', function (req, res) {
    let params = {};
    let query = 'MATCH (image: Image) return image';
    if (req.query.sortDescending && req.query.sortDescending === 'true') {
        query += 'DESC';
    }
    if (req.query.page && req.query.page > 0) {
        params.skippage = (req.query.page - 1) * req.query.pageSize;
        query += ' SKIP {skippage}';
    }
    if (req.query.pageSize) {
        params.limit = req.query.pageSize;
        query += ' LIMIT {limit}';
    }
    getquery(query, params, 'image.properties')
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });
});

router.get('/api/v1/images/:image', function (req, res) {

    let query = 'MATCH (image: Image {imageId:{imageid}}) RETURN image;';
    let params = { imageid: req.params.image };
    getquery(query, params, 'image.properties')
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });

});
router.delete('/api/v1/images/:image', function (req, res) {
    let query = 'MATCH (image: Image {imageId:{imageid}}) DETACH DELETE image;';
    let params = { imageid: req.params.image };
    deletequery(query, params)
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });
});

//OrderItems



router.get('/api/v1/order-items', function (req, res) {
    let params = {};
    let query = 'MATCH (orderitems: OrderItems) return orderitems';
    if (req.query.sortDescending && req.query.sortDescending === 'true') {
        query += 'DESC';
    }
    if (req.query.page && req.query.page > 0) {
        params.skippage = (req.query.page - 1) * req.query.pageSize;
        query += ' SKIP {skippage}';
    }
    if (req.query.pageSize) {
        params.limit = req.query.pageSize;
        query += ' LIMIT {limit}';
    }
    getquery(query, params, 'orderitems.properties')
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });
});

router.get('/api/v1/order-items/:orderitems', function (req, res) {
    let query = 'MATCH (orderitems: OrderItem orderItemId:{orderitemid}}) RETURN orderitems;';
    let params = { orderitemid: req.params.orderitems };
    getquery(query, params, 'orderitems.properties')
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });
});


router.delete('/api/v1/order-items/:orderitems', function (req, res) {
    let query = 'MATCH (orderitems: OrderItem orderItemId:{orderitemid}}) DETACH DELETE orderitems;';
    let params = { orderitemid: req.params.orderitems };
    deletequery(query, params)
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });
});


//Orders

/*router.post('/api/v1/orders/current/add-item', function (req, res) {
    let orders = req.body;
	let tx = db.beginTransaction();
	if (Number.isInteger(orders.orderId) && checkforspecialcharacters(orders.dateCreated))
	{
	let items=orders.orderItems;
	delete(orders.orderItems);
	let listOfOrderItemIds=[];
	for (let i=0; i<items.length; i++)
	{
		listOfOrderItemIds.push(items[i].orderItemId);
	}
    let query = 'CREATE (orderitems:OrderItems ' + tosource(items) + ') CREATE (orders:Orders ' + tosource(orders) + ') WITH orders MATCH(o:OrderItems) where o.orderItemId in '+ tosource(listOfOrderItemIds) + ' Create(orders)-[:hasOrders]->(i)';
	console.log(query);
    db.cypher(query, function (err) {
        if (err) {
            res.status(409);
            res.send();
        }
        else {
            console.log('successfully executed query. Going for commit');
            tx.commit(function (err) {
				if (err)
				{
					res.status(409);
					res.send();
				}
				else
				{
                res.status(201);
                res.send(JSON.stringify(orders));
				}
            });
        }
    });
	}
	else
	{
		res.status(401);
        res.send('{\'message\':\'Invalid Request\'}');
	}
});*/
router.get('/api/v1/orders', function (req, res) {
    let params = {};
    let query = 'MATCH (orders: Orders) return orders';
    if (req.query.sortDescending && req.query.sortDescending === 'true') {
        query += 'DESC';
    }
    if (req.query.page && req.query.page > 0) {
        params.skippage = (req.query.page - 1) * req.query.pageSize;
        query += ' SKIP {skippage}';
    }
    if (req.query.pageSize) {
        params.limit = req.query.pageSize;
        query += ' LIMIT {limit}';
    }
    getquery(query, params, 'orders.properties')
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });
});

router.get('/api/v1/orders/:orders', function (req, res) {
    let query = 'MATCH (orders: Orders {orderId: {orderid}}) RETURN orders;';
    let params = { orderid: req.params.orders };
    getquery(query, params, 'orders.properties')
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });
});


router.delete('/api/v1/orders/:orders', function (req, res) {
    let query = 'MATCH (orders: Orders {orderId: {orderid}}) DETACH DELETE orders;';
    let params = { orderid: req.params.orders };
    deletequery(query, params)
        .then(result => {
            res.status(result.status);
            res.send(result.send);
        })
        .catch(error => {
            res.status(error.status);
            res.send(error.send);
        });
});

function checkforlogin(query, params) {
    let responseJSON = {};
    let tx = db.beginTransaction();
    return new Promise(function (resolve, reject) {
        db.cypher({ query, params }, function (err, results) {
            if (err) {
                console.log('api/login', err);
                responseJSON.status = 401;
                responseJSON.send = '{\'message\':\'Invalid username or password\'}';
                reject(err);
            }
            else {
                console.log('successfully executed query. Going for commit');
                tx.commit(function (err) {
                    if (err) {
                        console.log('api/login', err);
                        responseJSON.status = 401;
                        responseJSON.send = '{\'message\':\'Invalid username or password\'}';
                        reject(err);
                    }
                    else if (results.length > 0) {
                        let tokenObject = {
                            'userName': results[0].user.properties.userName,
                            'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJJc3N1ZXIiOiJodHRwOi8vd3d3Lnd5bnlhcmRncm91cC5jb20iLCJBdWRpZW5jZSI6IkFDQSIsIlByaW5jaXBhbCI6eyJTZXNzaW9uSWQiOiI3ZDZjN2ZjMC1lNzkzLTQyNjMtOTQ3OC01MmQzMmQyYzYzNjEiLCJVc2VyS2V5IjoiNCIsIlVzZXJOYW1lIjoia2NsaWZmZSIsIkNsYWltcyI6WyJBZG1pbiJdLCJMb2NhbGUiOiJlbi1OWiIsIlNlc3Npb25UaW1lT3V0IjoiXC9EYXRlKDE0NTA3OTQ1OTczNjIpXC8iLCJJc3N1ZWRUbyI6bnVsbCwiSWRlbnRpdHkiOnsiTmFtZSI6ImtjbGlmZmUiLCJBdXRoZW50aWNhdGlvblR5cGUiOiJXeW55YXJkIiwiSXNBdXRoZW50aWNhdGVkIjp0cnVlfX0sIkV4cGlyeSI6IlwvRGF0ZSgxKVwvIn0.0GZlnA-mdDQqSfSKvBlWsUehtVCRkNK8DA9siyeVLQ0'
                        };
                        responseJSON.status = 201;
                        responseJSON.send = JSON.stringify(tokenObject);
                        resolve(responseJSON);
                    }
                    else {
                        responseJSON.status = 401;
                        responseJSON.send = '{\'message\':\'Invalid username or password\'}';
                        resolve(responseJSON);
                    }
                });
            }
        });
    });


}

function getquery(query, params, properties) {
    let responseJSON = {};
    let tx = db.beginTransaction();
    return new Promise(function (resolve, reject) {
        db.cypher({ query, params }, function callback(err, results) {
            if (err) {
                responseJSON.status = 409;
                responseJSON.send = '';
                reject(responseJSON);
            }
            else if (results.length > 0) {
                console.log('successfully executed query. Going for commit');
                tx.commit(function (err) {
                    if (err) {
                        responseJSON.status = 409;
                        responseJSON.send = '';
                        reject(responseJSON);
                    }
                    else {
                        responseJSON.status = 201;
                        responseJSON.send = JSON.stringify(_.map(results, properties));
                        resolve(responseJSON);
                    }
                });
            }
            else {
                responseJSON.status = 201;
                responseJSON.send = '{\'message\':\'No User found\'}';
                resolve(responseJSON);
            }
        });
    });
}

function deletequery(query, params) {
    let responseJSON = {};
    let tx = db.beginTransaction();
    return new Promise(function (resolve, reject) {
        db.cypher({ query, params }, function (err) {
            if (err) {
                responseJSON.status = 401;
                responseJSON.send = 'message: oops we need to start over again';
                reject(responseJSON);
            }
            else {
                console.log('successfully executed query. Going for commit');
                tx.commit(function (err) {
                    if (err) {
                        responseJSON.status = 401;
                        responseJSON.send = 'message: oops we need to start over again';
                        reject(responseJSON);
                    }
                    else {
                        responseJSON.status = 204;
                        responseJSON.send = '';
                        resolve(responseJSON);
                    }
                });
            }
        });
    });
}

function postquery(query, property) {

    let responseJSON = {};
    let tx = db.beginTransaction();
    return new Promise(function (resolve, reject) {
        db.cypher(query, function (err) {
            if (err) {
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


//const url = require('url');
//const config = require('../config/app.config');

/**
 * Example 1:
 *
 * Add handler to router to internally handle fetching
 * a user by user id.
 *
 * Use Case:
 *
 * This could be for implementing your own backend logic
 * or to supplement static mocks with dynamic mocks.

router.get('/api/v1/users/:userId', (req, res) => {
    res.json({
        'userId': req.params.userId,
        'firstName': 'John (dynamic)',
        'lastName': 'Doe',
        'userName': 'john.doe'
    });
});*/

/**
 * Example 2:
 *
 * Allow any other 'users' requests to fall through to
 * next handler, in this case we will fall through to
 * mocks or proxy/redirect if enabled.
 *
 * Use Case:
 *
 * You may want to do some pre-processing on all
 * user requests and perhaps do some preliminary
 * common work on the request and response object
 * before the next handler gets it.

router.use('/api/v1/users', (req, res, next) => {
    next();
});*/

/**
 * Example 3:
 *
 * Delegate delegate some or all actions another
 * server by means of a proxy. Here we are only
 * setting proxy to calls from /api/v1/errors
 * and down.
 *
 * Use Case:
 *
 * We can setup environment letiables to define
 * which server to connect to for the API at runtime.
 *
 * The proxy will allow us to connect the client to
 * the server without the browser reaching across
 * domains which would require CORS to be enabled on
 * the services.

if (config.apiServer) {
    const proxy = require('express-http-proxy');
    router.use('/api/v1/errors', proxy(config.apiServer, {
        intercept: (rsp, data, req, res, callback) => {
            if (res._headers['set-cookie']) {
                //fix any set cookie headers specific to the proxied domain back to the local domain
                let localDomain = req.headers.host.substr(0, req.headers.host.indexOf(':') || req.headers.length),
                    proxyDomain = url.parse(config.apiServer).host;
                res._headers['set-cookie'] = JSON.parse(JSON.stringify(res._headers['set-cookie']).replace(proxyDomain, localDomain));
            }
            if (res._headers['location']) {
                //fix any location headers back to app root rather than relative
                res.location('/' + res._headers['location']);
                res.end();
                return;
            }
            try {
                callback(null, data);
            }
            catch (e) {
                console.log(e);
            }
        },
        forwardPath: (req) => {
            //forward to proxy with same url including the prefix
            return `${req.baseUrl}${url.parse(req.url).path}`;
        }
    }));
}*/

/**
 * Example 4:
 *
 * Delegate delegate some or all actions another
 * server by means of a redirect. Here we are only
 * setting proxy to calls from /api/v1/login
 * and down.
 *
 * Use Case:
 *
 * We can setup environment letiables to define
 * which server to connect to for the API at runtime.
 *
 * The redirect is simpler than the proxy but
 * requires that CORS be enabled on the destination
 * server.

if (config.apiServer) {
    router.use('/api/v1', (req, res) => {
        res.redirect(`${config.apiServer}${req.baseUrl}${url.parse(req.url).path}`);
    });
} */

module.exports = router;
