/**
 * 参数或者返回值是一个函数的函数，就可称为高阶函数。用处是为一个函数，增添某一项能力。 
 * */ 

Function.prototype.before = function(fn){
    return (...p)=>{
        fn();
        this(...p)
    }
}

function coreFn(){
    console.log('core')
}
const newFn = coreFn.before(()=>{
    console.log('before')
})
newFn()