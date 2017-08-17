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
var StructType = require('ref-struct');
let CString = ref.types.CString;
let int = ref.types.int;
let ulong = ref.types.ulong;
let ulongPtr = ref.refType(ulong);
let PassThru_RegName = StructType({
    Name:CString
});
let PassThru_RegName_ref = ref.refType(PassThru_RegName);
let PassThru_RegInfo = StructType({
    PassThruRegName:PassThru_RegName_ref,
    Count:int
});
let PassThru_RegInfo_ref = ref.refType(PassThru_RegInfo);
let lib = ffi.Library('./PassThru', {
    'PassThru_InquiryReg': [int, [CString]],
    'PassThru_InquiryIndex': [CString, [int]],
    'PassThru_LoadDLL': [int, [CString]],
    'PassThru_Open': [int, [CString]],
    'PassThru_Connect': [int, [CString, int, ulong, ulong, ulong]],
    'PassThru_Ioctl': [int, [CString, int, ulong]],
    'PassThru_StartMsgFilter': [int, [CString, int, ulong]],
    'PassThru_WriteMsgs': [int, [CString, int, CString, ulong]],
    'PassThru_ReadMsgs': [int, [CString, int, CString, ulongPtr, ulong]],
    'PassThru_StopMsgFilter': [int, [CString, int]],
    'PassThru_Disconnect': [int, [CString, int]],
    'PassThru_Close': [int, [CString]],
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
router.post('/reg', (ctx)=> {
    let error_reg = new Buffer(250);
    /**
     *
     * @param  {[string]} error_load      [错误信息]
     * @return 注册表数目
     */
    let result_reg = lib.PassThru_InquiryReg(error_reg);
    return ctx.body = result_Model(result_reg, ref.readCString(error_reg), '/reg');
});
// 获取索引信息
router.post('/getData', (ctx)=> {
    /**
     *
     * @param  {[string]} error_load      [错误信息]
     * @return 注册表数目
     */
    let {index} = ctx.request.body;
    if (!index && index !== 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let result_getData = lib.PassThru_InquiryIndex(index);
    return ctx.body = result_Model(result_getData,'', '/getData');
});
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
    let result_open = lib.PassThru_Open(error_open);
    return ctx.body = result_Model(result_open, ref.readCString(error_open), '/open');
});

// 链接设备
router.post('/connect', (ctx)=> {
    let error_connect = new Buffer(250);
    /**
     *
     * @param  {[string]} error_connect      [错误信息]
     * @param  {[int]} index      [Index索引]
     * @param  {[int]} protocolID      [protocolID默认6]
     * @param  {[int]} flags      [Flags默认0]
     * @param  {[int]} baudRate      [BaudRate500000]
     * @return 0成功 非0失败
     */

    let {index, protocolID, flags, baudRate} = ctx.request.body;
    if (!index && index !== 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let result_connect = lib.PassThru_Connect(error_connect, index, protocolID = 6, flags = 0, baudRate = 500000);
    return ctx.body = result_Model(result_connect, ref.readCString(error_connect), '/connect');
});
// IO配置设备
router.post('/ioctl', (ctx)=> {
    let error_ioctl = new Buffer(250);
    /**
     *
     * @param  {[string]} error_ioctl      [错误信息]
     * @param  {[int]} index      [Index索引]
     * @param  {[int]} ioctlID      [ioctlID默认2]
     * @return 0成功 非0失败
     */
    let {index, ioctlID} = ctx.request.body;
    if (!index && index != 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let result_ioctl = lib.PassThru_Ioctl(error_ioctl, index, ioctlID = 2);
    return ctx.body = result_Model(result_ioctl, ref.readCString(error_ioctl), '/ioctl');
});
// 配置过虑器
router.post('/startMsgFilter', (ctx)=> {
    let error_StartMsgFilter = new Buffer(250);
    /**
     *
     * @param  {[string]} error_StartMsgFilter      [错误信息]
     * @param  {[int]} index      [Index索引]
     * @param  {[int]} filterType      [filterType默认3]
     * @return 0成功 非0失败
     */
    let {index, filterType} = ctx.request.body;
    if (!index && index != 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let result_StartMsgFilter = lib.PassThru_StartMsgFilter(error_StartMsgFilter, index, filterType = 3);
    return ctx.body = result_Model(result_StartMsgFilter, ref.readCString(error_StartMsgFilter), '/startMsgFilter');
});

// 发送
router.post('/writeMsgs', (ctx)=> {
    let error_WriteMsgs = new Buffer(250);
    let msg_WriteMsgs = new Buffer(250);
    /**
     *
     * @param  {[string]} error_WriteMsgs      [错误信息]
     * @param  {[int]} index      [Index索引]
     * @param  {[string]} writeMsgs      [Message要发送的字符串]
     * @param  {[int]} timeout      [Timeout默认1000]
     * @return 0成功 非0失败
     */
    let {index, writeMsgs, timeout} = ctx.request.body;
    if (!index && index != 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    if (!writeMsgs) {
        return ctx.body = miss_arg('缺少参数 writeMsgs [Message要发送的字符串]');
    }
    msg_WriteMsgs = writeMsgs;
    let result_WriteMsgs = lib.PassThru_WriteMsgs(error_WriteMsgs, index, msg_WriteMsgs, timeout = 1000);
    return ctx.body = result_Model(result_WriteMsgs, ref.readCString(error_WriteMsgs), '/writeMsgs');
});
// 接收
router.post('/readMsgs', (ctx)=> {
    let error_ReadMsgs = new Buffer(250);
    let msg_ReadMsgs = new Buffer(250);
    /**
     *
     * @param  {[string]} error_ReadMsgs      [错误信息]
     * @param  {[int]} index      [Index索引]
     * @param  {[string]} msg_ReadMsgs      [Message要接收的字符串]
     * @param  {[int]} pNumMsgs      [pNumMsgs接收字符串的数量默认为null]
     * @param  {[int]} timeout      [Timeout默认1000]
     * @return 0成功 非0失败
     */
    let {index, pNumMsgs, timeout} = ctx.request.body;
    if (!index && index != 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let result_ReadMsgs;
    do {
        result_ReadMsgs = lib.PassThru_ReadMsgs(error_ReadMsgs, index, msg_ReadMsgs, pNumMsgs = null, timeout = 1000);
        ref.writeCString(error_ReadMsgs, 0, '');
    } while (result_ReadMsgs === 29 || result_ReadMsgs === 30);
    console.log('msg_ReadMsgs', ref.readCString(msg_ReadMsgs));
    return ctx.body = result_Model(result_ReadMsgs, ref.readCString(error_ReadMsgs), '/readMsgs');
});
// 删除过虑器
router.post('/stopMsgFilter', (ctx)=> {
    let error_StopMsgFilter = new Buffer(250);
    /**
     *
     * @param  {[string]} error_StopMsgFilter      [错误信息]
     * @param  {[int]} index      [Index索引]
     * @return 0成功 非0失败
     */
    let {index} = ctx.request.body;
    if (!index && index != 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let result_StopMsgFilter = lib.PassThru_StopMsgFilter(error_StopMsgFilter, index);
    return ctx.body = result_Model(result_StopMsgFilter, ref.readCString(error_StopMsgFilter), '/stopMsgFilter');
});
// 断开指定连接
router.post('/disconnect', (ctx)=> {
    let error_Disconnect = new Buffer(250);
    let {index} = ctx.request.body;
    if (!index && index != 0) {
        return ctx.body = miss_arg('缺少参数 index [Index索引]');
    }
    let result_Disconnect = lib.PassThru_Disconnect(error_Disconnect, index);
    return ctx.body = result_Model(result_Disconnect, ref.readCString(error_Disconnect), '/disconnect');
});


// 统一操作(获取注册表信息&加载动态库&检测设备数量)
router.post('/ready', (ctx)=> {
    let error_reg = new Buffer(250);
    let error_load = new Buffer(250);
    let error_open = new Buffer(250);
    let result_reg = lib.PassThru_InquiryReg(error_reg);
    if(ref.readCString(error_reg)){
        winston.error(`call /ready resful,error with call dll ---- ${ref.readCString(error_reg)}`);
        return ctx.body = {
            status:500,
            errorMsg:ref.readCString(error_reg)
        }
    }
    let result_load = lib.PassThru_LoadDLL(error_load);
    if(ref.readCString(error_load)){
        winston.error(`call /ready resful,error with call dll ---- ${ref.readCString(error_load)}`);
        return ctx.body = {
            status:500,
            errorMsg:ref.readCString(error_load)
        }
    }
    let result_open = lib.PassThru_Open(error_open);
    if(ref.readCString(error_open)){
        winston.error(`call /ready resful,error with call dll ---- ${ref.readCString(error_open)}`);
        return ctx.body = {
            status:500,
            errorMsg:ref.readCString(error_open)
        }
    }
    return ctx.body ={
        status:200,
        data:{
            result_reg:result_reg,
            result_load:result_load,
            result_open:result_open
        }
    }
});

//统一操作(链接设备&IO配置设备&配置过虑器)
router.post('/startUp', (ctx)=> {
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
    let result_connect = lib.PassThru_Connect(error_connect, index, protocolID = 6, flags = 0, baudRate = 500000);
    if(ref.readCString(error_connect)){
        winston.error(`call /startUp resful,error with call dll ---- ${ref.readCString(error_connect)}`);
        return ctx.body = {
            status:500,
            errorMsg:ref.readCString(error_connect)
        }
    }
    let result_ioctl = lib.PassThru_Ioctl(error_ioctl, index, ioctlID = 2);
    if(ref.readCString(error_ioctl)){
        winston.error(`call /startUp resful,error with call dll ---- ${ref.readCString(error_ioctl)}`);
        return ctx.body = {
            status:500,
            errorMsg:ref.readCString(error_ioctl)
        }
    }
    let result_StartMsgFilter = lib.PassThru_StartMsgFilter(error_StartMsgFilter, index, filterType = 3);
    if(ref.readCString(error_StartMsgFilter)){
        winston.error(`call /startUp resful,error with call dll ---- ${ref.readCString(error_StartMsgFilter)}`);
        return ctx.body = {
            status:500,
            errorMsg:ref.readCString(error_StartMsgFilter)
        }
    }
    return ctx.body = {
        status:200,
        data:{
            result_connect: result_connect,
            result_ioctl: result_ioctl,
            result_StartMsgFilter: result_StartMsgFilter
        }
    };
});

//统一操作(删除过虑器&断开指定连接)
router.post('/end', (ctx)=> {
    let error_StopMsgFilter = new Buffer(250);
    let error_Disconnect = new Buffer(250);
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
    let result_StopMsgFilter = lib.PassThru_StopMsgFilter(error_StopMsgFilter, index);
    if(ref.readCString(error_StopMsgFilter)){
        winston.error(`call /end resful,error with call dll ---- ${ref.readCString(error_StopMsgFilter)}`);
        return ctx.body = {
            status:500,
            errorMsg:ref.readCString(error_StopMsgFilter)
        }
    }
    let result_Disconnect = lib.PassThru_Disconnect(error_Disconnect, index);
    if(ref.readCString(error_Disconnect)){
        winston.error(`call /end resful,error with call dll ---- ${ref.readCString(error_Disconnect)}`);
        return ctx.body = {
            status:500,
            errorMsg:ref.readCString(error_Disconnect)
        }
    }
    return ctx.body = {
        status:200,
        data:{
            result_StopMsgFilter:result_StopMsgFilter,
            result_Disconnect:result_Disconnect
        }
    }
});

// 关闭设备
router.post('/passThru_Close', (ctx)=> {
    let error_Close = new Buffer(250);
    /**
     *
     * @param  {[string]} error_Close      [错误信息]
     * @return 设备数量
     */

    let result_Close = lib.PassThru_Close(error_Close);
    return ctx.body = result_Model(result_Close, ref.readCString(error_Close), '/passThru_Close');
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
