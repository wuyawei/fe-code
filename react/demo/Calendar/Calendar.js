import React, { useState, useEffect } from 'react';

const {log} = console;
const WEEKS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_STATE = [
    ''
]
const DATA = {
    year: '',
    month: '',
    daysList: []
}

function chunk(arr,size){ // 切割数组为指定长度的数组组成的二维数组
    var size = size || 1;
    // 
    var result = [];

    var len = arr.length; //数组的长度
    var s = Math.ceil(len/size)//  假如我们有长度为10的数组，size传入的是3，是要分成4个自数组的。
    for(var i =0;i<s;i++){
      result[i] = arr.slice(size*i,size*(i+1))
    }
    return result
}

function getMonthDays(year, month) { // 获取某月有多少天
    return new Date(year, month, 0).getDate();
}

function initCalendar(y, m) { // 初始化日历数据
    let date = new Date();
    let year = y || date.getFullYear(); // 本年
    let month = m || date.getMonth() + 1; // 本月
    let prevMonth = month + -1; // 上一月
    let prevYear = year; // 上一年
    if (prevMonth < 1) {
        prevMonth = 12;
        prevYear -= 1;
    }
    log(y, m);
    let currMonthDays = getMonthDays(year, month); // 本月总天数
    let prevMonthDays = getMonthDays(prevYear, prevMonth); // 上月总天数
    let firstWeek = new Date(year, month - 1, 1).getDay(); // 本月第一天是周几
    let list = []; // 展示月日期数组
    for (let i = 0; i < currMonthDays + firstWeek; i++) {
        if (i < firstWeek) { // 开头补齐上月结束日期
            list.push(prevMonthDays - (firstWeek - 1 - i));
        } else {
            list.push(i - firstWeek + 1);
        }
    }

    let daysList = chunk(list, 7); // 切割为长度为7的二维数组
    let len = daysList.length;
    let to = 7 - daysList[len - 1].length; // 得出本月最后一周剩余空位

    // 循环尾部补下月开始日期
    for (let i = 0; i < to; i++) {
        daysList[len - 1].push(i + 1);
    }
    return {
        year,
        month,
        daysList
    }
}

function Calendar() {
    const [calendarData, setCalendarData] = useState(DATA);
    useEffect(() => {
        setCalendarData(initCalendar());
    }, [])

    function handlePrevMonth() { // 上月
        let prevMonth = calendarData.month - 1;
        let prevYear = calendarData.year;
        if (prevMonth < 1) {
            prevMonth = 12;
            prevYear -= 1;
        }
        setCalendarData(initCalendar(prevYear, prevMonth));
    };

    function handleNextMonth() { // 下月
        let nextMonth = calendarData.month + 1;
        let nextYear = calendarData.year;
        if (nextMonth > 12) {
            nextMonth = 1;
            nextYear += 1;
        }
        setCalendarData(initCalendar(nextYear, nextMonth));
    };

    const {
        month,
        daysList
    } = calendarData;

    return (
        <div className='kool-Calendar'>
          <header>
                <span onClick={ handlePrevMonth }>{'<'}</span>
                <span>{month}</span>
                <span onClick={ handleNextMonth }>></span>
          </header>
          <table>
            <tbody>
              <tr>
                {WEEKS.map((el, i) => (
                  <th key={i}>{el}</th>
                ))}
              </tr>
              {daysList.map((el, i) => {
                return (
                  <tr key={i}>
                      {el.map((v, j) => <td key={j}>{v}</td>)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
    );
}

export default Calendar;