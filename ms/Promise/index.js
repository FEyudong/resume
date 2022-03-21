const Promise = require('./Promise');
// 简单同步用例
const p = new Promise((resolve,reject)=>{
   setTimeout(()=>{
     resolve('ok');
    //  reject('error');
   },1000)
})
p.then((data)=>{
   return new Promise((resolve,reject)=>{
    setTimeout(()=>{
        reject('0k1')
    })
   })
}).then((data)=>{
    // console.log(data)
}).catch((e)=>{
    console.log(e)
})