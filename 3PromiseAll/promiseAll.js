// 引入自己实现的promise
let Promise = require('./Promise')

// 要不全部成功
let p = [
  new Promise((resolve, reject) => resolve(1)),
  new Promise((resolve, reject) => resolve(2))
]
Promise.all(p).then(res => {
  console.log(res) // [1, 2]
})

// 要么就失败
let p1 = [
  new Promise((resolve, reject) => resolve(1)),
  new Promise((resolve, reject) => reject(2))
]
Promise.all(p1).then(res => {
  console.log(res)
},err => {
  console.log(err); // 2
})