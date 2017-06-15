/**
 * Created by llan on 2017/6/9.
 */
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
let router = new Router();
const koaBody = require('koa-body');
const views = require('koa-views');
const path = require('path');
app.use(views(path.join(__dirname, 'public'), {map: {html: 'nunjucks'}}));
app.use(koaBody());
app.use(require('koa-static')(path.join(__dirname, 'public')));

const ffi = require('ffi');

router.get('/', async(ctx)=> {
    await ctx.render('./html/index.html', {
        title: "通过计算测试调用dll/dylib方法"
    })
});
router.post('/result', (ctx)=> {
    let max = ctx.request.body.max;
    let libfactorial = ffi.Library('product', {
        'factorial': ['uint64', ['int']]
    });
    let result = libfactorial.factorial(max);
    return ctx.body = {
        status: 200,
        result: result
    }
});
router.post('/test',(ctx)=>{
    let retVal = ctx.request.body.retVal;
    let libfactorial = ffi.Library('JKit', {
        'JK_Retval2Str': ['char*', ['unsigned','long']]
    });
    let result = libfactorial.JK_Retval2Str(retVal);
    return ctx.body = {
       status: 200,
       result: result
   };
});
app.use(router.routes())
    .use(router.allowedMethods());

app.listen(3000, ()=> {
    console.log('app listening at 3000');
});
