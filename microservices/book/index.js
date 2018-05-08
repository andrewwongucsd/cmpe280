
const { send } = require('micro')
const { router, post, get } = require('microrouter')
const mongoClient = require('mongodb').MongoClient;
const mongodb_url = "mongodb://localhost:27017/"
const database_name = "caliair";
// const booking_table = "booking";
const flights_table = "flights";
const customers_table = "customers1";
var return_status_code = 200;
var return_status_msg = "Success";

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < 7; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}


module.exports = router(
  post('/:username/:flight_id/:departure_date', async (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');

      var username = req.params.username;
      var flight_id = req.params.flight_id;
      var departure_date = req.params.departure_date;
      username = username.trim().toUpperCase();
      flight_id = flight_id.trim().toUpperCase();
      departure_date = departure_date.trim().toUpperCase();

      if(username.length == 0 || flight_id.length == 0 || departure_date.length == 0){
        send(res, 400, {response_status: "Bad"});
        return;
      }
      const db = await mongoClient.connect(mongodb_url);
      const dbo = db.db(database_name);
      const flights_collection = dbo.collection(flights_table);
      const flights_query = {_id: flight_id, date: departure_date};
      const flights_result = await flights_collection.findOne(flights_query);
      // delete flights_result._id;

      const customers_collection = dbo.collection(customers_table);
      const customers_query = {_id: username};
      const customers_result = await customers_collection.findOne(customers_query);


      if(flights_result.length == 0 || customers_result.length == 0){
        send(res, 400, {response_status: "Bad"});
        return;
      }

      if(!flights_result.hasOwnProperty('passenger_id')){
        flights_result.passenger_id = {};
      }
      if(flights_result.passenger_id[username]){
        send(res, 400, {response_status: "Bad", reason: "The username has already purchased a ticket."});
        return;
      }

      if(!flights_result.hasOwnProperty('capacity')){
        flights_result.capacity = 150;
      }
      flights_result.capacity = flights_result.capacity - 1;

      if(!flights_result.hasOwnProperty('passenger_id')){
        flights_result.passenger_id = {};
      }
      flights_result.passenger_id[username] = makeid();


      await flights_collection.updateOne({_id: flight_id}, {$set: flights_result} , { upsert: true});

      if(!customers_result.hasOwnProperty('activities')){
        customers_result.activities = {};
      }
      if(!customers_result.activities.hasOwnProperty(departure_date)){
        // customers_result.activities[departure_date] = [];
        customers_result.activities[departure_date] = [];
      }
      // customers_result.activities[departure_date].push(flight_id);
      customers_result.activities[departure_date].push({
        flight_id: flights_result._id,
        from: flights_result.from,
        to: flights_result.to,
        date: flights_result.date,
        time: flights_result.time,
        confirmation: flights_result.passenger_id[username]
      })
      console.log(customers_result);

      await customers_collection.updateOne({_id: username}, {$set: customers_result}, { upsert: true});

      db.close();

      send(res, 200, {response_status: "Success", flights_data: flights_result, customers_data: customers_result});
  }),get('/random', async (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');

      send(res, 200, {response_status: "Success", confirmation: makeid()});
    }
  ), get('/', async (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const db = await mongoClient.connect(mongodb_url);
      const dbo = db.db(database_name);
      const flights_collection = dbo.collection(flights_table);
      const flights_result = await flights_collection.find({}).toArray();
      const customsers_collection = dbo.collection(customers_table);
      const customsers_result = await customsers_collection.find({}).toArray();
      db.close();
      send(res, 200, {response_status: "Success", flights_data: flights_result, customsers_data: customsers_result});
    }
  )
);
