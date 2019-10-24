const hooks = (function() {
  const HOOKS = [];
  let currentIndex = 0;
  const Tick = {
      render: null,
      queue: [],
      push: function(task) {
          this.queue.push(task);
      },
      nextTick: function(update) {
          this.push(update);
          Promise.resolve(() => {
              if (this.queue.length) { // 一次渲染后，全部出栈，确保单次事件循环不会重复渲染
                  this.queue.forEach(f => f()); // 依次执行队列中所有任务
                  currentIndex = 0; // 重置计数
                  this.queue = []; // 清空队列
                  this.render && this.render(); // 更新dom
              }
          }).then(f => f());
      }
  };
  function useState(initialState) {
      HOOKS[currentIndex] = HOOKS[currentIndex] || (typeof initialState === 'function' ? initialState() : initialState);
      const memoryCurrentIndex = currentIndex; // currentIndex 是全局可变的，需要保存本次的
      const setState = p => {
          let newState = p;
          if (typeof p === 'function') {
              newState = p(HOOKS[memoryCurrentIndex]);
          }
          if (newState === HOOKS[memoryCurrentIndex]) return;
          Tick.nextTick(() => {
            HOOKS[memoryCurrentIndex] = newState;
        });
      };
      return [HOOKS[currentIndex++], setState];
  }
  function useEffect(fn, deps) {
      const hook = HOOKS[currentIndex];
      const _deps = hook && hook._deps;
      const hasChange = _deps ? !deps.every((v, i) => _deps[i] === v) : true;
      const memoryCurrentIndex = currentIndex; // currentIndex 是全局可变的
      if (hasChange) {
          const _effect = hook && hook._effect;
          setTimeout(() => {
              typeof _effect === 'function' && _effect(); // 每次先判断一下有没有上一次的副作用需要卸载
              const ef = fn();
              HOOKS[memoryCurrentIndex] = {...HOOKS[memoryCurrentIndex], _effect: ef}; // 更新effects
          })
      }
      HOOKS[currentIndex++] = {_deps: deps, _effect: null};
  }
  function useReducer(reducer, initialState) {
      const [state, setState] = useState(initialState);
      const update = (state, action) => {
          const result = reducer(state, action);
          setState(result);
      }
      const dispatch = update.bind(null, state);
      return [state, dispatch];
  }
  function useMemo(fn, deps) {
      const hook = HOOKS[currentIndex];
      const _deps = hook && hook._deps;
      const hasChange = _deps ? !deps.every((v, i) => _deps[i] === v) : true;
      const memo = hasChange ? fn() : hook.memo;
      HOOKS[currentIndex++] = {_deps: deps, memo};
      return memo;
  }
  function useCallback(fn, deps) {
      return useMemo(() => fn, deps);
  }
  return {
    Tick, useState, useEffect, useReducer, useMemo, useCallback
  }
})();