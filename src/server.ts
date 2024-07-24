import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { userRoutes } from './routes/users'

const app = fastify()
// configurando o servidor para aceitar cookies
app.register(cookie)

// configurando plugin de rotas
app.register(userRoutes, {
  prefix: 'users',
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running ✔')
  })
