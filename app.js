'use strict';

const fs = require('fs');
const readline = require('readline');

const rs = fs.createReadStream('./popu-pref.csv');

const rl = readline.createInterface({'input': rs, 'output': {} });

/* rl.on('line', (linestring) => {
    console.log(linestring);
}); */

const table = new Map();

rl.on('line', (inputData) => {

    const columns = inputData.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const population = parseInt(columns[2]);

    if (year === 2010 || year === 2015) {

        /* console.log(year);
        console.log(prefecture);
        console.log(population); */

        let value = table.get(prefecture);

        if (!value) {
            value = {
                populationOf2010: 0,
                populationOf2015: 0,
                ratio: null
            };
        }

        if (year === 2010) value.populationOf2010 = population;

        if (year === 2015) value.populationOf2015 = population;

        table.set(prefecture, value);

    }

});

rl.on('close', () => {

    // console.log(table);

    for (let [key, value] of table) {
        value.ratio = value.populationOf2015 / value.populationOf2010;
    }

    // console.log(table);

    const tableToArray = Array.from(table);

    const ranking = tableToArray.sort((first, second) => {
        return second[1].ratio - first[1].ratio;
    });

    // console.log(ranking);

    const shapedRanking = ranking.map(([key, value]) => {
        return key + ': ' + value.populationOf2010 + '=>' + value.populationOf2015 + ' 変化率:' + value.ratio;
    });

    console.log(shapedRanking);

});