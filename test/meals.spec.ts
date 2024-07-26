/* eslint-disable prettier/prettier */
import { app } from '../src/app'
import { it, describe, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import { execSync } from 'child_process'

describe('Meals Routes', () => {
  // esperando o servidor rodar
  beforeAll(async () => {
    await app.ready()
  })
  // fechando conexao com o servidor apos rodar os testes
  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })
  // deveria ser possivel criar novo usuario
  it('should be able to create new meal', async () => {
    // criando um usuário para pegar o token
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'john',
      lastname: 'doe',
      email: 'johndoe@example.com',
      password: 'password',
    })
    // pegando o token da resposta
    const token = createUserResponse.body.token
    // enviando a requisição
    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'meal 1',
        description: 'meal test',
        date_time: '00:00',
        enter_diet: true,
      })
      .expect(201)
  })
  // deveria ser possivel atualizar refeicao
  it('should be able to update meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'john',
      lastname: 'doe',
      email: 'johndoe@example.com',
      password: 'password',
    })
    const token = createUserResponse.body.token

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'meal 1',
        description: 'meal test',
        date_time: '00:00',
        enter_diet: true,
      })

    const listMealsResponse = await request(app.server)
      .get('/meals/list')
      .set('Authorization', `Bearer ${token}`)

    const getMealId = listMealsResponse.body.userMeals[0].id
    console.log(getMealId)

    await request(app.server)
      .put(`/meals/${getMealId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'meal updated',
        description: 'meal test updated',
        date_time: '00:00 26/07',
        enter_diet: false,
      })
      .expect(201)
  })
  // deveria ser possivel deletar usuário
  it('should be able to delete meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'john',
      lastname: 'doe',
      email: 'johndoe@example.com',
      password: 'password',
    })
    const token = createUserResponse.body.token

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'meal 1',
        description: 'meal test',
        date_time: '00:00',
        enter_diet: true,
      })

    const listMealsResponse = await request(app.server)
      .get('/meals/list')
      .set('Authorization', `Bearer ${token}`)

    const getMealId = listMealsResponse.body.userMeals[0].id

    await request(app.server)
      .delete(`/meals/${getMealId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })
  // deveria ser possivel listar as refeicoes do usuário
  it('should be able to list user meals', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'john',
      lastname: 'doe',
      email: 'johndoe@example.com',
      password: 'password',
    })
    const token = createUserResponse.body.token

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'meal 1',
        description: 'meal test',
        date_time: '00:00',
        enter_diet: true,
      })

    await request(app.server)
      .get('/meals/list')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })
  // deveria ser possivel pegar uma refeicao pelo id
  it('should be able to get unique meal by id', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'john',
      lastname: 'doe',
      email: 'johndoe@example.com',
      password: 'password',
    })
    const token = createUserResponse.body.token

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'meal 1',
        description: 'meal test',
        date_time: '00:00',
        enter_diet: true,
      })

    const listMealsResponse = await request(app.server)
      .get('/meals/list')
      .set('Authorization', `Bearer ${token}`)

    const getMealId = listMealsResponse.body.userMeals[0].id

    await request(app.server)
      .get(`/meals/${getMealId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })
  // deveria ser possivel pegar as metricas do usuário
  it('should be able to show users metrics', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'john',
      lastname: 'doe',
      email: 'johndoe@example.com',
      password: 'password',
    })
    const token = createUserResponse.body.token

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'meal 1',
        description: 'meal test',
        date_time: '00:00',
        enter_diet: true,
      })
    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'meal 2',
        description: 'meal test 2',
        date_time: '00:00',
        enter_diet: false,
      })

    const userMetrics = await request(app.server)
      .get('/meals/metrics')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(userMetrics.body).toEqual(
      expect.objectContaining({
        totalMeals: 2,
        totalGoodMeals: 1,
        totalBadMeals: 1,
        bestSequence: 1,
      }),
    )
  })
})
