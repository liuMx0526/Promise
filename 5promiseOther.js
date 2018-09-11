// 引入自己实现的promise
let Promise = require('./Promise')

// 直接调用promise的resolve
let p1 = Promise.resolve('成功')
p1.then(data => {
  console.log(data) // 成功
})

// 直接调用promise的reject
let p2 = Promise.reject('失败')
p2.then(null, err => {
  console.log(err) // 失败
})

// catch捕获异常
p1.then(() => {
  console.log('p1 then')
  throw new Error();
}).catch(err => {
  console.log('catch ' + err);
})
//结果：
// p1 then
// catch Error