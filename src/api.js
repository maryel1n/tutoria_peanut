import Koa from 'koa'
import Router from 'koa-router'
import mongoose from 'mongoose'
import UserModel from './models/users'

class App {
  async setup () {
    const api = new Koa()
    createEndpoints(api)
    return api
  }
}

function initDB() {

  mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});
}


function createEndpoints(api) {
  let router = new  Router()
  let usuarios =
      [{
        id:1,
        name:"maryelin"
      }]
  router.get('/', (ctx, next) => {
    ctx.body = 'Hello World!'
  })
  router.get('/users', (ctx, netx) =>{
    ctx.body = usuarios

  })
  router.get('/users/:id', (ctx, next) => {
      ctx.body = usuarios.find( function (user) {
        return user.id === ctx.params.id
      })
  })
  router.put('/users/:id', (ctx, next) => {
    //console.log(ctx.request.req)
    Object.assign(usuarios[ctx.params.id], ctx.request.body)
    ctx.body = 'Reemplazar por completo'
  })
  router.post('/users', async (ctx, next) => {
   await UserModel.create(ctx.request.body)
    ctx.body = 'Agregado'
  })
  router.patch('/users/:id/name', (ctx, next) => {
    usuarios[ctx.params.id].name = ctx.request.body
    ctx.body = 'Modificado'
  })








  api.use(router.routes()).use(router.allowedMethods())
}

module.exports = App
