// 定义：是将接受多个参数的函数变换成可以单个参数分批传入的函数
// 原理：通过闭包保留已传入的参数，参数不够就继续返回一个函数，直到参数传完整后调用执行。
// 作用：可以将函数的某些参数值固化下来

// 比如一个网络请求方法的封装
// 1. 先有一个基础的api
const request = (method, url, body) => {
    // 具体实现省略...
}
// 大家知道网络请求就是那几种，最常用的就是get&post。
// 但每次调用此方法，都需要这样
request('get', 'url1', { a: 1 })
request('post', 'url2', { b: 2 })
// 每次发请求，都需要传method，比较麻烦且有拼写错误的概率,所以就可以将这个参数固化下来
// 2. 固化method参数,提供更方便的get、post方法
const get = (url, body) => {
    return request('get', url, body)
}
const post = (url, body) => {
    return request('post', url, body)
}
// 接下来，就可以这样方便的调用了
get('url1', { a: 1 })
post('url2', { a: 1 })

// 再举一个例子
// 一个基础的检测数据的方法，接受值val、类型type两个参数
// const isType = (val,type)=>{
//     return Object.prototype.toString.call(val) === `[object ${type}]` 
// }
// 用法是这样的
// isType(1,"Number")
// isType(2,"String")
// 但js中的数据类型也就固定的那几个。所以type参数是可以固化下来的,接下来改造一下isType函数
// const isType = (type)=>{
//     return (val)=>{
//         return Object.prototype.toString.call(val) === `[object ${type}]` 
//     }
// }
// const isArray = isType('Array')
// const isString = isType('String')
// const isNumber = isType('Number')

// console.log(isArray([1,2]))
// console.log(isString(111))

// 但以上这些对参数的处理方式，都不够通用，调用次数首先只有两次,对固定参数的处理也缺乏一定的灵活性
// 比如，应对下边的参数求和场景就很吃力了
// 此求和函数改造成参数分批传入，一旦参数个数传完整时（==5）时，就立即进行求和计算
const sum = (a, b, c, d, e) => {
    return a + b + c + d + e
}
// 终于在自己的不懈努力下，端出了一碗香喷喷的意大利面条
// const sum = (a)=>{
//         return (b)=>{
//             return (c)=>{
//                 return (d)=>{
//                     return (e)=>{
//                         return a + b + c + d + e
//                     }
//                 }
//             }
//         }
// }
// 实现一个适应多参数场景的通用柯里化参数
// const curring = (fn,argArr = [])=>{
//     const argLen = fn.length;
//     return (...args)=>{
//         argArr.push(...args)
//         if(argArr.length < argLen){
//             return curring(fn,argArr)            
//         }else{
//             return fn(...argArr)
//         }
//     }
// }
// console.log(curring(sum)(1)(2)(3)(4)(5))
// 但这版实现里的递归收集参数部分实现有点问题，因为curring本身只需要一个fn参数，多出来的argArr参数，只是向作为一个可以保存住的内部变量使用，完全可以用闭包解决
// const curring = (fn) => {
//     const argLen = fn.length;
//     const argArr = [];
//     const callFn = (...args) => {
//         argArr.push(...args)
//         if (argArr.length < argLen) {
//             return callFn
//         } else {
//             return fn(...argArr)
//         }
//     }
//     return callFn
// }
// console.log(curring(sum)(1)(2)(3)(4)(5))
// 结束
