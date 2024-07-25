import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../env'

export async function checkTokenExists(
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
  // verificando se o token vale
  try {
    jwt.verify(token, env.JWT_SECRET)
  } catch (error) {
    return reply.status(403).send({ error: 'Forbidden' })
  }
}
