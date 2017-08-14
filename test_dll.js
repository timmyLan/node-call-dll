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
let CString = ref.types.CString;
let int = ref.types.int;
let ulong = ref.types.ulong;
let ulongPtr = ref.refType(ulong);
let lib = ffi.Library('./PassThrough',{
    'PassThru_InquiryReg':[int,[CString]],
    'PassThru_LoadDLL':[int,[CString]],
    'PassThru_Open':[int,[CString]],
    'PassThru_Connect':[int,[CString,int,ulong,ulong,ulong]],
    'PassThru_Ioctl':[int,[CString,int,ulong]],
    'PassThru_StartMsgFilter':[int,[CString,int,ulong]],
    'PassThru_WriteMsgs':[int,[CString,int,CString,ulong]],
    'PassThru_ReadMsgs':[int,[CString,int,CString,ulongPtr,ulong]],
    'PassThru_StopMsgFilter':[int,[CString,int]],
    'PassThru_Disconnect':[int,[CString,int]],
    'PassThru_Close':[int,[CString]],
});

router.post('/result', (ctx)=> {
    let error_reg = new Buffer(250);
    let result_reg = lib.PassThru_InquiryReg(error_reg);
    console.log('result_reg',result_reg);
    console.log('error_reg',ref.readCString(error_reg));
    console.log('=================================');
    let error_load = new Buffer(250);
    let result_load = lib.PassThru_LoadDLL(error_load);
    console.log('result_load',result_load);
    console.log('error_load',ref.readCString(error_load));
    console.log('=================================');
    let error_open = new Buffer(250);
    let result_open = lib.PassThru_Open(error_open);
    console.log('result_open',result_open);
    console.log('error_open',ref.readCString(error_open));
    console.log('=================================');
    console.log('================================= connect index 0 begin =================================');

    let error_connect = new Buffer(250);
    let result_connect = lib.PassThru_Connect(error_connect,0,6,0,500000);
    console.log('result_connect',result_connect);
    console.log('error_connect',ref.readCString(error_connect));
    console.log('=================================');
    let error_ioctl = new Buffer(250);
    let result_ioctl = lib.PassThru_Ioctl(error_ioctl,0,2);
    console.log('result_ioctl',result_ioctl);
    console.log('error_ioctl',ref.readCString(error_ioctl));
    console.log('=================================');
    let error_StartMsgFilter = new Buffer(250);
    let result_StartMsgFilter = lib.PassThru_StartMsgFilter(error_StartMsgFilter,0,3);
    console.log('result_StartMsgFilter',result_StartMsgFilter);
    console.log('error_StartMsgFilter',ref.readCString(error_StartMsgFilter));
    console.log('=================================');
    console.log('================================= connect index 0 end =================================');

    //connect other
    console.log('================================= connect index 1 begin =================================');
    let error_connect_1 = new Buffer(250);
    let result_connect_1 = lib.PassThru_Connect(error_connect_1,1,6,0,500000);
    console.log('result_connect_1',result_connect_1);
    console.log('error_connect_1',ref.readCString(error_connect_1));
    console.log('=================================');
    let error_ioctl_1 = new Buffer(250);
    let result_ioctl_1 = lib.PassThru_Ioctl(error_ioctl_1,1,2);
    console.log('result_ioctl_1',result_ioctl_1);
    console.log('error_ioctl_1',ref.readCString(error_ioctl_1));
    console.log('=================================');
    let error_StartMsgFilter_1 = new Buffer(250);
    let result_StartMsgFilter_1 = lib.PassThru_StartMsgFilter(error_StartMsgFilter_1,1,3);
    console.log('result_StartMsgFilter_1',result_StartMsgFilter_1);
    console.log('error_StartMsgFilter_1',ref.readCString(error_StartMsgFilter_1));
    console.log('=================================');
    console.log('================================= connect index 1 end =================================');

    let error_WriteMsgs = new Buffer(250);
    let msg_WriteMsgs = new Buffer(250);
    msg_WriteMsgs = 'somethinesend_somesend_somethine';
    let result_WriteMsgs = lib.PassThru_WriteMsgs(error_WriteMsgs,1,msg_WriteMsgs,1000);
    console.log('result_WriteMsgs',result_WriteMsgs);
    console.log('error_WriteMsgs',ref.readCString(error_WriteMsgs));
    console.log('msg_WriteMsgs',msg_WriteMsgs);
    console.log('=================================');
    let error_ReadMsgs = new Buffer(250);
    let msg_ReadMsgs = new Buffer(250);
    let pNumMsgs = null;
    let result_ReadMsgs;
    do{
     result_ReadMsgs = lib.PassThru_ReadMsgs(error_ReadMsgs,0,msg_ReadMsgs,pNumMsgs,1000);
     ref.writeCString(error_ReadMsgs,0,'');
     console.log('result_ReadMsgs',result_ReadMsgs);
    }while(result_ReadMsgs === 29 || result_ReadMsgs === 30);
    console.log('result_ReadMsgs',result_ReadMsgs);
    console.log('error_ReadMsgs',ref.readCString(error_ReadMsgs));
    console.log('msg_ReadMsgs',ref.readCString(msg_ReadMsgs));
    console.log('=================================');
    let error_StopMsgFilter = new Buffer(250);
    let index_StopMsgFilter = 0;
    let result_StopMsgFilter = lib.PassThru_StopMsgFilter(error_StopMsgFilter,index_StopMsgFilter);
    console.log('result_StopMsgFilter',result_StopMsgFilter);
    console.log('error_StopMsgFilter',ref.readCString(error_StopMsgFilter));
    console.log('=================================');
    let error_Disconnect = new Buffer(250);
    let index_Disconnect = 0;
    let result_Disconnect = lib.PassThru_Disconnect(error_Disconnect,index_Disconnect);
    console.log('result_Disconnect',result_Disconnect);
    console.log('error_Disconnect',ref.readCString(error_Disconnect));
    console.log('=================================');
    let error_Close = new Buffer(250);
    let result_Close = lib.PassThru_Close(error_Close);
    console.log('result_Close',result_Close);
    console.log('error_Close',ref.readCString(error_Close));
    console.log('=================================');
    return ctx.body = {
        status: 200,
        result:result_reg
    }
});

app.use(router.routes())
    .use(router.allowedMethods());
let server = app.listen(3000, '0.0.0.0', ()=> {
    console.log('app listening at 3000');
});