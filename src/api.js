import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-body'
import mongoose from 'mongoose'
import UserModel from './models/users'

class App {
  async setup () {
      const api = new Koa()
      api.use(bodyParser({
          multipart : true
      }))
      await initDB()
      createEndpoints(api)
      return api
  }
}

async function initDB() {

    try {
        await mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true})
        mongoose.set('debug', true)
        console.log("Connected")
    } catch (e) {
        console.log(e)
    }
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
  router.get('/users', async (ctx, netx) =>{
    ctx.body = await UserModel.find().select({name:1, rut:1})

  })

    router.get('/users/options', async (ctx, next) => {
        const nameFilter = ctx.request.query
        console.log(ctx.request.query)
        ctx.body = await UserModel
            .find()
            .where({name: `/${nameFilter['name-like']}/`})
            .select({rut:1})
    })

    router.get('/users/:id', async (ctx, next) => {
        ctx.body = await UserModel
            .find()
            .where({rut: ctx.params.id})
            .select({rut:1})
    })



    router.put('/users/:id', (ctx, next) => {
    //console.log(ctx.request.req)
    Object.assign(usuarios[ctx.params.id], ctx.request.body)
    ctx.body = 'Reemplazar por completo'
  })
  router.post('/users', async (ctx, next) => {
      console.log("body", ctx.request.body)
   try {
       await UserModel.create(ctx.request.body)
       console
   } catch (e) {
       console.log(e)
   }
    ctx.body = 'Agregado'
  })
  router.patch('/users/:id/name', (ctx, next) => {
    usuarios[ctx.params.id].name = ctx.request.body
    ctx.body = 'Modificado'
  })








  api.use(router.routes()).use(router.allowedMethods())
}

module.exports = App
