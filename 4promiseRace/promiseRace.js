// 引入自己实现的promise
let Promise = require('./Promise')

// 要么全部成功，返回执行完最快的结果
let p = [
  new Promise((resolve, reject) => resolve(1)),
  new Promise((resolve, reject) => resolve(2))
]
Promise.race(p).then(res => {
  console.log('success ' + res) // success 1或success 2 哪个执行完成的快返回哪个结果
})

// 要么就失败
let p1 = [
  new Promise((resolve, reject) => reject(1)),
  new Promise((resolve, reject) => resolve(2))
]
Promise.race(p1).then(res => {
  console.log('success' + res)
},err => {
  console.log('err'); // err
})