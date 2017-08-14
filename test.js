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
let voidPtr = ref.refType(ref.types.void);
let JK_PassThruLibraryIndexType = ref.types.uint;
let ulongPtr = ref.refType(ref.types.ulong);
let lib = ffi.Library('./JKit_win32/JKit',{
    'JK_Initial':['int',[]],
    'JK_DeInitial':[voidPtr,[]],
    'JK_PassThruLibraryCount':['int',[]],
    'JK_GetPassThruLibraryName':['string',[JK_PassThruLibraryIndexType]],
    'JK_GetPassThruLibraryVendor':['string',[JK_PassThruLibraryIndexType]],
    'JK_GetPassThruLibraryPath':['string',[JK_PassThruLibraryIndexType]],
    'JK_PassThruLoadLibrary':[voidPtr,[JK_PassThruLibraryIndexType,'string']],
    'JK_PassThruUnLoadLibrary':[voidPtr,[JK_PassThruLibraryIndexType,'string']]
});

router.post('/result', (ctx)=> {
	lib.JK_Initial();
    let libraryCnt = lib.JK_PassThruLibraryCount();
    console.log('libraryCnt',libraryCnt);
    if(libraryCnt<0){
    	console.log('JK_PassThruLibraryCount <= 0');
    	lib.JK_DeInitial();
    	return ctx.body = {
    		status:500
    	}
    }
    for(let i = 0;i<libraryCnt;i++){
    	console.log(`================================== library ${i} begin ==================================`);
    	let libraryName = lib.JK_GetPassThruLibraryName(i);
    	let libraryVendor = lib.JK_GetPassThruLibraryVendor(i);
    	let libraryPath = lib.JK_GetPassThruLibraryPath(i);
    	console.log(`library name is ${libraryName}`);
    	console.log(`library vendor is ${libraryVendor}`);
    	console.log(`library path is ${libraryPath}`);
    	let loadErrorMsg = ref.alloc('string');
    	lib.JK_PassThruLoadLibrary(i,loadErrorMsg);
    	let loadMsg = loadErrorMsg.deref();
    	let isLoadLibrary = loadMsg?'Fault':'Success';
    	console.log(`Load Library ${isLoadLibrary}`);
    	let unLoadErrorMsg = ref.alloc('string');
    	lib.JK_PassThruUnLoadLibrary(i,unLoadErrorMsg);
    	let unLoadMsg = unLoadErrorMsg.deref();
    	let isUnLoadLibrary = unLoadMsg?'Fault':'Success';
    	console.log(`Load Library ${isUnLoadLibrary}`);
    	console.log(`================================== library ${i} end ==================================`);
    }
    lib.JK_DeInitial();
    return ctx.body = {
        status: 200
    }
});

app.use(router.routes())
    .use(router.allowedMethods());

let server = app.listen(3000, '0.0.0.0', ()=> {
    console.log('app listening at 3000');
});