const createError = require('http-errors');
const express = require("express");
const cors = require("cors");
const session = require("express-session");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');
const fileUpload = require('express-fileupload');
/*
  DB connect position
*/
const connect = () =>{
  if(process.env.BODE_ENV !== "production"){
    mongoose.set("debug",true);
  }
  mongoose.connect('mongodb://54.180.89.24:27017/fomdb', {
      dbName: "fomdb",
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    error => {
      if (error){
        console.log("mongoDB connection error!\n",error);
      }
      else{
        console.log("mongoDB connection success!");
      }
    }
  );
  mongooseAutoInc.initialize(mongoose.connection);
};

connect();
mongoose.connection.on("error",error => {
  console.log("mongoDB connection error!\n",error);
});
mongoose.connection.on("disconnected",() =>{
  console.log("mongoDB disconnection, try again connection ");
  connect();
});



var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var postRouter = require('./routes/post');
var commentRouter = require('./routes/comment');

const app = express();

const corsOptions = { //다른 기원이라도 서버 접속 가능
  origin: true,
  credentials: true
};
app.use(fileUpload());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "sj",
    cookie: {
      httpOnly: true, //https not 
      secure: false // not secure
    }
  })
  
)

app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json()); //json data 사용 선언
app.use(express.urlencoded({extended: true})); //front에서 배열 데이터 잘 받아올 수 있음
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/post',postRouter);
app.use('/user',userRouter);
app.use('/comment',commentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}); 

app.listen(8080,()=>{
  console.log("listen server");
});

module.exports = app;
