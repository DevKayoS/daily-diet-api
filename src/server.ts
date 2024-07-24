import fastify from 'fastify'
import { userRoutes } from './routes/users'

const app = fastify()

app.register(userRoutes, {
  prefix: 'users'
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running ✔')
  })
