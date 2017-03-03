const Router = require('express').Router;
const router = new Router();
const neo4j = require('neo4j');
const fs = require('fs');
const path = require('path');
const dbconnection = JSON.parse(fs.readFileSync('config/.dbconfig', 'utf8'));
const tosource = require('tosource');
const db = new neo4j.GraphDatabase('http://' + dbconnection.dbaccount + ':' + dbconnection.dbpassword + '@' + dbconnection.dblocation);

// TODO integrate with API at /api/v1/images/upload
router.post('/upload', function (req, res) {

    console.log('POST /upload', req.query);

    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }
    let file = req.files.attachFile;
    let params = {productId: parseInt(req.query.productId)};

    let query = 'match (p:Product { productId: {productId} }) \
                    create (p)-[:hasImage]->(i:Image) \
                    with i,p \
                    set i.imageId = ID(i) \
                    set i.imageURL = "image-" + ID(i) + ".png" \
                    return i,p';
    let tx = db.beginTransaction();
    db.cypher({query, params}, function callback(err, results) {
        if (err) {
            console.log(query);
            console.log(err);
            res.json({ status: 409, send: '{}' });
        }
        else {
            console.log('successfully executed query. Going for commit and file save');
            tx.commit(function (err) {
                if (err) {
                    return res.json({status: 409, send: '{}'});
                }
                else {
                    console.log(results);
                    let fileEntity = results[0].i.properties;
                    file.mv('./client/img/products/' + fileEntity.imageURL, function (err) {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        fileEntity.imageURL = 'img/products/' + fileEntity.imageURL;
                        return res.json(fileEntity);
                    });
                }
            });
        }
    });
});

module.exports = router;
