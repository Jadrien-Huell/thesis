// import { gameInfo } from "./main";

let categories = [null, '[Category 1]', '[Category 2]', '[Category 3]']

Highcharts.chart('nba-team-stat', {
    data: {
        /**!
         * Change these values
         */
        columns: [
            //[null /*! Do not remove null */, '[Category 1]', '[Category 2]', '[Category 3]'], // categories
            [null, '[Category A]', '[Category B]', '[Category C]'],
            ['[Team Name 1]', 1, 4, 3], // first series
            ['[Team Name 2]', 5, 4, 2] // second series
        ]
    },
    chart: {
        type: 'column',
        borderRadius: 5,
    },
    title: {
        text: 'Statistics Comparison'
    },
    subtitle: {
        text: ''
    },
    tooltip: {
        headerFormat: '<b><span style="font-size:12px">{series.name}</span></b></br>',
        pointFormat: '<b>{point.percentage}</b> <span style="color:{point.color}">{point.name}</span></br>',
        backgroundColor: 'rgba(0, 0, 0, .75)',
        borderWidth: 2,
        style: {
            color: '#CCCCCC'
        }
    },
    xAxis: {
        type: 'category',
        title: {
            text: ''
        },
        accessibility: {
            description: 'Shot Percentages' //May need revision
        }
    },
    yAxis: {
        allowDecimals: false,
        title: {
            text: 'Performance'
        },
        accessibility: {
            description: 'Performance Metrics' //May need revision
        }
    },
    credits : {
        enabled: false
    },
    colors: ['#1D428A', '#C8102E']
});

// export {categories}

// export function setCategories(list) {
//     const newCategories = list;
//     newCategories.push(null);
//     categories = newCategories;
// }

// document.addEventListener('DOMContentLoaded', function() {
//     console.log("Hello Data!")
// });
