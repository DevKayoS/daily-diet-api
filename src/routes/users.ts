import { FastifyInstance } from 'fastify'

export async function userRoutes(app: FastifyInstance) {
  // criando primeira rota
  app.get('/', async () => {
    return 'hello'
  })
}
