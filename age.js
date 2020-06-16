'use strict';
const fs = require('fs')
const readline = require('readline');
const rs = fs.createReadStream('./member.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });

//key: 氏名, value: データのオブジェクト
const memberDataMap = new Map();

// 今日の日付を取得
const today = new Date();
const thisYear = today.getFullYear().toString().padStart(4, '0');
const thisMonth = (today.getMonth() + 1).toString().padStart(2, '0');
const thisDate = today.getDate().toString().padStart(2, '0');

rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const name = columns[0];
    const status = columns[6];
    //if (name !== "氏名" && status === "在籍") {
    if (name !== "氏名") {


        //年/月/日ごとに配列に格納する
        const birthday = columns[1].split('/');

        //年、月、日をDateインスタンスに変換
        const birthDate = new Date(birthday[0], birthday[1] - 1, birthday[2]);

        //文字列に分解し、ゼロ埋め
        const year = birthDate.getFullYear().toString().padStart(4, '0');
        const month = (birthDate.getMonth() + 1).toString().padStart(2, '0');
        const date = birthDate.getDate().toString().padStart(2, '0');

        //引き算
        const age = Math.floor((Number(thisYear + thisMonth + thisDate) - Number(year + month + date)) / 10000);

        let value = memberDataMap.get(name);
        if (!value) {
            value = {
                bd: columns[1],
                ag: age
            };
        }
        memberDataMap.set(name, value);
    }
});

rl.on('close', () => {

    // 年齢でソート
    const ageArray = Array.from(memberDataMap).sort((pair1, pair2) => {
        //降順
        return pair2[1].ag - pair1[1].ag;
    });

    // 整形して出力
    const ageStrings = ageArray.map(([key, value], i) => {
        return (i + 1) + '位' + key + ' 生年月日:' + value.bd + ' ' + value.ag + '歳';
    });

    console.log(ageStrings);
});
