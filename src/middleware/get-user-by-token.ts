import { FastifyReply, FastifyRequest } from 'fastify'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { env } from '../env'
import { knex } from '../database'

interface MyJwtPayload extends JwtPayload {
  userId: string
}

export async function getUserByToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // pegando o cabecalho da requisicao
  const authHeader = request.headers.authorization
  // pegando o token que veio dos headers
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    // retornando erro caso nao tenha vindo algum token
    return reply.status(401).send({ error: 'Unauthorized' })
  }
  // pegando os dados do token
  const decoded = jwt.verify(token, env.JWT_SECRET) as MyJwtPayload
  // pegando o id do usuário
  const userId = decoded.userId
  // pegando no banco de dados o usuárop
  const user = await knex('users').where('id', userId).first()
  return user
}
