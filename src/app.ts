import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { userRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'

export const app = fastify()
// configurando o servidor para aceitar cookies
app.register(cookie)

// configurando plugin de rotas
app.register(userRoutes, {
  prefix: 'users',
})
app.register(mealsRoutes, {
  prefix: 'meals',
})
