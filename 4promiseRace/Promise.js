function Promise(executor) {
  let self = this
  self.status = "pending" // 状态默认为pending
  self.value = undefined   // 成功时返回的数据
  self.reason = undefined  // 失败是返回的原因
  // 有时我们并未立刻执行成功或失败，而是到了特定时候（setTimeout）才会执行成功或是失败,我们会将回调存起来
  self.onResolvedCallbacks = [] // 专门存放成功的回调
  self.onRejectedCallbacks = [] // 专门存放失败的回调
  function resolve(value) {
    if (self.status === "pending") {
      self.value = value
      self.status = "resolved"
      self.onResolvedCallbacks.forEach(fn => fn())
    }
  }
  function reject(reason) {
    if (self.status === "pending") {
      self.reason = reason
      self.status = "rejected"
      self.onRejectedCallbacks.forEach(fn => fn())
    }
  }
  try {
    executor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('循环引用'));
  }
  let called;
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then;
      if (typeof then === 'function') { 
        then.call(x, (y) => {
          if (called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject);
        }, (e) => {
          if (called) return;
          called = true;
          reject(e);
        });
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

// 参照Promise/A+规范，then方法实现
Promise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : val => val;
  onRejected = typeof onRejected === 'function' ? onRejected : err => {
    throw err;
  }
  let self = this;
  var promise2 = new Promise(function (resolve, reject) {
    if (self.status === "resolved") {
      setTimeout(function () {
        try {
          var x = onFulfilled(self.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    }
    if (self.status === "rejected") {
      setTimeout(function () {
        try {
          var x = onRejected(self.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    }
    if (self.status === "pending") {
      self.onResolvedCallbacks.push(function () {
        setTimeout(function () {
          try {
            var x = onFulfilled(self.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      });

      self.onRejectedCallbacks.push(function () {
        setTimeout(function () {
          try {
            var x = onRejected(self.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      });
    }
  });

  return promise2;
}

// promises 传入多个promise的一个Array 
Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    // 存放返回结果
    let results = []
    // 存放返回结果的个数，因为promise为异步，无法用数组长度确定
    let i = 0
    // 处理返回结果顺序，并记录返回结果数量
    function processData(index, data) {
      results[index] = data; // let arr = []  arr[2] = 100
      if (++i === promises.length) {
        resolve(results);
      }
    }
    for (let i = 0; i < promises.length; i++) {
      let p = promises[i];
      p.then((data) => { // 成功后把结果和当前索引 关联起来
        processData(i, data);
      }, reject);
    }
  })
}

// promises 传入多个promise的一个Array 
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      let p = promises[i];
      p.then(resolve, reject);
    }
  })
}

// Promise 导出
module.exports = Promise;
