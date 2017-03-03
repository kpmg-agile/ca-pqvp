const Router = require('express').Router;
const router = new Router();
const neo4j = require('neo4j');
const fs = require('fs');
const path = require('path');
const dbconnection = JSON.parse(fs.readFileSync('config/.dbconfig', 'utf8'));
const db = new neo4j.GraphDatabase('http://' + dbconnection.dbaccount + ':' + dbconnection.dbpassword + '@' + dbconnection.dblocation);

// TODO integrate with API at /api/v1/images/upload
router.post('/api/v1/uploadImage', function (req, res) {
    if (!req.files) {
        res.status(400).send('{"error": "No files were uploaded."}');
    } else {
        let file = req.files.attachFile;
        let params = {
            ext: path.extname(file.name)
        };
        let query = `create (i:Image)
                        with i
                        set i.imageId = ID(i)
                        set i.imageURL = "image-" + ID(i) + {ext}
                        return i`;
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
                        res.json({status: 409, send: '{}'});
                    }
                    else {
                        let fileEntity = results[0].i.properties;
                        file.mv('./client/img/products/' + fileEntity.imageURL, function (err) {
                            if (err) {
                                res.status(500).send(err);
                            }
                            fileEntity.imageURL = 'img/products/' + fileEntity.imageURL;
                            res.json(fileEntity);
                        });
                    }
                });
            }
        });
    }
});

module.exports = router;
