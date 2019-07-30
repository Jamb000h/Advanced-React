require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer')

const db = require('./db')

const server = createServer()

// TODO User express middleware to handle cookies
// TODO User express middleware to populate current user

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  }
}, deets => {
  console.log(`Server is now running in port http://localhost:${deets.port}`)
})