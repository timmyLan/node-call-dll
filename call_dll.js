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
let intPtr = ref.refType(int);
let voidType = ref.types.void;
let ulong = ref.types.ulong;
let ulongPtr = ref.refType(ulong);
let lib = ffi.Library('./PassThru', {
    'PassThru_InquiryReg': [int, [CString]],
    'PassThru_InquiryIndex': [CString, [int]],
    'PassThru_LoadDLL': [int, [CString]],
    'PassThru_Open': [int, [CString, int]],
    'PassThru_Connect': [int, [CString, int, ulongPtr, ulong, ulong, ulong]],
    'PassThru_Ioctl': [int, [CString, int,ulong, ulong]],
    'PassThru_StartMsgFilter': [int, [CString, int,ulong,ulongPtr, ulong]],
    'PassThru_WriteMsgs': [int, [CString, int,ulong, CString,int, ulong]],
    'PassThru_ReadMsgs': [int, [CString, int,ulong, CString,intPtr, ulong, ulong]],
    'PassThru_StopMsgFilter': [int, [CString, int,ulong,ulong]],
    'PassThru_Disconnect': [int, [CString, int,ulong]],
    'PassThru_Close': [int, [CString,int]],
    'PassThru_Delete': [voidType, []]
});
//logs
let winston = require('winston');
winston.configure({
    transports: [
        new (winston.transports.File)({
            filename: 'call_dll_error.log',
            maxsize: '200M'
        })
    ]
});
//redis
let createClient = require('then-redis').createClient;
let client = createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});
// deviceConfig
let deviceConfig = require('./deviceConfig.json');
/**
 * 对比配置端口号是否存在于deviceConfig
 * @param  {[int]} index [配置端口号]
 * @return {[type]}       [description]
 */
const compareConfig = (index)=>{
    let keys = Object.keys(deviceConfig);
    console.log('keys',keys);
    if(keys.indexOf(index) < 0 ){
        winston.error(`config ${index} is not in deviceConfig`);
        return {
            stauts:500,
            errorMsg: `config ${index} is not in deviceConfig`
        }
    }else {
        return null;
    }
};
/**
 * resful返回信息模板
 * @param  {[type]} data     [调用dll返回结果]
 * @param  {[type]} errorMsg [调用dll发生错误]
 * @param  {[type]} refName [resful名]
 * @return {[type]}          [status为200则成功,500则失败并写入错误日志]
 */
const result_Model = (data, errorMsg = null, refName)=> {
    if (errorMsg) {
        winston.error(`call ${refName} resful,error with call dll ---- ${errorMsg}`);
        return {
            status: 500,
            errorMsg: errorMsg
        }
    }
    return {
        status: 200,
        data: data
    }
};
/**
 * 检测类型
 * @param  {[type]} target_type [目标类型]
 * @param  {[type]} data        [数据]
 * @param  {[type]} dataName    [数据名]
 * @return {[string]}           [返回检测结果]
 */
const checkType = (target_type, data, dataName)=> {
    if (typeof(data) !== target) {
        return {
            status: 400,
            errorMsg: `${dataName} type is wrong,need ${target}`
        }
    } else {
        return null;
    }
};
/**
 * 参数
 * @param  {[string]} miss_errorMsg  [错误信息]
 * @return {[type]}               [description]
 */
const miss_arg = (miss_errorMsg)=> {
    return {
        status: 402,
        errorMsg: miss_errorMsg
    }
}
// 获取注册表信息
// router.post('/reg', (ctx)=> {
//     let error_reg = new Buffer(250);
//     /**
//      *
//      * @param  {[string]} error_load      [错误信息]
//      * @return 注册表信息
//      */
//     let result_reg = lib.PassThru_InquiryReg(error_reg);
//     let data = {};
//     for(let i = 0;i<result_reg;i++){
//         data[i] = lib.PassThru_InquiryIndex(i);
//     }
//     return ctx.body = result_Model({
//         count:result_reg,
//         data:data
//     }, ref.readCString(error_reg), '/reg');
// });
// 加载动态库
router.post('/load', (ctx)=> {
    let error_load = new Buffer(250);
    /**
     *
     * @param  {[string]} error_load      [错误信息]
     * @return 成功加载动态库数目
     */
    let result_load = lib.PassThru_LoadDLL(error_load);
    return ctx.body = result_Model(result_load, ref.readCString(error_load), '/load');
});
// 检测设备数量
router.post('/open', (ctx)=> {
    let error_open = new Buffer(250);
    /**
     *
     * @param  {[string]} error_open      [错误信息]
     * @return 设备数量
     */
    let {index} = ctx.request.body;
    if (!index && index !== 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let resultCompare = compareConfig(index);
    if(resultCompare){
        return ctx.body = resultCompare;
    }
    let result_open = lib.PassThru_Open(error_open, index);
    return ctx.body = result_Model(result_open, ref.readCString(error_open), '/open');
});

// 链接设备
router.post('/connect', async(ctx)=> {
    let error_connect = new Buffer(250);
    /**
     *
     * @param  {[string]} error_connect      [错误信息]
     * @param  {[int]} index      [Index索引]
     * @param  {[intPtr]} pChannelID      [pChannelID要保存的ChannelID]
     * @param  {[int]} protocolID      [protocolID默认6]
     * @param  {[int]} flags      [Flags默认0]
     * @param  {[int]} baudRate      [BaudRate500000]
     * @return 0成功 非0失败
     */
    let {index, protocolID, flags, baudRate} = ctx.request.body;
    if (!index && index !== 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let resultCompare = compareConfig(index);
    if(resultCompare){
        return ctx.body = resultCompare;
    }
    let pChannelID = ref.alloc(ulong);
    let result_connect = lib.PassThru_Connect(error_connect, index, pChannelID, protocolID = 6, flags = 0, baudRate = 500000);
    let pChannelID_deref = pChannelID.deref();
    await client.sadd(`passThruConnect${index}`,pChannelID_deref);
    await client.set(`passThruConnect${index}_lastest_pChannelID`,pChannelID_deref);
    return ctx.body = result_Model(result_connect, ref.readCString(error_connect), '/connect');
});
// IO配置设备
router.post('/ioctl', async(ctx)=> {
    let error_ioctl = new Buffer(250);
    /**
     *
     * @param  {[string]} error_ioctl      [错误信息]
     * @param  {[int]} index      [Index索引]
     * @param  {[int]} pChannelID      [pChannelID连接指定设备后的ChannelID]
     * @param  {[int]} ioctlID      [ioctlID默认2]
     * @return 0成功 非0失败
     */
    let {index, ioctlID} = ctx.request.body;
    if (!index && index != 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let resultCompare = compareConfig(index);
    if(resultCompare){
        return ctx.body = resultCompare;
    }
    let pChannelID = await client.get(`passThruConnect${index}_lastest_pChannelID`);
    let result_ioctl = lib.PassThru_Ioctl(error_ioctl, index,pChannelID, ioctlID = 2);
    return ctx.body = result_Model(result_ioctl, ref.readCString(error_ioctl), '/ioctl');
});
// 配置过虑器
router.post('/startMsgFilter', async(ctx)=> {
    let error_StartMsgFilter = new Buffer(250);
    /**
     *
     * @param  {[string]} error_StartMsgFilter      [错误信息]
     * @param  {[int]} index      [Index索引]
     * @param  {[int]} pChannelID      [pChannelID连接指定设备后的ChannelID]
     * @param  {[intPtr]} pFilterID      [pFilterID要保存的FilterID]
     * @param  {[int]} filterType      [filterType默认3]
     * @return 0成功 非0失败
     */
    let {index, filterType} = ctx.request.body;
    if (!index && index != 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let resultCompare = compareConfig(index);
    if(resultCompare){
        return ctx.body = resultCompare;
    }
    let pChannelID = await client.get(`passThruConnect${index}_lastest_pChannelID`);
    let pFilterID = ref.alloc(ulong);
    let result_StartMsgFilter = lib.PassThru_StartMsgFilter(error_StartMsgFilter, index, pChannelID,pFilterID,filterType = 3);
    let pFilterID_deref = pFilterID.deref();
    await client.sadd(`startMsgFilter${index}`,pFilterID_deref);
    await client.set(`startMsgFilter${index}_lastest_pFilterID`,pFilterID_deref);
    return ctx.body = result_Model(result_StartMsgFilter, ref.readCString(error_StartMsgFilter), '/startMsgFilter');
});

// 发送
router.post('/writeMsgs', async(ctx)=> {
    let error_WriteMsgs = new Buffer(250);
    let msg_WriteMsgs = new Buffer(250);
    /**
     *
     * @param  {[string]} error_WriteMsgs      [错误信息]
     * @param  {[int]} index      [Index索引]
     * @param  {[int]} pChannelID      [pChannelID连接指定设备后的ChannelID]
     * @param  {[string]} writeMsgs      [Message要发送的字符串]
     * @param  {[int]} timeout      [Timeout默认1000]
     * @return 0成功 非0失败
     */
    let {index, writeMsgs, timeout} = ctx.request.body;
    if (!index && index != 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let resultCompare = compareConfig(index);
    if(resultCompare){
        return ctx.body = resultCompare;
    }
    if (!writeMsgs) {
        return ctx.body = miss_arg('缺少参数 writeMsgs [Message要发送的字符串]');
    }
    msg_WriteMsgs = writeMsgs;
    let length = msg_WriteMsgs.length;
    let pChannelID = await client.get(`passThruConnect${index}_lastest_pChannelID`);
    let result_WriteMsgs = lib.PassThru_WriteMsgs(error_WriteMsgs, index,pChannelID, msg_WriteMsgs,length, timeout = 1000);
    return ctx.body = result_Model(result_WriteMsgs, ref.readCString(error_WriteMsgs), '/writeMsgs');
});
// 接收
router.post('/readMsgs', async(ctx)=> {
    let error_ReadMsgs = new Buffer(250);
    let msg_ReadMsgs = new Buffer(250);
    /**
     *
     * @param  {[string]} error_ReadMsgs      [错误信息]
     * @param  {[int]} index      [Index索引]
     * @param  {[int]} pChannelID      [pChannelID连接指定设备后的ChannelID]
     * @param  {[string]} msg_ReadMsgs      [Message要接收的字符串]
     * @param  {[int]} pNumMsgs      [pNumMsgs接收字符串的数量默认为null]
     * @param  {[int]} timeout      [Timeout默认1000]
     * @return 0成功 非0失败
     */
    let {index, pNumMsgs, timeout} = ctx.request.body;
    if (!index && index != 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let resultCompare = compareConfig(index);
    if(resultCompare){
        return ctx.body = resultCompare;
    }
    let result_ReadMsgs;
    let length = ref.alloc(int);
    let pChannelID = await client.get(`passThruConnect${index}_lastest_pChannelID`);
    do {
        result_ReadMsgs = lib.PassThru_ReadMsgs(error_ReadMsgs, index,pChannelID, msg_ReadMsgs,length, pNumMsgs=null, timeout = 1000);
        ref.writeCString(error_ReadMsgs, 0, '');
    } while (result_ReadMsgs === 29 || result_ReadMsgs === 30);
    console.log('msg_ReadMsgs', ref.readCString(msg_ReadMsgs));
    return ctx.body = result_Model(result_ReadMsgs, ref.readCString(error_ReadMsgs), '/readMsgs');
});
// 删除过虑器
router.post('/stopMsgFilter', async(ctx)=> {
    let error_StopMsgFilter = new Buffer(250);
    /**
     *
     * @param  {[string]} error_StopMsgFilter      [错误信息]
     * @param  {[int]} index      [Index索引]
     * @param  {[int]} pChannelID      [pChannelID连接指定设备后的ChannelID]
     * @param  {[int]} pFilterID      [pFilterID要取消的FilterID]
     * @return 0成功 非0失败
     */
    let {index} = ctx.request.body;
    if (!index && index != 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let resultCompare = compareConfig(index);
    if(resultCompare){
        return ctx.body = resultCompare;
    }
    let pChannelID = await client.get(`passThruConnect${index}_lastest_pChannelID`);
    let pFilterID = await client.get(`startMsgFilter${index}_lastest_pFilterID`);
    let result_StopMsgFilter = lib.PassThru_StopMsgFilter(error_StopMsgFilter, index ,pChannelID,pFilterID);
    return ctx.body = result_Model(result_StopMsgFilter, ref.readCString(error_StopMsgFilter), '/stopMsgFilter');
});
// 断开指定连接
router.post('/disconnect', async(ctx)=> {
    let error_Disconnect = new Buffer(250);
    let {index} = ctx.request.body;
    if (!index && index != 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let resultCompare = compareConfig(index);
    if(resultCompare){
        return ctx.body = resultCompare;
    }
    let pChannelID = await client.get(`passThruConnect${index}_lastest_pChannelID`);
    let result_Disconnect = lib.PassThru_Disconnect(error_Disconnect, index,pChannelID);
    return ctx.body = result_Model(result_Disconnect, ref.readCString(error_Disconnect), '/disconnect');
});

// 关闭指定设备
router.post('/passThru_Close', (ctx)=> {
    let error_Close = new Buffer(250);
    /**
     *
     * @param  {[string]} error_Close      [错误信息]
     * @return 设备数量
     */
    let {index} = ctx.request.body;
    if (!index && index != 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let resultCompare = compareConfig(index);
    if(resultCompare){
        return ctx.body = resultCompare;
    }
    let result_Close = lib.PassThru_Close(error_Close,index);
    return ctx.body = result_Model(result_Close, ref.readCString(error_Close), '/passThru_Close');
});

// 统一操作(获取注册表信息&加载动态库)
// router.post('/ready', (ctx)=> {
//     // let error_reg = new Buffer(250);
//     let error_load = new Buffer(250);
//     let result_reg = lib.PassThru_InquiryReg(error_reg);
//     let data = {};
//     for(let i = 0;i<result_reg;i++){
//         data[i] = lib.PassThru_InquiryIndex(i);
//     }
//     if (ref.readCString(error_reg)) {
//         winston.error(`call /ready resful,error with call dll ---- ${ref.readCString(error_reg)}`);
//         return ctx.body = {
//             status: 500,
//             errorMsg: ref.readCString(error_reg)
//         }
//     }
//     let result_load = lib.PassThru_LoadDLL(error_load);
//     if (ref.readCString(error_load)) {
//         winston.error(`call /ready resful,error with call dll ---- ${ref.readCString(error_load)}`);
//         return ctx.body = {
//             status: 500,
//             errorMsg: ref.readCString(error_load)
//         }
//     }
//     return ctx.body = {
//         status: 200,
//         data: {
//             result_reg: {
//                 count:result_reg,
//                 data:data
//             },
//             result_load: result_load
//         }
//     }
// });

//统一操作(链接设备&IO配置设备&配置过虑器)
router.post('/start', async(ctx)=> {
    let error_open = new Buffer(250);
    let error_connect = new Buffer(250);
    let error_ioctl = new Buffer(250);
    let error_StartMsgFilter = new Buffer(250);
    /**
     *
     * @param  {[string]} error_StartMsgFilter      [错误信息]
     * @param  {[int]} index      [Index索引]
     * @param  {[int]} filterType      [filterType默认3]
     * @return 0成功 非0失败
     */
    let {index, protocolID, flags, baudRate, filterType, ioctlID} = ctx.request.body;
    if (!index && index != 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let resultCompare = compareConfig(index);
    if(resultCompare){
        return ctx.body = resultCompare;
    }
    let result_open = lib.PassThru_Open(error_open,index);
    if (ref.readCString(error_open)) {
        winston.error(`call /ready resful,error with call dll ---- ${ref.readCString(error_open)}`);
        return ctx.body = {
            status: 500,
            errorMsg: ref.readCString(error_open)
        }
    }
    let pChannelID = ref.alloc(ulong);
    let result_connect = lib.PassThru_Connect(error_connect, index, pChannelID, protocolID = 6, flags = 0, baudRate = 500000);
    let pChannelID_deref = pChannelID.deref();
    await client.sadd(`passThruConnect${index}`,pChannelID_deref);
    await client.set(`passThruConnect${index}_lastest_pChannelID`,pChannelID_deref);
    if (ref.readCString(error_connect)) {
        winston.error(`call /startUp resful,error with call dll ---- ${ref.readCString(error_connect)}`);
        return ctx.body = {
            status: 500,
            errorMsg: ref.readCString(error_connect)
        }
    }
    let pChannelID_lastest = await client.get(`passThruConnect${index}_lastest_pChannelID`);
    let result_ioctl = lib.PassThru_Ioctl(error_ioctl, index,pChannelID_lastest, ioctlID = 2);
    if (ref.readCString(error_ioctl)) {
        winston.error(`call /startUp resful,error with call dll ---- ${ref.readCString(error_ioctl)}`);
        return ctx.body = {
            status: 500,
            errorMsg: ref.readCString(error_ioctl)
        }
    }
    let pFilterID = ref.alloc(ulong);
    let result_StartMsgFilter = lib.PassThru_StartMsgFilter(error_StartMsgFilter, index, pChannelID_lastest,pFilterID,filterType = 3);
    let pFilterID_deref = pFilterID.deref();
    await client.sadd(`startMsgFilter${index}`,pFilterID_deref);
    await client.set(`startMsgFilter${index}_lastest_pFilterID`,pFilterID_deref);
    if (ref.readCString(error_StartMsgFilter)) {
        winston.error(`call /startUp resful,error with call dll ---- ${ref.readCString(error_StartMsgFilter)}`);
        return ctx.body = {
            status: 500,
            errorMsg: ref.readCString(error_StartMsgFilter)
        }
    }
    return ctx.body = {
        status: 200,
        data: {
            result_connect: result_connect,
            result_ioctl: result_ioctl,
            result_StartMsgFilter: result_StartMsgFilter
        }
    };
});

//统一操作(删除过虑器&断开指定连接&关闭指定设备)
router.post('/end', async(ctx)=> {
    let error_StopMsgFilter = new Buffer(250);
    let error_Disconnect = new Buffer(250);
    let error_Close = new Buffer(250);

    /**
     *
     * @param  {[string]} error_Disconnect      [错误信息]
     * @param  {[int]} index      [Index索引]
     * @return 0成功 非0失败
     */
    let {index} = ctx.request.body;
    if (!index && index != 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let resultCompare = compareConfig(index);
    if(resultCompare){
        return ctx.body = resultCompare;
    }
    let pChannelID = await client.get(`passThruConnect${index}_lastest_pChannelID`);
    let pFilterID = await client.get(`startMsgFilter${index}_lastest_pFilterID`);
    let result_StopMsgFilter = lib.PassThru_StopMsgFilter(error_StopMsgFilter, index ,pChannelID,pFilterID);
    if (ref.readCString(error_StopMsgFilter)) {
        winston.error(`call /end resful,error with call dll ---- ${ref.readCString(error_StopMsgFilter)}`);
        return ctx.body = {
            status: 500,
            errorMsg: ref.readCString(error_StopMsgFilter)
        }
    }
    let result_Disconnect = lib.PassThru_Disconnect(error_Disconnect, index,pChannelID);
    if (ref.readCString(error_Disconnect)) {
        winston.error(`call /end resful,error with call dll ---- ${ref.readCString(error_Disconnect)}`);
        return ctx.body = {
            status: 500,
            errorMsg: ref.readCString(error_Disconnect)
        }
    }
    let result_Close = lib.PassThru_Close(error_Close,index);
    if (ref.readCString(error_Close)) {
        winston.error(`call /end resful,error with call dll ---- ${ref.readCString(error_Close)}`);
        return ctx.body = {
            status: 500,
            errorMsg: ref.readCString(error_Close)
        }
    }
    await client.del(`passThruConnect${index}_lastest_pChannelID`);
    await client.del(`startMsgFilter${index}_lastest_pFilterID`);
    return ctx.body = {
        status: 200,
        data: {
            result_StopMsgFilter: result_StopMsgFilter,
            result_Disconnect: result_Disconnect,
            result_Close:result_Close
        }
    }
});


// 关闭空间
router.post('/passThru_Delete', (ctx)=> {
    let result_Close = lib.PassThru_Delete();
    return ctx.body = {
        status:200,
        data:''
    }
});

let product = ffi.Library('./product', {
    'factorial': ['uint64', ['int']],
    'add': ['int', ['int', 'int']],
    'minus': ['int', ['int', 'int']],
    'multiply': ['int', ['int', 'int']],
    'compare': ['string', ['int', 'int']]
});
router.post('/result', (ctx)=> {
    let max = ctx.request.body.max;
    let result = product.factorial(max);
    return ctx.body = {
        status: 200,
        data: result
    }
});
router.post('/add', async(ctx)=> {
    let {first, second} = ctx.request.body;
    let result = product.add(first, second);
    await new Promise(resolve => {
        setTimeout(resolve, 300);
    });
    return ctx.body = {
        status: 200,
        data: result
    }
});
router.post('/minus', (ctx)=> {
    let {first, second} = ctx.request.body;
    let result = product.minus(first, second);
    return ctx.body = {
        status: 200,
        data: result
    }
});
router.post('/multiply', (ctx)=> {
    let {first, second} = ctx.request.body;
    let result = product.multiply(first, second);
    return ctx.body = {
        status: 200,
        data: result
    }
});
router.post('/compare', (ctx)=> {
    let {first, second} = ctx.request.body;
    let result = product.compare(first, second);
    return ctx.body = {
        status: 200,
        data: result
    }
});
app.use(router.routes())
    .use(router.allowedMethods());
let server = app.listen(3000, '0.0.0.0', ()=> {
    console.log('app listening at 3000');
});
server.setTimeout(400000);
