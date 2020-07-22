const delay = timeout => new Promise((resolve, reject) => setTimeout(resolve, timeout));
const onChange = () => {
    let f = 0;
    let queue = [];
    return function (time) {
        const i = f++;
        queue.push(i);
        delay(time).then(() => {
            if (queue.includes(i)) {
                console.log('fffff', i);
            }
        }).finally(() => {
            queue = queue.filter(v => v > i);
        });
    };
};

const change = onChange();

async function run() {
    change(500);
    await delay(100);
    change(100);
    await delay(50);
    change(300);
}
// run();
// change(500);
// change(100);
// change(100);
// change(100);
