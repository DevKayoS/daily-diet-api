import { FastifyInstance } from 'fastify'
import { checkTokenExists } from '../middleware/check-token-exists'

export async function mealsRoutes(app: FastifyInstance) {
  // verificando se existe um token
  app.addHook('preHandler', checkTokenExists)
  app.get('/', async () => {
    return 'hello'
  })
}
