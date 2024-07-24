import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import bcrypt from 'bcrypt'

export async function userRoutes(app: FastifyInstance) {
  // criando usuario
  app.post('/', async (request, reply) => {
    // criando validacao com zod
    const createUserSchema = z.object({
      name: z.string(),
      lastname: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, lastname, email, password } = createUserSchema.parse(
      request.body,
    )

    // criando o cookie
    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      })
    }
    // criando senha criptografada
    const salt = await bcrypt.genSalt(8)
    const passwordHash = await bcrypt.hash(password, salt)

    // adicionando o usuário no banco de dados
    await knex('users').insert({
      id: randomUUID(),
      name,
      lastname,
      email,
      password: passwordHash,
    })
    return reply.status(201).send(`${name} ${lastname} criado`)
  })
}
