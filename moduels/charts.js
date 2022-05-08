function makeStatsChart(_labels = [], _data = []) {
	const chart = `https://image-charts.com/chart.js/2.8.0?bkg=rgb(54,57,63)&c={type:'line',data:{labels:[${_labels.map(function(ele) {return "'" + ele + "'";})}],datasets:[{backgroundColor:'rgba(44,47,51,0)',borderColor:'rgb(277,166,0)',data:[${_data}],label:'RP'}]},options:{scales:{yAxes:[{ticks:{stepSize: 200}}]}}}`;
	return encodeURI(chart);
}

module.exports = {
	makeStatsChart,
};