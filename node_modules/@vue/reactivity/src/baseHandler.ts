export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    if (key === "__v_isReactive") {
      return true; // 标记当前对象已经是响应式的了
    }
    // 当取值的时候应该让响应式属性和effect关联起来
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    return Reflect.set(target, key, value, receiver);
  },
};
