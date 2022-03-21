// 需求： 如何中断一个promise？
// 首先promise严格来讲，是无法被中断的。因为规范里并没有类似abort这样的状态存在，
// 一旦开始（pending），要么成功（fulfilled），要么拒绝（reject）。但有时，确实存在这样的需求，比如一个网络超时的场景中，
// 为了用户体验，耗时5秒以上的接口，默认请求失败。但请注意，这也不是“中断”，而是已决定抛弃结果了，不想再继续等待了。
// 原理就是既然不能主动控制你的失败，但是我可以安排另外的promise小伙伴“陪跑”一下,通过命令他，能够影响对方的成绩(结果)。

const Promise = require("./Promise")

// 这样就间接获得了promise状态控制的主动权。
function overTimeWarp(promise,ms = 1000){
    return Promise.race([promise,new Promise((resolve,reject)=>{
        setTimeout(()=>{
            reject('执行超时')
        },ms)
    })])
}

const p = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('ok')
    },1001)
})
// overTimeWarp(p,1000).then((data)=>{
//     console.log(data)
// }).catch((reason)=>{
//     console.log(reason)
// })

// 但这种方式封装的有点死板，只能处理超时场景，我们想获得一个通用的处理，可以通过一个api，随意控制一个promise的失败。

function abortWrap(promise){
    let abort = null
    const abortPromise = new Promise((resolve,reject)=>{
        abort = reject;
    })
    const returnPromise = Promise.race([promise,abortPromise]);
    returnPromise.abort = abort;
    return returnPromise;
}

const demo1 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('ok')
    },1500)
})
const abortAblePromise = abortWrap(demo1);
abortAblePromise.then((data)=>{
    console.log(data)
},(err)=>{
    console.log(err)
})
setTimeout(()=>{
    abortAblePromise.abort('超过1s默认失败')
},1500)

// 还有一种场景，就是中止一个promise链,
// async await语法非常容易处理这种场景，因为同步的写法可以写一个if(xxx){return xxx}即可，但假如环境不支持这种高级语法，
// 必须要使用promise的then方法中，却不是非常容易做到
// 因为promise链一旦开始，中间的promise，无论如何折腾，成功也好，失败也罢。整条链也都会按部就班的走完，
// 这也是promise链中间的错误如果未被处理，会一直向后传递的原理所在。
// 那是不是完全没有办法呢，其实是有的，不过建议慎用，就是在需要在需要的某一个then回调里，返回一个永远pending状态的promise就可以了。但要注意不要滥用，容易内存泄漏。
promise.then(()=>{
    return promise1
}).then(()=>{
    return new Promise() // 返回一个永远pending态的promise
}).then(()=>{
    return promise3
}).catch((err)=>{
    console.log('err',err)
})