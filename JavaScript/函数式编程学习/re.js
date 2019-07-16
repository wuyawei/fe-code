// 这是一个影片出租店用的程序，计算每一位顾客的消费金额并打印详单。
// 操作者告诉程序：顾客租了哪些影片、租期多长，程序边根据租赁时间和影片类型算出租费用。
// 影片分为两类：喜剧片和悲剧片。
// 除了计算费用，还要为常客计算积分，积分会根据租片种类是否为新片而有不同。
// 新增功能：
// 需要输出html，用于网页展示。

function statement (invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD",
            minimumFractionDigits: 2 }).format;
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = 0;
        switch (play.type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`unknown type: ${play.type}`);
        }
        // add volume credits
        // 添加信用点
        volumeCredits += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        // 每10部喜剧添加1个额外信用点
        if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
        // print line for this order
        // 打印订单行
        result += ` ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    result += `Amount owed is ${format(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}


// test data
const plays = {
    "hamlet": {
        "name": "Hamlet",
        "type": "tragedy"
    },
    "as-like": {
        "name": "As You Like It",
        "type": "comedy"
    },
    "othello": {
        "name": "Othello",
        "type": "tragedy"
    }
};

const invoices = [{
    "customer": "BigCo",
    "performances": [{
        "playID": "hamlet",
        "audience": 55
    }, {
        "playID": "as-like",
        "audience": 35
    }, {
        "playID": "othello",
        "audience": 40
    }]
}];

 statement(invoices[0], plays);

/*
Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
*/