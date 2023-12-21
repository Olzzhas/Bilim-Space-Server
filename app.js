const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const router = require('./router');
const errorMiddleware = require('./middlewares/error-middleware');

const app = new express();

app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);

app.use(errorMiddleware); // must be last middleware

mongoose.set('strictQuery', false);

const start = async () => {
  try {
    await mongoose
      .connect(
        'mongodb+srv://olzzhas:bilimspace040104@bilimspace.erm98zk.mongodb.net/?retryWrites=true&w=majority',
      )
      .then(() => {
        console.log('Mongo connected...');
      });

    await app.listen(5000, (err) => {
      if (err != null) {
        console.log(err);
      } else {
        console.log(`Server started on port 5000...`);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

start();
