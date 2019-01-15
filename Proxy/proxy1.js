let ironman = {
    hobbies: ['1', '23', '56']
}
let ironmanProxy = new Proxy(ironman.hobbies, {
    set (target, property, value) {
        console.log(property)
        target[property] = value
        console.log('change....')
        return true
    }
})

ironmanProxy.push('wine')
console.log(ironman.hobbies)