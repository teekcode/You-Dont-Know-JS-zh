http://www.cnblogs.com/ziyunfei/p/6063426.html

let prints = (...str) => process.stdout.write(`${util.format.apply(null, str)}\n`);
//using let, rest param, template string & .apply(null, args)


