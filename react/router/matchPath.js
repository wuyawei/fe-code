import pathToRegexp from "path-to-regexp";

const compilePath = (path, options) => {
    // 生成路由规则 path 的正则表达式
    // 记录动态路由参数
    const keys = [];
    const regexp = pathToRegexp(path, keys, options);
    const result = { regexp, keys };
    return result;
}

const matchPath = (pathname, options = {}) => {
    // 用于统一匹配多个 path
    if (typeof options === "string" || Array.isArray(options)) {
        options = { path: options };
    }
    // exact 全匹配  strict 末尾斜杠是否精确匹配 sensitive 区分大小写
    const { path, exact = false, strict = false, sensitive = false } = options;
    const paths = [].concat(path);
    return paths.reduce((matched, path) => {
        if (!path && path !== "") return null;
        // 多个 path , 有一个命中就停止
        if (matched) return matched;
        // keys 匹配到的动态参数，如 /:id
        const { regexp, keys } = compilePath(path, {
            end: exact,
            strict,
            sensitive
        })
        // 匹配当前路由
        const match = regexp.exec(pathname);
        if (!match) return null; // 没有匹配到
        const [url, ...values] = match;
        const isExact = pathname === url;
        if (exact && !isExact) return null; // 非全匹配
        return {
            path,
            url,
            isExact,
            params: keys.reduce((memo, value, index) => {
                // 组合路由动态参数
                // {id: '123'...}
                memo[value.name] = values[index];
                return memo;
            }, {})
        }
    }, null)
}

export default matchPath;