/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { checkTokenExists } from '../middleware/check-token-exists'
import { z } from 'zod'
import { getUserByToken } from '../middleware/get-user-by-token'
import { randomUUID } from 'crypto'
import { knex } from '../database'
import { request } from 'http'

export async function mealsRoutes(app: FastifyInstance) {
  // verificando se existe um token
  app.addHook('preHandler', checkTokenExists)
  app.post('/', async (request, reply) => {
    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      date_time: z.string(),
      enter_diet: z.boolean(),
    })
    const { name, description, date_time, enter_diet } = createMealSchema.parse(
      request.body,
    )
    if (!name || !description || !date_time || !enter_diet) {
      return reply.status(404).send({ message: 'have components missing' })
    }
    const user = await getUserByToken(request, reply)
    // inserindo no banco de dados a nova refeição
    await knex('meals').insert({
      id: randomUUID(),
      user_id: user.id,
      name,
      description,
      date_time,
      enter_diet,
    })

    return reply.status(201).send({ message: 'Refeição adicionada' })
  })

  // atualizando dados da refeição por id
  app.put('/:id', async (request, reply) => {
    const updateMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      date_time: z.string(),
      enter_diet: z.boolean(),
    })
    const id = request.params

    const { name, description, date_time, enter_diet } = updateMealSchema.parse(
      request.body,
    )
    if (!name || !description || !date_time || !enter_diet) {
      return reply.status(404).send({ message: 'have components missing' })
    }

    const meal = await knex('meals').where('id', id)

    if (!meal) {
      return reply.status(404).send({ message: 'meal not found' })
    }
    console.log(meal)
  })
}
