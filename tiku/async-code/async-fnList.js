/*
 * 有一个 函数数组，里面可能是同步，也可能是异步的 Promise，
 * 怎么保持顺序执行并且让前一个函数的返回值作为后一个函数执行的参数。
 */

const run0 = async (list, result) => {
  for (let i = 0; i < list.length; i++) {
    const fn = list[i];
    result = await fn(result);
  }
  console.log("run -> result", result);
  return result;
};

const run1 = (list) => {
  let index = 0;
  let result;
  const eva = (i, result) => {
    const fn = Promise.resolve(list[i](result));
    fn.then((r) => {
      console.log("eva -> r", r, i);
      if (i >= list.length - 1) return;
      eva(++i, r);
    });
  };
  eva(index);
};

const run2 = (list) => {
  let p = Promise.resolve();
  list.forEach((fn) => {
    p = p.then((r) => fn(r));
  });
  p.then((r) => {
    console.log("r", r);
  });
};

const excute = (list) => {
  let p = Promise.resolve();
  list.forEach((fn) => {
    p = p.then(async (a) => {
      return await fn(a);
    });
  });
  p.then((r) => {
    console.log("r", r);
  });
};

const fnList = [
  () => 1,
  async (p) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    return p + 2;
  },
  (p) => p + 2,
  (p) => Promise.resolve(p + 3),
  (p) => Promise.resolve(p + 4),
  (p) => p + 5,
  (p) => p,
];

// run(fnList)
excute(fnList);
