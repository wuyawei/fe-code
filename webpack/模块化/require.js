const factories = {};
const _require = (deps, factor) => {
    const _deps = factories[deps]._deps;
    _deps.forEach((dep, i) => _require([dep], (d) => {
        _deps[i] = d;
    }));
    deps = deps.map(dep => factories[dep](..._deps));
    factor.apply(null, deps);
}
const define = (name, deps, factor) => {
    factories[name] = factor;
    factories[name]._deps = deps;
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