// const createTrafficLight = () => {
    // const light = {
    //     lightUp(color) {
    //         console.log("lightUp -> color", color);
    //         return this;
    //     },
    //     wait(time){
    //         let pre = Date.now();
    //         while(Date.now() - pre <= time) {};
    //         return this;
    //     }
    // }
    // return () => light;
// }
// const trafficLight = createTrafficLight();
// trafficLight().lightUp('red').wait(2000).lightUp('yellow').wait(1000).lightUp('green')

const parseToMoney = (num) => {
    let [start, end] = (num+'').split('.');
    end = end && end.slice(0, 3);
    end = end ? '.'+end : ''
    let str = '';
    let index = 1;
    for(let i = start.length - 1; i >= 0; i--) {
        str = start[i] + str;
        if(index % 3 === 0 && i !== 0) str = ','+str;
        index++;
    } 
    console.log("parseToMoney -> str +  end", str +  end)
    return str +  end;
}
parseToMoney(1234.56); // return '1,234.56'
parseToMoney(123456789); // return '123,456,789'
parseToMoney(1087654.321); // return '1,087,654.321'
parseToMoney(1087654.14159); // return '1,087,654.141'

const delay = time => new Promise((resolve, reject) => {
    setTimeout(resolve, time);
})
const createTrafficLight = () => {
    const light = {
        queue: [],
        lightList: [],
        pending: false,
        run() {
            const fn = this.queue.shift();
            if(fn && !this.pending) {
                this.pending = true;
                fn().then(() => {
                    const excute = this.lightList.shift();
                    excute && excute();
                    this.pending = false;
                    this.run();
                })
            }
            if(!fn) {
                const excute = this.lightList.shift();
                excute && excute();
            }
        },
        lightUp(color) {
            this.lightList.push(() => {
                console.log("lightUp -> color", color);
            });
            if(!this.pending) {
                this.run();
            }
            return this;
        },
        wait(time){
             this.queue.push(() => delay(time));
             return this;
        }
    }
    return () => light;
}
const trafficLight = createTrafficLight();
// trafficLight().lightUp('red').wait(2000).lightUp('yellow').wait(1000).lightUp('green')

