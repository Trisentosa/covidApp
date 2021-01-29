const prevCharts = [];
function makeChart(chartID, observed, title, graphColor) {
    let dates = Object.keys(historicalData.timeline[observed]);
    const nums = () => {
        let numArr = []
        dates.forEach(date => {
            numArr.push(historicalData.timeline[observed][date]);
        })
        return numArr;
    }
    const numsToPmf = (set) => {
        let numArr = [];
        for (let i = 1; i < set.length; i++) {
            numArr.push(set[i] - set[i - 1]);
        }
        return numArr;
    }
    const cdf = nums();
    const pmf = numsToPmf(cdf);
    let newOrTotal = ()=>{
        if(user.type === 'New Cases'){
            return pmf;
        }else{
            return cdf;
        }
    }
    let datas = newOrTotal();
    dates = dates.slice(0, user.days);
    datas = datas.slice(0, user.days);
    dates.pop();
    const ctx = document.getElementById(chartID).getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: title,
                data: datas,
                fill: false,
                backgroundColor: graphColor,
                borderColor: graphColor,
                borderWidth: 1,
                lineTension: 0.5
            }]
        },
        options: {
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white',
                    fontSize: 16
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: 'rgba(256,256,256,0.5)',
                        fontSize: 14
                    },
                }],
                xAxes: [{
                    ticks: {
                        fontColor: 'rgba(256,256,256,0.5)',
                        fontSize: 14
                    },
                }],
            }
        }
    });
    prevCharts.push(myChart);
}

function init(){
    if(prevCharts.length>0){
        prevCharts.forEach(chart=>{
            chart.destroy();
        })
    }
    makeChart('casesChart', 'cases', 'Number of Cases', 'white');
    makeChart('deathsChart', 'deaths', 'Number of Deaths', '#DC3B02');
    makeChart('recoveredChart', 'recovered', 'Number of Recovered', '#23D300');
}

init();
