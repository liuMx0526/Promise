function Promise(executor) {
    let self = this
    // 前面我们提到，promise有三个状态，初始状态为pending
    self.status = "pending" // 状态默认为pending
    self.value = undefined   // 成功时返回的数据
    self.reason = undefined  // 失败是返回的原因
    // 有时我们并未立刻执行成功或失败，而是到了特定时候（setTimeout）才会执行成功或是失败,我们会将回调存起来
    self.onResolved = [] // 专门存放成功的回调
    self.onRejected = [] // 专门存放失败的回调
    // 异步操作执行成功后的回调函数
    function resolve(value) {
        // Promise的状态只能是pending -> resolved 和 pending -> rejected
        // resolve
        if(self.status === "pending") {
            self.value = value
            self.status = "resolved"
            self.onResolved.forEach(fn => fn())
        }   
    }
    // 异步操作执行失败后的回调函数
    function reject(reason) {
        if(self.status === "pending") {
            self.reason = reason
            self.status = "rejected"
            self.onRejected.forEach(fn => fn())
        }   
    }
    try {
        executor(resolve, reject)
    } catch (e) {
        reject(e)
    } 
}

Promise.prototype.then = function(onFulfilled, onRejected) {
  let self = this;
  // 如果成功调用成功的函数，并将结果返回
  if (self.status === 'resolved') {
    onFulfilled(self.value);
  }
  // 如果失败调用失败的函数，并将失败的原因返回
  if (self.status === 'rejected') {
    onRejected(self.reason);
  }
  //
  if (self.status === 'pending') {
    self.onResolved.push(function () {
      onFulfilled(self.value);
    });
    self.onRejected.push(function () {
      onRejected(self.reason);
    });
  }
}

// Promise 导出
module.exports = Promise;
