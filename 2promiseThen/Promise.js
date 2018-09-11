function Promise(executor) {
  let self = this
  // 前面我们提到，promise有三个状态，初始状态为pending
  self.status = "pending" // 状态默认为pending
  self.value = undefined   // 成功时返回的数据
  self.reason = undefined  // 失败是返回的原因
  // 有时我们并未立刻执行成功或失败，而是到了特定时候（setTimeout）才会执行成功或是失败,我们会将回调存起来
  self.onResolvedCallbacks = [] // 专门存放成功的回调
  self.onRejectedCallbacks = [] // 专门存放失败的回调
  // 异步操作执行成功后的回调函数
  function resolve(value) {
    // Promise的状态只能是pending -> resolved 和 pending -> rejected
    // resolve
    if (self.status === "pending") {
      self.value = value
      self.status = "resolved"
      self.onResolvedCallbacks.forEach(fn => fn())
    }
  }
  // 异步操作执行失败后的回调函数
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
  // 防止promise自己调用自己
  if (promise2 === x) {
    return reject(new TypeError('循环引用'));
  }
  // 这个方法是处理所有promise的实现
  let called; // 用来防止多次调用
  // 判断x是
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then;
      if (typeof then === 'function') { // then为一个方法 暂且的认为是promise
        // 让返回的这个x 也就是返回的promise执行用他的状态让promise2成功或者失败
        // 因为这里还涉及到别人promise 有的人写的promise 会成功还会调用失败
        then.call(x, (y) => {
          if (called) return;
          called = true;
          // 如果y 是promise 递归解析 直到返回为普通值为止
          resolvePromise(promise2, y, resolve, reject);
        }, (e) => {
          if (called) return;
          called = true;
          reject(e);
        });
      } else { // x就是一个普通值 (就用这个值让返回的promise成功即可)
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
  // onFulfilled / onRejected是一个可选的参数
  onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : val => val;
  onRejected = typeof onRejected === 'function' ? onRejected : err => {
    throw err;
  }
  let self = this;
  // 返回新的 Promise，Promise/A+规范中规定这个 Promise 实例叫 promise2
  var promise2 = new Promise(function (resolve, reject) {
    // 如果成功调用成功的函数，并将结果返回
    if (self.status === "resolved") {
      // 在 Promise 执行 resolve 或 renject 为异步
      setTimeout(function () {
        try {  // 捕获异步的异常
          // onFulfilled 执行完返回值，x 为成功回调的返回值
          var x = onFulfilled(self.value);
          // 处理返回值方法
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    }
    // 如果失败调用失败的函数，并将失败的原因返回
    if (self.status === "rejected") {
      setTimeout(function () {
        try {
          // onRejected 执行完返回值，x 为失败回调的返回的原因
          var x = onRejected(self.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    }

    // 将 then 的执行程序存储在实例对应的 onResolvedCallbacks 或 onRejectedCallbacks 中
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

// Promise 导出
module.exports = Promise;
