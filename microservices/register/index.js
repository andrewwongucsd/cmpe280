const { send } = require('micro');
const { router, post, get, del } = require('microrouter');
const mongoClient = require('mongodb').MongoClient;
const mongodb_url = "mongodb://localhost:27017/"
const database_name = "caliair";
const table_name = "customers1";
var return_status_code = 200;
var return_status_msg = "Success";

module.exports = router(
  post('/:username/:password', async (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      var username = req.params.username;
      var password = req.params.password;
      username = username.trim().toUpperCase();
      password = password.trim();
      console.log(username);
      console.log(password);
      if(username.length == 0 || password.length == 0){
        send(res, 400, {response_status: "Bad"});
        return;
      }
      const db = await mongoClient.connect(mongodb_url);
      const dbo = db.db(database_name);
      const MyCollection = dbo.collection(table_name);
      var result;
      const insert_json = {_id: username, username: username, password: password};
      try {
        result = await MyCollection.insertOne();
      }catch(err) {
        send(res, 400, {response_status: "Bad", reason: "duplicated user"});
        return;
      }
      db.close();
      var return_json = {response_status: "Success", data: insert_json};
      send(res, 200, return_json);
  }), get('/:username', async (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const username = req.params.username.trim();
      const db = await mongoClient.connect(mongodb_url);
      const dbo = db.db(database_name);
      const MyCollection = dbo.collection(table_name);
      const result = await MyCollection.find({_id: username}).toArray();
      console.log(result);
      db.close();
      send(res, 200, {response_status: "Success", data: result});
    }
  ), get('/', async (req, res, next) => {
      const db = await mongoClient.connect(mongodb_url);
      const dbo = db.db(database_name);
      const MyCollection = dbo.collection(table_name);
      const result = await MyCollection.find({}).toArray();
      console.log(result);
      db.close();
      send(res, 200, {response_status: "Success", data: result});
    }
  ), del('/:username/:date', async (req, res, next) => {
      var username = req.params.username.trim().toUpperCase();
      var date = req.params.date.trim().toUpperCase();
      console.log(username);
      const db = await mongoClient.connect(mongodb_url);
      const dbo = db.db(database_name);
      const MyCollection = dbo.collection(table_name);
      const result = await MyCollection.findOne({_id: username});
      console.log(result);
      delete result.activities[date];
      delete result._id;
      console.log(result);
      await MyCollection.updateOne({_id: username}, {$set: result} , { upsert: true});
      db.close();
      res.setHeader('Access-Control-Allow-Origin', '*');
      send(res, 200, {response_status: "Success", data: result});
    }
  ), del('/:username', async (req, res, next) => {
      var username = req.params.username.trim().toUpperCase();
      const db = await mongoClient.connect(mongodb_url);
      const dbo = db.db(database_name);
      const MyCollection = dbo.collection(table_name);
      const result = await MyCollection.findOne({_id: username});
      console.log(result);
      delete result.activities;
      delete result._id;
      console.log(result);
      await MyCollection.updateOne({_id: username}, {$set: result} , { upsert: true});
      db.close();
      res.setHeader('Access-Control-Allow-Origin', '*');
      send(res, 200, {response_status: "Success", data: result});
    }
  )
);
