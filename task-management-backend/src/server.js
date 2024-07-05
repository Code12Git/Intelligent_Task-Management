const express = require('express');
const logger = require('./utils/logger');
const { Server } = require('socket.io');
const { createServer } = require('http');
const connection=require('./config/db')
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");
const authRoute = require('./routes/authRoute')
const taskRoute = require('./routes/taskRoute')
const cors = require('cors');
const { fromEnv } = require('./utils')
const app = express();
const server = createServer(app);


const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const clerkOptions = {
  secretKey: fromEnv('CLERK_SECRET_KEY'),
  debug: true,
};

const PORT = fromEnv('APP_PORT') || 3000;
connection()
app.use(express.json());
app.use(cors());
app.use(ClerkExpressWithAuth(clerkOptions));
app.use('/api/auth', authRoute)
app.use('/api/task', taskRoute)


// app.use('/api/task',taskRoute)
app.use((req, res, next) => {
    logger.info({
        method: req.method,
        url: req.url,
        headers: req.headers,
    });
    next();
});


io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    console.log("Id", socket.id);
    socket.emit('welcome', 'Welcome to the WebSocket server!');
    socket.on('message',(data)=>{
      console.log(data)
})

});

app.get("/protected-endpoint", (req, res) => {
  res.json(req.auth);
});



server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
