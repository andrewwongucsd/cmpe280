const { send } = require('micro')
const { router, post, get } = require('microrouter')
const mongoClient = require('mongodb').MongoClient;
const mongodb_url = "mongodb://localhost:27017/"
const database_name = "caliair";
const table_name = "flights";
var return_status_code = 200;
var return_status_msg = "Success";

module.exports = router(
  get('/:from/:to/:date', async (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');

      var from = req.params.from.trim().toUpperCase();
      var to = req.params.to.trim().toUpperCase();
      var date = req.params.date.trim();
      console.log(from);
      console.log(to);
      console.log(date);
      if(from.length == 0 || to.length == 0 || date.length == 0){
        send(res, 400, {response_status: "Bad"});
        return;
      }
      const db = await mongoClient.connect(mongodb_url);
      const dbo = db.db(database_name);
      const MyCollection = dbo.collection(table_name);
      const query = {from: from, to: to, date: date};
      const result = await MyCollection.find(query).toArray();
      console.log(query);
      db.close();
      console.log(result);

      send(res, 200, {response_status: "Success", data: result});
  }),get('/', async (req, res, next) => {
      const db = await mongoClient.connect(mongodb_url);
      const dbo = db.db(database_name);
      const MyCollection = dbo.collection(table_name);
      const result = await MyCollection.find({}).toArray();
      db.close();
      send(res, 200, {response_status: "Success", data: result});
    }
  )
);
