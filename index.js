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
const RefArray = require('ref-array');
const RefStruct = require('ref-struct');
const ffi = require('ffi');
const JK_PassThruInfo = RefStruct({
    szVendor: RefArray('char', 55),
    szConfigApplication: RefArray('char', 55),
    szFunctionLibrary: RefArray('char', 55),
    szName: RefArray('char', 55)
});
const JK_PassThruInfoList_Struct = RefStruct({
    pPassThruLibs: JK_PassThruInfo,
    nCount: 'int'
});
const JK_PassThruInfoList_Array = RefArray(JK_PassThruInfoList_Struct);

let product = ffi.Library('./JKit', {
    'EnumPassThruInterfaces': ['int', [JK_PassThruInfoList_Array, 'char']],
});

router.get('/', async(ctx)=> {
    await ctx.render('./html/index.html', {
        title: "通过计算测试调用dll/dylib/so方法"
    })
});
router.post('/result', (ctx)=> {
    let result = product.EnumPassThruInterfaces();
    return ctx.body = {
        status: 200,
        result: result
    }
});

app.use(router.routes())
    .use(router.allowedMethods());

let server = app.listen(3000, '0.0.0.0', ()=> {
    console.log('app listening at 3000');
});
server.setTimeout(400000);
