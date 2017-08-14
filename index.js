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
// koa middleware
app.use(views(path.join(__dirname, 'public'), {map: {html: 'nunjucks'}}));
app.use(koaBody());
app.use(require('koa-static')(path.join(__dirname, 'public')));

//ffi
const ffi = require('ffi');
const ref = require('ref');
const StructType = require('ref-struct');

//define ffi
let JK_PassThruInfo = StructType({
    szVendor:'string',
    szName:'string',
    szFunctionLibrary:'string',
    szConfigApplication:'string'
});
let JK_PassThruInfoList = StructType({
    pPassThruLibs:JK_PassThruInfo,
    nCount:ref.types.int
});
// JK_PassThruInfoList.defineProperty('nCount','int',0)
let JK_PassThruInfoList_Ptr = ref.refType(JK_PassThruInfoList);
let lib = ffi.Library('./JKit',{
    'JK_EnumPassThruInterfaces':['int',[JK_PassThruInfoList_Ptr,'string']]
});

router.post('/result', (ctx)=> {
    let ErrorMsg = ref.alloc('string');
    let infoList = ref.alloc(JK_PassThruInfoList_Ptr);
    let result = lib.JK_EnumPassThruInterfaces(infoList,ErrorMsg);
    let data = infoList.deref().deref();
    let msg = ErrorMsg.deref();
    console.log('msg',msg);
    console.log('data',data);
    return ctx.body = {
        status: 200,
        result:result

    }
});

app.use(router.routes())
    .use(router.allowedMethods());

let server = app.listen(3000, '0.0.0.0', ()=> {
    console.log('app listening at 3000');
});