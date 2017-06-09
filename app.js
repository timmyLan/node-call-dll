/**
 * Created by llan on 2017/6/9.
 */
const Koa = require('koa');
const app = new Koa();
var Router = require('koa-router');
var router = new Router();
const koaBody = require('koa-body');
app.use(koaBody());

// const ffi = require('ffi');

router.get('/', (ctx, next)=> {
    return ctx.body = 'hello koa';
});
router.post('/result', (ctx)=> {
    let max = ctx.request.body.max;
    // let libfactorial = ffi.Library('C:/Users/llan/code/node-call-dll/product', {
    //     'factorial': ['uint64', ['int']]
    // });
    // let result = libfactorial.factorial(max);
    return ctx.body = {
        status: 200,
        result: max
    }
});
app.use(router.routes())
    .use(router.allowedMethods());

app.listen(3000, ()=> {
    console.log('app listening at 3000');
});
