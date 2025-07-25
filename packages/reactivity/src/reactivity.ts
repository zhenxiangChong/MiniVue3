import { isObject } from "@vue/shared";
import { mutableHandlers } from "./baseHandler";

/*
  tip： __v_isReactive 是一个自定义的特殊属性，用于标记对象已经被代理成响应式对象，
  当访问任意属性时（不一定要是__v_isReactive），如果触发了get方法，则说明该对象被代理过了，直接返回
*/
// 用于记录代理后的结果，可以复用
const reactiveMap = new WeakMap();

function createReactiveObject(target) {
  // 不是对象直接返回
  if (!isObject(target)) {
    return target;
  }
  if (target.__v_isReactive) {
    return target; // 如果已经是响应式对象，直接返回不处理，防止重复代理
  }
  const exitsingProxy = reactiveMap.get(target);
  if (exitsingProxy) {
    return exitsingProxy;
  }
  let proxy = new Proxy(target, mutableHandlers);
  // 根据对象缓存代理后的结果
  reactiveMap.set(target, proxy);
  return proxy;
}

export function reactive(target) {
  return createReactiveObject(target);
}
