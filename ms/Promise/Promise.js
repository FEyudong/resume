// 1. 先把框架搭起来，实现一个最基础的同步版本
const PENDING = 'pending';
const FULFILLED = 'fufilled';
const REJECTED = 'rejected';
function resolvePromise(x,resolve,reject){
    try {
        if(typeof x === 'object' && x !== null && x.then){
            x.then((y)=>{
                resolvePromise(y,resolve,reject);
            },(e)=>{
                reject(e)
            })
        }else{
            resolve(x)
        }
    } catch (error) {
        reject(error)
    }
}
class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onFufilledCbs = [];
        this.onRejectedCbs = [];
        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                this.onFufilledCbs.forEach((cb) => cb())
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectedCbs.forEach((cb) => cb())
            }
        }
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }
    then(onFufilled, onRejected) {
        const onFufilledCb = typeof onFufilled ==="function"?onFufilled:(r)=>r;
        const onRejectedCb = typeof onRejected === 'function'?onRejected:(e)=>Promise.reject(e);
        return new Promise((resolve,reject)=>{
            if (this.status === FULFILLED) {
                setTimeout(()=>{
                  try {
                    const x = onFufilledCb(this.value);
                    resolvePromise(x,resolve,reject)
                  } catch (error) {
                    reject(error)
                  }  
                },0)
            }
            if (this.status === REJECTED) {
                setTimeout(()=>{
                    try {
                        const x = onRejectedCb(this.reason);
                        resolvePromise(x,resolve,reject)
                    } catch (error) {
                        reject(error)
                    }
                },0)
            }
            if (this.status === PENDING) {
                this.onFufilledCbs.push(() => {
                    setTimeout(()=>{
                        try {
                            const x = onFufilledCb(this.value);
                            resolvePromise(x,resolve,reject)
                        } catch (error) {
                            reject(error)
                        }
                    },0)
                })
                this.onRejectedCbs.push(() => {
                    setTimeout(()=>{
                        try {
                            const x = onRejectedCb(this.reason);
                            resolvePromise(x,resolve,reject)
                        } catch (error) {
                            reject(error)
                        }
                    },0)
                })
            }
        })
    }
    catch(cb){
       return this.then(undefined,cb)
    }
    static all(promises){
        const result = [];
        return new Promise((resolve,reject)=>{
            promises.forEach((item)=>{
                item.then((data)=>{
                    result.push(data);
                    if(result.length === promises.length){
                        resolve(result);
                    }
                },(e)=>{
                    reject(e)
                })
            })
        })
    }
    static allSettled(promises){
        const result = [];
        return new Promise((resolve,reject)=>{
            promises.forEach((item,index)=>{
                item.then((data)=>{
                    result[index] = { status: 'fulfilled', value: data };;
                    if(result.length === promises.length){
                        resolve(result);
                    }
                },(error)=>{
                    result[index] = { status: 'rejected', reason: error };
                    if(result.length === promises.length){
                        resolve(result);
                    }
                })
            })
        })
    }
    static race(promises){
        return new Promise((resolve,reject)=>{
            promises.forEach((item)=>{
                item.then(resolve,reject)
            })
        })
    }
    static resolve(x){
        return new Promise((resolve)=>{
            resolve(x)
        })
    }
    static reject(err){
        return new Promise((resolve,reject)=>{
            reject(err)
        })
    }
}
module.exports = Promise;
