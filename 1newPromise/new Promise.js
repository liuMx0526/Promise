// 引入自己实现的promise
let Promise = require('./Promise')

// new Promise时，需要传递传递一个executor执行器，这个执行器会立刻执行
// 这个执行器中传递两个参数：resolve和reject
// resolve(成功)和reject(失败)是两个函数
// 调用这两个函数都可以传入一个值，分别时成功的值，和失败的原因
// promise的状态有三个：pending等待 resolve成功 reject失败
// 只能冲pending转到成功或是失败
let p = new Promise((resolve, reject) =>{
  // resolve('success')
  reject('失败了')
})

// 每个promise实例都有then方法
// then方法传递两个参数，onFulfilled一个是成功， onRejected一个是失败
// 调用then时，发现已经成功，会调用成功函数执行，并把成功的内容但在参数传递到函数中
// 如果发现失败，会调用失败函数执行，并把失败的原因传递到函数中
p.then((value) =>{
  console.log(value)
},(reason) => {
  console.log('err ' + reason)
})