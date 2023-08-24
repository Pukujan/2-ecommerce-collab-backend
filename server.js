//imports
require('dotenv').config()


const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan');


const userRoutes = require('./routes/userRoutes')

// express app 
const app = express()

//other use
app.use(morgan('dev'));

//global middlewares
//next is used to goto next middleware, in this case to get
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

//Routes
app.use(userRoutes);


//connect to mongodb
mongoose.connect(process.env.MONGO_URI)

  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db and listening on port', process.env.PORT)
    })
  })

  .catch((error) => {
    console.log(error)
  })
