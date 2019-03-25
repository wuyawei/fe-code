let ironman = {
    hobbies: ['1', '23', '56']
}
let ironmanProxy = new Proxy(ironman.hobbies, {
    set (target, property, value) {
        target[property] = value
        console.log('change....', property, value)
        return true
    }
})

ironmanProxy.push('wine')
console.log(ironman.hobbies)