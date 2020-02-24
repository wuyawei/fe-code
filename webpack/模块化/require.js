const factories = {};
const _require = (deps, factor) => {
    const _deps = [];
    deps = deps.map(dep => factories[dep]());
    factor.apply(null, deps);
}
const define = (name, deps, factor) => {
    const _deps = [];
    deps.forEach((dep, i) => _require([dep], (d) => {
        _deps[i] = d;
    }));
    factories[name] = factor.bind(null, ..._deps);
}
define('name', [], () => {
    return 'zs';
});
define('age', [], () => {
    return 18;
});
define('say', ['name', 'age'], (name, age) => {
    return () => {console.log(`我的名字是${name}, 今年${age}`)};
});
_require(['say'], (say) => {
    say();
})