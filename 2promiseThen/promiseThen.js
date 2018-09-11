// 引入自己实现的promise
let Promise = require('./Promise')

// 1、每个promise实例都有then方法
let p = new Promise((resolve, reject) =>{
  resolve('success')
  // reject('error')
})
// 2、then方法传递两个参数，onFulfilled一个是成功， onRejected一个是失败
p.then((value) =>{
  // onFulfilled value为成功的结果
  console.log(value)
},(reason) => {
  // onRejected reason为失败的原因
  console.log('err ' + reason)
})
// 3、成功或失败是可选参数
p.then((value) =>{
  // onFulfilled value为成功的结果
  console.log(value)
})
// 或
p.then(null, (reason) =>{
  // onRejected reason为失败的原因
  console.log('err ' + reason)
})


/** 4、Promise.js 异步调用 resolve 或 reject */
let p = new Promise((resolve, reject) => {
  setTimeout(() => resolve(), 1000);
});
p.then(() => console.log("执行了"));


/** 5、Promise 支持链式调用 */
let p = new Promise((resolve, reject) => resolve())
// 先走第一个then的成功
p.then((data) => {
  // then 的回调如果没有返回值相当于返回 undefined
  console.log(data) // undefined
  // 如果then中出现异常 会走下一个then的失败 将错误传递到失败中
  throw new Error('then1 error')
}).then(() => {
  console.log('then2 success');
}, (err) => {
  console.log(err);
})
// 结果：
// undefined
// Error: then1 error

/** 6、如果 then 的回调中有返回值且是一个 Promise 实例
 *     则该 Promise 实例执行后成功或失败的结果传递给下一个 Promise 实例的 then 方法
 *     onFulfilled （成功的回调）或 onRejected（失败的回调）的参数
 */
let p = new Promise((resolve, reject) =>{
  resolve('success')
})
let p2 = new Promise((resolve, reject) => {
  resolve('p2 执行成功')
})
p.then(data => {
  console.log(data) // success
  return p2
}).then(data => {
  console.log(data) // p2执行成功了
}, reason => {
  console.log(reason)
})
 

/** 7、promise循环引用 */
let p1 = new Promise((resolve, reject) => resolve())
// p1的then方法回调自己
let p2 = p1.then(() => {
  return p2
})
p2.then(() => {
  console.log('success')
}, err => {
  console.log(err) // TypeError: 循环引用
}) 
