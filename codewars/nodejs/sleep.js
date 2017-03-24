var sleep = function(time) {
    return new Promise(function(rs, rj){
        setTimeout(function () {
            rs("slept");
        }, time);
    })
}

var start = async function () {
    console.log('start');
    console.log(await sleep(2000));
    console.log('end');
}

start();