const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const cors           = require('cors')
const app            = express();

const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  'origin': ['http://hasbisevinc.com', 'http://www.hasbisevinc.com']
}));

require('./app/routes')(app, {});
app.listen(port, () => {
  console.log('We are live on ' + port);
});