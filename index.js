var ffi = require('ffi');
var libfactorial = ffi.Library('C:/Users/llan/code/node-call-dll/product', {
    'factorial': ['uint64', ['int']]
});
var output = libfactorial.factorial(5);
console.log('output',output);
