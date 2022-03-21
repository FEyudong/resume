// const { reject } = require("./Promise/Promise");

function promise1() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('1');
      }, 1000);
    });
  }
  
  function promise2(value) {
    return new Promise((resolve,reject) => {
      setTimeout(() => {
        reject('value:' + value);
      }, 1000);
    });
  }
  
  function* readFile() {
      try {
        const value = yield promise1();
        const result = yield promise2(value);
        return result;
      } catch (error) {
          console.log(error)
      }
  }
  const it = readFile();
  const res1 = it.next();
  res1.value.then((data)=>{
    const res2 = it.next(data)
    res2.value.then((data)=>{
        console.log(data) // value:1
    },(reason)=>{
        console.log(reason)
    })
  })