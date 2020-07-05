// AMD 规范 RequireJS
// CMD 规范 SeaJS
// ES6 export/import
const factories = {};
const _require = (deps, factor) => {
    depsFn = deps.map(dep => {
        const _deps = factories[dep]._deps;
        _deps.forEach((_dep, i) => _require([_dep], (d) => {
            _deps[i] = d;
        }));
        return factories[dep].apply(null, _deps);
    });
    factor.apply(null, depsFn);
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
_require(['name', 'age', 'say'], (name, age, say) => {
    console.log("name", name);
    console.log("age", age);
    say();
})