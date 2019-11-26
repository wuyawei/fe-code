const XLSX = require('xlsx');
const fs = require('fs');
const workbook = XLSX.readFile('./2.xlsx', {});
const sheetNames = workbook.SheetNames;
const worksheet = workbook.Sheets[sheetNames[0]];
const obj = {}
const map = {A: '学校名称（中文）', B: '学校名称（英文）', C: '学校简介', D: '地理位置', E: '世界排名', F: '专业名称', G: '专业排名', H: '专业简介', I: '专业方向', J: '申请截止日期', K: '录取/入学人数', L: '学费（年）', M: '申请费', N: '平均薪资（年）', O: '就业率', P: '全职教师', Q: '师生比例' }
for(let k in worksheet) {
    if (k.indexOf('!') === -1) {
        for (let i = 2; i < 66; i++) {
            if (k.match(/[a-zA-Z]+(\d+)/)[1] == i) {
                if(!obj[i]) {
                    obj[i] = {}
                }
                obj[i][map[k.match(/([a-zA-Z]+)/)[1]]] = worksheet[k].v
            }
        }
    }
}
fs.writeFile('./1.json', JSON.stringify(obj), { 'flag': 'a' }, function(err) {
    if (err) {
        throw err;
    }
});