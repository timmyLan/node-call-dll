var ffi = require('ffi');
var libfactorial = ffi.Library('./factorial/test.dll', {
    'factorial': ['uint64', ['int']]
});
var output = libfactorial.factorial(5);
console.log('output',output);
