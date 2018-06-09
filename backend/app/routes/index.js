var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const url = "MONGODB_URL";
const DB_NAME = "deneme7"
const SETTINGS = "user"
const COLLECTION = "tablo"
const ITEM_COUNT_PER_REQUEST = 10
const hex = new RegExp("^[0-9a-fA-F]{24}$");

module.exports = function(app, db) {
  var returnError = function(msg) {
    return JSON.parse('{"error": true, "message": "'+msg+'"}');
  }

  var returnSuccess = function(msg) {
    return JSON.parse('{"success": true, "message": "'+msg+'"}');
  }

  var checkId = function(itemId) {
    return hex.test(itemId)
  }

  var getIdForDB = function(itemId) {
    return ObjectId(itemId);
  }

  var adminApiKey = "";

  var getApiKey = function() {
    if (adminApiKey == undefined || adminApiKey.length < 1) {
      initApiKey();
      return "";
    }
    return adminApiKey;
  }

  var initApiKey = function() {
    console.log("initApiKey")
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(DB_NAME);
      var query = {};
      dbo.collection(SETTINGS).findOne(query, function(err, result) {
        if (err) throw err;
        if (result == undefined || result.length < 1) {
          console.log("init fail")
          return;
        }
        adminApiKey = result.apiKey;
        db.close();
        return;
      });
      
    });
  }

  initApiKey();

  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 16; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  

  var fti = function() {
    console.log("fti")
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(DB_NAME);
      data = {
        username: "admin",
        password: "admin",
        apiKey: makeid()
      }
      dbo.collection(SETTINGS).insert(data, (err, result) => {
        if (err) { 
          console.log("An error has occurred");
        } else {
          initApiKey();
          console.log("fti completed");
        }
      });
    });
  }

  app.get('/item/:id', (req, res) => {
    var itemId = req.params.id;
    if (checkId(itemId) == false) {
      res.send(returnError("invalid id"));
      return;
    }
    itemId = getIdForDB(itemId);
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(DB_NAME);
      var query = { _id: itemId };
      dbo.collection(COLLECTION).findOne(query, function(err, result) {
        if (err) throw err;
        res.send(result)
        db.close();
        return;
      });
      
    });
  });

  app.get('/lastest/', (req, res) => {
    var startFrom = req.query.startFrom;
    if (startFrom < 0 || isNaN(startFrom)) {
      startFrom = 0;
    }
    startFrom = Number(startFrom);
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(DB_NAME);
      dbo.collection(COLLECTION).find().sort({date:-1}).skip(startFrom).limit(ITEM_COUNT_PER_REQUEST).toArray(function(err, result) {
        if (err) throw err;
        if (result == undefined || result.length == 0) {
          dbo.collection(SETTINGS).find().toArray(function(err, result) {
            if (err) throw err;
            if (result == undefined || result.length == 0) {
              //FTI
              fti();
            }
            db.close();
          });
        }
        res.send(result)
        db.close();
      });
    });
  });

  app.post('/login', (req, res) => {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(DB_NAME);
      var query = { 
        username: req.body.username, 
        password: req.body.password 
      };
      dbo.collection(SETTINGS).findOne(query, function(err, result) {
        if (err) throw err;
        if (result == undefined || result.length < 1) {
          res.send(returnError("username or password wrong"));
        } else {
          var apiKey = result.apiKey;
          if (apiKey == undefined || apiKey.length < 1) {
            res.send(returnError("username or password wrong"));
          } else {
            res.send("{\"success\": true, \"apiKey\": \""+apiKey+"\"}")
          }
        }
        db.close();
        return;
      });
    });
  });

  app.post('/allItems', (req, res) => {
    if (req.body.apiKey !== getApiKey()) {
      res.send(returnError("permission denied"));
      return;
    }
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(DB_NAME);
      dbo.collection(COLLECTION).find().sort({date:-1}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result)
        db.close();
      });
    });
  });

  app.post('/add', (req, res) => {
    if (req.body.apiKey !== getApiKey()) {
      res.send(returnError("permission denied"));
      return;
    }
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(DB_NAME);
      dbo.collection(COLLECTION).insert(req.body, (err, result) => {
        if (err) { 
          res.send(returnError("An error has occurred"));
        } else {
          res.send(result.ops[0]);
        }
      });
    });
  });

  app.post('/update', (req, res) => {
    if (req.body.apiKey !== getApiKey()) {
      res.send(returnError("permission denied"));
      return;
    }
    if (checkId(itemId) == false) {
      res.send(returnError("invalid id"));
      return;
    }
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      itemId = getIdForDB(req.body.id)
      var dbo = db.db(DB_NAME);
      dbo.collection(COLLECTION).updateOne({_id: itemId}, req.body, (err, result) => {
        if (err) { 
          res.send(returnError("An error has occurred"));
        } else {
          result = JSON.parse(result);
          if (result.ok != 1) {
            res.send(returnError("unknown error"));
            return;
          }
          if (1 != result.nModified && 1 != result.nModified) {
            res.send(returnError("not found"));
          }
          else {
            res.send(returnSuccess("success"));
          }
        }
      });
    });
  });



  app.post('/saveSettings', (req, res) => {
    if (req.body.apiKey !== getApiKey()) {
      res.send(returnError("permission denied"));
      return;
    }
    
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(DB_NAME);
      data = {
        username: req.body.username,
        password: req.body.password,
        apiKey: req.body.apiKey
      }
      dbo.collection(SETTINGS).updateOne({password: req.body.oldPassword}, data, (err, result) => {
        if (err) { 
          res.send(returnError("An error has occurred"));
        } else {
          result = JSON.parse(result);
          if (result.ok != 1) {
            res.send(returnError("unknown error"));
            return;
          }
          if (1 != result.nModified && 1 != result.nModified) {
            res.send(returnError("not found"));
          }
          else {
            res.send(returnSuccess("success"));
          }
        }
      });
    });
  });

  app.post('/remove', (req, res) => {
    if (req.body.apiKey !== getApiKey()) {
      res.send(returnError("permission denied"));
      return;
    }
    if (checkId(req.body._id) == false) {
      res.send(returnError("invalid id"));
      return;
    }
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      itemId = getIdForDB(req.body._id)
      var dbo = db.db(DB_NAME);
      dbo.collection(COLLECTION).deleteOne({_id: itemId}, (err, result) => {
        if (err) { 
          res.send(returnError("An error has occurred"));
        } else {
          result = JSON.parse(result);
          if (result.ok != 1) {
            res.send(returnError("unknown error"));
            return;
          }
          if (1 != result.n) {
            res.send(returnError("not found"));
          }
          else {
            res.send(returnSuccess("success"));
          }
        }
      });
    });
  });
};