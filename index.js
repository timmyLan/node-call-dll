var ffi = require('ffi');
var libfactorial = ffi.Library('./libfactorial', {
    'factorial': ['uint64', ['int']]
});
var output = libfactorial.factorial(5);
console.log('output',output);
