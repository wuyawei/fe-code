new Promise((resolve, reject) => {
    reject(1)
}).then(r => {
    return 2;
}).finally(m => {
   console.log(m);
});

new Promise((resolve, reject) => {
    reject(1)
}).then(r => {
    return new Promise((resolve, reject) => {
        resolve(3);
    });
}).finally(m => {
    console.log(m);
});
