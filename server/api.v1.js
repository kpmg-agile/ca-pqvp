const Router = require('express').Router;
const router = new Router();
const neo4j = require('neo4j');
const fs = require('fs');
const dbconnection = JSON.parse(fs.readFileSync('config/.dbconfig', 'utf8'));
const tosource = require('tosource');
const _=require('lodash');
const db = new neo4j.GraphDatabase('http://' + dbconnection.dbaccount + ':' + dbconnection.dbpassword + '@' + dbconnection.dblocation);
let specialCharactersRegEx = RegExp(/[-!@$%^&*()_+|~=`{}\[\]:";'<>?,-.\/]/);
/*
    Database Seeding - temporary
    create (user:User {userName: 'authuser', firstName: 'John', lastName: 'Doe', userId: '1'})
    create (user:User {userName: 'adminuser', firstName: 'Jane', lastName: 'Doe', userId: '2'})
 */



router.post('/api/v1/login', function (req, res) {
    let credentials = req.body;
    console.log(credentials);
	if (checkforspecialcharacters(credentials.userName) && !Number.isInteger(credentials.userName))
	{
    let tx = db.beginTransaction();
    let query = 'MATCH (user:User {userName:\''+ credentials.userName + '\'}) RETURN user;';
    db.cypher(query, function (err, results) {
        if (err) {
            console.log('api/login', err);
            res.status(401);
            res.send('{\'message\':\'Invalid username or password\'}');
        }
        else {
            console.log('successfully executed query. Going for commit');
            tx.commit(function (err) {
				if (err)
				{
					 console.log('api/login', err);
					res.status(401);
					 res.send('{\'message\':\'Invalid username or password\'}');
				}
                else if (results[0].user.properties.password === credentials.password) {
                    let tokenObject = {
                        'userName': results[0].user.properties.userName,
                        'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJJc3N1ZXIiOiJodHRwOi8vd3d3Lnd5bnlhcmRncm91cC5jb20iLCJBdWRpZW5jZSI6IkFDQSIsIlByaW5jaXBhbCI6eyJTZXNzaW9uSWQiOiI3ZDZjN2ZjMC1lNzkzLTQyNjMtOTQ3OC01MmQzMmQyYzYzNjEiLCJVc2VyS2V5IjoiNCIsIlVzZXJOYW1lIjoia2NsaWZmZSIsIkNsYWltcyI6WyJBZG1pbiJdLCJMb2NhbGUiOiJlbi1OWiIsIlNlc3Npb25UaW1lT3V0IjoiXC9EYXRlKDE0NTA3OTQ1OTczNjIpXC8iLCJJc3N1ZWRUbyI6bnVsbCwiSWRlbnRpdHkiOnsiTmFtZSI6ImtjbGlmZmUiLCJBdXRoZW50aWNhdGlvblR5cGUiOiJXeW55YXJkIiwiSXNBdXRoZW50aWNhdGVkIjp0cnVlfX0sIkV4cGlyeSI6IlwvRGF0ZSgxKVwvIn0.0GZlnA-mdDQqSfSKvBlWsUehtVCRkNK8DA9siyeVLQ0'
                    };
                    res.status(201);
                    res.send(JSON.stringify(tokenObject));
                }
                else {
                    res.status(401);
                    res.send('{\'message\':\'Invalid username or password\'}');
                }
            });
        }
    });
	}
	else
	{
		res.status(401);
        res.send('{\'message\':\'Invalid username or password\'}');
	}
});
router.post('/api/v1/users', function (req, res) {
    let user = req.body;
	if ( checkforspecialcharacters(user.userName, user.firstName, user.lastName) && Number.isInteger(user.userId))
	{
    let tx = db.beginTransaction();
    let query = 'CREATE (user:User' + tosource(user) + ') RETURN user;';
    db.cypher(query, function (err) {
        if (err) {
            res.status(409);
            res.send();
        }
        else {
            console.log('successfully executed query. Going for commit');
            tx.commit(function (err) {
			if (err) {
            res.status(409);
            res.send();
			}
			else
			{
                res.status(201);
                res.send(JSON.stringify(user));
			}
            });
        }
    });
	}
	else
	{
		res.status(401);
        res.send('{\'message\':\'Invalid User, No special characters allowed\'}');
	}

});
let getUserQuery = (req) => {
    let query = 'MATCH (user: User) return user';
    if (req.query.sortBy) {
        query += ' ORDER BY user.' + req.query.sortBy;
    }
    if (req.query.sortDescending && req.query.sortDescending === 'true') {
        query += 'DESC';
    }
    if (req.query.page && req.query.page > 0) {
        query += ' SKIP ' + (req.query.page - 1) * req.query.pageSize;
    }
    if (req.query.pageSize) {
        query += ' LIMIT ' + req.query.pageSize;
    }
    return query;
};
router.get('/api/v1/users', function (req, res) {
    let tx = db.beginTransaction();
    db.cypher(getUserQuery(req), function (err, results) {
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
                res.send(JSON.stringify(_.map(results, 'user.properties')));
				}
            });
        }
    });
});

router.get('/api/v1/users/:user', function (req, res) {
	if (checkforspecialcharacters(req.params.user))
	{
    let query = 'MATCH (user:User {userName:\''+ req.params.user + '\'}) RETURN user;';
    let tx = db.beginTransaction();
    db.cypher(query, function (err, results) {
        if (err) {
            res.status(401);
            res.send();
        }
        else
		{
            console.log('successfully executed query. Going for commit');
            tx.commit(function (err) {
				 if (err) {
            res.status(409);
            res.send();
				}
				else if (results.length>0)
				{
                res.status(201);
                res.send(JSON.stringify(results[0].user.properties));
				}
				else
				{
					res.status(401);
                    res.send('{\'message\':\'User not Found\'}');
				}
            });
        }
    });
	}
	else
	{
		res.status(401);
        res.send('{\'message\':\'Invalid username\'}');
	}
});
router.delete('/api/v1/users/:user', function (req, res) {
	if (checkforspecialcharacters(req.params.user))
	{
    let query = 'MATCH (user:User {userName:\''+ req.params.user + '\'}) DELETE user;';
    let tx = db.beginTransaction();
    db.cypher(query, function (err) {
        if (err) {
            res.status(401);
            res.send('message: oops we need to start over again');
        }
        else {
            console.log('successfully executed query. Going for commit');
            tx.commit(function (err) {
				if (err) {
					res.status(401);
					res.send('message: oops we need to start over again');
				}
				else
				{
                res.status(204);
                res.send();
				}
            });
        }
    });
	}
	else
	{
		res.status(401);
        res.send('{\'message\':\'Invalid username\'}');
	}
});


//Products


router.post('/api/v1/products', function (req, res) {
    let product = req.body;
	if ( Number.isInteger(product.productId) && checkforspecialcharacters(product.name) )
	{
	let items=product.images;
	delete(product.images);
    let tx = db.beginTransaction();
    let query = 'CREATE (product:Product ' + tosource(product) + ') WITH product MATCH(i:Image) where i.imageId in '+ tosource(items) + ' Create(product)-[:hasImage]->(i)';
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
                res.send(JSON.stringify(product));
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
});
let getProductQuery = (req) => {
    let query = 'MATCH (product: Product) return product';
    if (req.query.sortBy) {
        query += ' ORDER BY product.' + req.query.sortBy;
    }
    if (req.query.sortDescending && req.query.sortDescending === 'true') {
        query += ' DESC';
    }
    if (req.query.page && req.query.page > 0) {
        query += ' SKIP ' + (req.query.page - 1) * req.query.pageSize;
    }
    if (req.query.pageSize) {
        query += ' LIMIT ' + req.query.pageSize;
    }
    return query;
};
router.get('/api/v1/products', function (req, res) {
    let tx = db.beginTransaction();
    db.cypher(getProductQuery(req), function (err, results) {
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
                res.send(JSON.stringify(_.map(results, 'product.properties')));
				}
            });
        }
    });
});

router.get('/api/v1/products/:product', function (req, res) {
	if (checkforspecialcharacters(req.params.product))
	{
	if (req.params.product !== 'popular')
	{
	let query = 'MATCH (product: Product {productId:\''+ req.params.product + '\'}) RETURN product;';
	console.log(query);
    let tx = db.beginTransaction();
    db.cypher(query, function (err, results) {
        if (err) {
            res.status(401);
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
               else if (results.length>0)
				{
                res.status(201);
                res.send(JSON.stringify(results[0].product.properties));
				}
				else
				{
					res.status(401);
                    res.send('{\'message\':\'Product not Found\'}');
				}
            });
        }
    });
	}
	else
	{
		let query = 'MATCH (product: Product {popular:true}) RETURN product;';
    let tx = db.beginTransaction();
    db.cypher(query, function (err, results) {
        if (err) {
            res.status(401);
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
               else if (results.length>0)
				{
                res.status(201);
                res.send(JSON.stringify(results[0].product.properties));
				}
				else
				{
					res.status(401);
                    res.send('{\'message\':\'No Popular Product Found\'}');
				}
            });
        }
    });
	}
	}
	else
	{
		res.status(401);
        res.send('{\'message\':\'Invalid Request\'}');
	}
});


router.delete('/api/v1/products/:product', function (req, res) {
    let query = 'MATCH (product: Product {productId:\''+ req.params.product + '\'}) DETACH DELETE product;';
    let tx = db.beginTransaction();
    db.cypher(query, function (err) {
        if (err) {
            res.status(401);
            res.send('message: oops we need to start over again');
        }
        else {
            console.log('successfully executed query. Going for commit');
            tx.commit(function (err) {
				if (err) {
					res.status(401);
					res.send('message: oops we need to start over again');
				}
				else
				{
                res.status(204);
                res.send();
				}
            });
        }
    });
});


//Images


router.post('/api/v1/images', function (req, res) {
    let image = req.body;
	if (Number.isInteger(image.imageId) && Number.isInteger(image.productId))
	{
    let tx = db.beginTransaction();
    let query = 'CREATE (image:Image ' + tosource(image) + ') RETURN image;';
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
					res.send(JSON.stringify(image));
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

});
let getImageQuery = (req) => {
    let query = 'MATCH (image: Image) return image';
    if (req.query.sortBy) {
        query += ' ORDER BY image.' + req.query.sortBy;
    }
    if (req.query.sortDescending && req.query.sortDescending === 'true') {
        query += ' DESC';
    }
    if (req.query.page && req.query.page > 0) {
        query += ' SKIP ' + (req.query.page - 1) * req.query.pageSize;
    }
    if (req.query.pageSize) {
        query += ' LIMIT ' + req.query.pageSize;
    }
    return query;
};
router.get('/api/v1/images', function (req, res) {
    let tx = db.beginTransaction();
    db.cypher(getImageQuery(req), function (err, results) {
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
					res.send(JSON.stringify(_.map(results, 'image.properties')));
				}
            });
        }
    });
});

router.get('/api/v1/images/:image', function (req, res) {
	if (Number.isInteger(req.params.image))
	{
    let query = 'MATCH (image: Image {imageId:\'' + req.params.image + '\'}) RETURN image;';
    let tx = db.beginTransaction();
    db.cypher(query, function (err, results) {
        if (err) {
            res.status(401);
            res.send();
        }
        else {
            console.log('successfully executed query. Going for commit');
            tx.commit(function (err) {
			if (err)
			{
            res.status(401);
            res.send();
			}
             else if (results.length>0)
				{
                res.status(201);
                res.send(JSON.stringify(results[0].image.properties));
				}
				else
				{
					res.status(401);
                    res.send('{\'message\':\'Image not Found\'}');
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
});
router.delete('/api/v1/images/:image', function (req, res) {
    let query = 'MATCH (image: Image {imageId:\'' + req.params.image + '\'}) DETACH DELETE image;';
    let tx = db.beginTransaction();
    db.cypher(query, function (err) {
        if (err) {
            res.status(401);
            res.send('message: oops we need to start over again');
        }
        else {
            console.log('successfully executed query. Going for commit');
            tx.commit(function (err) {
				if (err)
				{
					res.status(401);
					res.send();
				}
				else
				{
                res.status(204);
                res.send();
				}
            });
        }
    });
});

//OrderItems


let getOrderItemsQuery = (req) => {
    let query = 'MATCH (orderitems: OrderItems) return orderitems';
    if (req.query.sortBy) {
        query += ' ORDER BY orderitems.' + req.query.sortBy;
    }
    if (req.query.sortDescending && req.query.sortDescending === 'true') {
        query += ' DESC';
    }
    if (req.query.page && req.query.page > 0) {
        query += ' SKIP ' + (req.query.page - 1) * req.query.pageSize;
    }
    if (req.query.pageSize) {
        query += ' LIMIT ' + req.query.pageSize;
    }
    return query;
};
router.get('/api/v1/order-items', function (req, res) {
    let tx = db.beginTransaction();
    db.cypher(getOrderItemsQuery(req), function (err, results) {
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
                res.send(JSON.stringify(_.map(results, 'orderitems.properties')));
				}
            });
        }
    });
});

router.get('/api/v1/order-items/:orderitems', function (req, res) {
	if (checkforspecialcharacters(req.params.orderitems))
	{
	let query = 'MATCH (orderitems: OrderItem orderItemId:\'' + req.params.orderitems + '\'}) RETURN orderitems;';
	console.log(query);
    let tx = db.beginTransaction();
    db.cypher(query, function (err, results) {
        if (err) {
            res.status(401);
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
               else if (results.length>0)
				{
                res.status(201);
                res.send(JSON.stringify(results[0].orderitems.properties));
				}
				else
				{
					res.status(401);
                    res.send('{\'message\':\'Order Item not Found\'}');
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
});


router.delete('/api/v1/order-items/:orderitems', function (req, res) {
    let query = 'MATCH (orderitems: OrderItem orderItemId:\'' + req.params.orderitems + '\'}) DETACH DELETE orderitems;';
    let tx = db.beginTransaction();
    db.cypher(query, function (err) {
        if (err) {
            res.status(401);
            res.send('message: oops we need to start over again');
        }
        else {
            console.log('successfully executed query. Going for commit');
            tx.commit(function (err) {
				if (err) {
					res.status(401);
					res.send('message: oops we need to start over again');
				}
				else
				{
                res.status(204);
                res.send();
				}
            });
        }
    });
});


//Orders

router.post('/api/v1/orders/current/add-item', function (req, res) {
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
});
let getOrdersQuery = (req) => {
    let query = 'MATCH (orders: Orders) return orders';
    if (req.query.sortBy) {
        query += ' ORDER BY orders.' + req.query.sortBy;
    }
    if (req.query.sortDescending && req.query.sortDescending === 'true') {
        query += ' DESC';
    }
    if (req.query.page && req.query.page > 0) {
        query += ' SKIP ' + (req.query.page - 1) * req.query.pageSize;
    }
    if (req.query.pageSize) {
        query += ' LIMIT ' + req.query.pageSize;
    }
    return query;
};
router.get('/api/v1/orders', function (req, res) {
    let tx = db.beginTransaction();
    db.cypher(getOrdersQuery(req), function (err, results) {
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
                res.send(JSON.stringify(_.map(results, 'orders.properties')));
				}
            });
        }
    });
});

router.get('/api/v1/orders/:orders', function (req, res) {
	if (checkforspecialcharacters(req.params.orders))
	{
	let query = 'MATCH (orders: Orders {orderId: \'' + req.params.orders + '\'}) RETURN orders;';
	console.log(query);
    let tx = db.beginTransaction();
    db.cypher(query, function (err, results) {
        if (err) {
            res.status(401);
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
               else if (results.length>0)
				{
                res.status(201);
                res.send(JSON.stringify(results[0].orders.properties));
				}
				else
				{
					res.status(401);
                    res.send('{\'message\':\'Order not Found\'}');
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
});


router.delete('/api/v1/orders/:orders', function (req, res) {
    let query = 'MATCH (orders: Orders {orderId: \'' + req.params.orders + '\'}) DETACH DELETE orders;';
    let tx = db.beginTransaction();
    db.cypher(query, function (err) {
        if (err) {
            res.status(401);
            res.send('message: oops we need to start over again');
        }
        else {
            console.log('successfully executed query. Going for commit');
            tx.commit(function (err) {
				if (err) {
					res.status(401);
					res.send('message: oops we need to start over again');
				}
				else
				{
                res.status(204);
                res.send();
				}
            });
        }
    });
});


function checkforspecialcharacters(...vals)
{
	for (let name of vals)
	{
		if (specialCharactersRegEx.test(name))
		{
			return false;
		}
	}
	return true;
}
/*function checkfornumber(...vals)
{
	console.log('number of arguments: ',vals.length);
	for(var name of vals)
	{
		if(Number.isInteger(name))
		{
			return true;
		}
	}
	return false;
}*/
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
