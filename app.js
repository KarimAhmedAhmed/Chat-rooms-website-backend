const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const settings = require('./config/settings');
const http = require('http');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const socketio = require('socket.io');
const express = require('express');
const app = express();
const cors = require('cors')
app.use(cors());

const server = http.createServer(app);


const io = socketio(server, {
  cors: {
    origin: "*",
    rejectUnauthorized: false,
    credentials: false
  }
});


const mysocket = require('./socket/socket');

const PORT = process.env.PORT || 1000;
const connectDB = require('./config/db')


const errorHandler = require('./middleware/error');



const { addUser, removeUser, getUser, getUsersInRoom } = require('./socket/users');




// database
connectDB()








// middleware

settings(app, express)

//io logic
mysocket(io);



// define apps

app.use('/', require('./routes/index'));
app.use('/chat', require('./routes/chat'));
app.use('/account', require('./routes/account'));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
// custom error handler middleware
app.use(errorHandler);

// const server =
module.exports = server.listen(PORT, () => console.log(`server running in ${process.env.NODE_ENV} on port ${PORT}`))
// process.on("unhandledRejection", (err,promise) =>{
//     console.log(`logged Error: ${err}`)
//     server.close(() => process.exit(1))
// })