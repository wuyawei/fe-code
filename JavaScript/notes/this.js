    // const a = {
    //     c: 1,
    //     b: function b() {
    //         console.log(this.c)
    //     }
    // }
    // const c = {c: 2};
    // (c.f = a.b)(); // undefined
    // c.f(); // 2
    // a.b(); // 1
    
    // const d = {
    //     b() {
    //         console.log(this)
    //     }
    // }
    // const e = {}
    // e.f = d.b;
    // e.f();
    // d.b();

    // const k = {
    //     b: () => {
    //         console.log(this)
    //     }
    // }
    // const j = {}
    // j.f = k.b;
    // j.f();
    // k.b();

    // const h = {
    //     b() {
    //         console.log(this)
    //     }
    // }
    // const i = {}
    // i.f = h.b.bind(h);
    // i.f();
    // h.b();

/* 
    1. 由 new 调用？绑定到新创建的对象。
    2. 显式绑定，由 call 或者 apply（或者 bind）调用？绑定到指定的对象。 
    3. 隐式绑定由上下文对象调用？绑定到那个上下文对象。 
    4. 默认：在严格模式下绑定到 undefined，否则绑定到全局对象。 
    5. 箭头函数根据当前的词法作用域来决定 this，具体来说，箭头函数会继承外层函数调用的 this 绑定（无论 this 绑定到什么）。
    这其实和 ES6 之前代码中的 self = this 机制一样。
*/