import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { knex } from '../database'

import bcrypt from 'bcrypt'
import { env } from '../env'

const jwtToken = env.JWT_SECRET

export async function userRoutes(app: FastifyInstance) {
  // criando usuario
  app.post('/', async (request, reply) => {
    // criando validacao com zod
    const createUserSchema = z.object({
      name: z.string(),
      lastname: z.string(),
      email: z.string().email(),
      password: z.string(),
    })

    const { name, lastname, email, password } = createUserSchema.parse(
      request.body,
    )

    const user = await knex('users').where({ email })

    if (user) {
      return reply.status(404).send({ message: 'This account already existis' })
    }
    // criando senha criptografada
    const salt = await bcrypt.genSalt(8)
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = {
      id: randomUUID(),
      name,
      lastname,
      email,
      password: passwordHash,
    }

    // adicionando o usuário no banco de dados
    await knex('users').insert(newUser)

    const token = jwt.sign({ userId: newUser.id }, jwtToken, {
      expiresIn: '7d',
    })

    return reply.status(201).send({ token })
  })

  // rota para login
  app.post('/login', async (request, reply) => {
    // criando schema de validacao do login
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })
    // pegando os dados da requisicao e validando
    const { email, password } = loginSchema.parse(request.body)

    // resgatando usuario do banco de dados
    const user = await knex('users').where({ email }).first()

    // checando se a senha esta correta
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
      return reply.status(422).send({ message: 'Password is invalid' })
    }

    // verificando se o usuario existe
    if (!user) {
      return reply.status(404).send({ message: 'User not found' })
    }

    // criando token
    const token = jwt.sign({ userId: user.id }, jwtToken, {
      expiresIn: '7d',
    })

    return reply.status(200).send({ token })
  })
}
