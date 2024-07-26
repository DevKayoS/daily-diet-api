import { app } from '../src/app'
import { it, describe, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('User Routes', () => {
  // esperando o servidor rodar
  beforeAll(async () => {
    await app.ready()
  })
  // fechando conexao com o servidor apos rodar os testes
  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    // resetando o banco de dados antes de iniciar o teste
    execSync('npm run knex -- migrate:rollback')
    // criando um banco de dados antes de rodar o proximo teste
    execSync('npm run knex -- migrate:latest')
  })
  // deveria ser possivel criar novo usuario
  it('should be able to create new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'john',
        lastname: 'doe',
        email: 'johndoe@example.com',
        password: 'password',
      })
      .expect(201)
  })
  // deveria ser logar  usuario
  it('should be able to login user', async () => {
    // criando usuario
    await request(app.server).post('/users').send({
      name: 'john',
      lastname: 'doe',
      email: 'johndoe@example.com',
      password: 'password',
    })
    // realizando o login
    await request(app.server)
      .post('/users/login')
      .send({
        email: 'johndoe@example.com',
        password: 'password',
      })
      .expect(200)
  })
})
