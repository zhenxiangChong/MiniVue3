export function effect(fn, options?) {
  // 创建一个响应式effect 数据变化后重新执行
  // 创建一个effect，只要依赖的属性改变就要执行回调
  const _effect = new ReactiveEffect(fn, () => {
    // scheduler
    _effect.run();
  });
  _effect.run();
}

class ReactiveEffect {
  // fn 用户编写的函数
  // 如果fn中依赖的数据变化，需要重新调用 -> run()
  constructor(public fn, public scheduler) {}
  run() {
    // 执行fn函数
    // 这里需要收集依赖
    try {
      return this.fn();
    } finally {
      // 清理依赖
      // 这里可以做一些清理工作
    }
  }
}
