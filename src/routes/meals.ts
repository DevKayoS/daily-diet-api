import { FastifyInstance } from 'fastify'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async () => {
    return 'hello'
  })
}
