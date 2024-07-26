/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { checkTokenExists } from '../middleware/check-token-exists'
import { z } from 'zod'
import { getUserByToken } from '../middleware/get-user-by-token'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { getRoutesParams } from '../utils/get-routes-params'

export async function mealsRoutes(app: FastifyInstance) {
  // verificando se existe um token
  app.addHook('preHandler', checkTokenExists)
  // criando nova refeicao
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
    // pegando o id pelos parametros da requisicao
    const { id } = getRoutesParams.parse(request.params)
    const { name, description, date_time, enter_diet } = updateMealSchema.parse(
      request.body,
    )
    const meal = await knex('meals').where('id', id).first()
    // validando se a refeicao existe mesmo
    if (!meal) {
      return reply.status(404).send({ message: 'meal not found' })
    }

    const updatedMeal = {
      name,
      description,
      date_time,
      enter_diet,
    }
    const user = await getUserByToken(request, reply)

    await knex('meals').where({ id, user_id: user.id }).update(updatedMeal)

    return reply.status(201).send(meal)
  })

  // deletando refeicao
  app.delete('/:id', async (request, reply) => {
    const { id } = getRoutesParams.parse(request.params)
    const user = await getUserByToken(request, reply)

    await knex('meals').where({ id, user_id: user.id }).delete()

    return reply.status(204).send({ message: 'Deleted meal' })
  })

  // listando todas as refeicoes do usuario
  app.get('/list', async (request, reply) => {
    const user = await getUserByToken(request, reply)

    const userMeals = await knex('meals').where('user_id', user.id)

    return reply.status(200).send({ userMeals })
  })
}
