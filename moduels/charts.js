const { default: axios } = require("axios");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { existsSync } = require("fs");
const { writeFile } = require("fs").promises;
const { logger } = require("./logger");

async function makeStatsChart(dates = [], rps = [], discordID) {
	try {
		const exists = existsSync(`./temp/history_${discordID}.png`);

		if (exists) {
			return `./temp/history_${discordID}.png`;
		}
		else {
			const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 400, backgroundColour: "#36393f", plugins: { modern: ["chartjs-plugin-annotation"] } });
			const averageRP = (await axios.get("http://192.168.0.13:1290/stats")).data.DB.users.averageRP;
			const config = {
				type: "line",
				data: {
					labels: dates,
					datasets:[
						{
							label: "RP",
							backgroundColor: "rgba(44,47,51,0)",
							borderColor: "rgb(277,166,0)",
							data: rps,
						},
					],
				},
				options:{
					fontSize: 50,
					plugins: {
						annotation: {
							annotations: [
								{
									adjustScaleRange: false,
									type: "line",
									borderColor: "black",
									borderDash: [10],
									borderWidth: 2,
									scaleID: "y",
									value: averageRP,
									label: {
										backgroundColor: "rgba(0,0,0,0.2)",
										content: "Average RP in bot: " + averageRP,
										enabled: true,
									},
								},
								{
									adjustScaleRange: false,
									type: "line",
									borderColor: "#a97142",
									borderDash: [5],
									borderWidth: 2,
									scaleID: "y",
									value: 1000,
									label: {
										backgroundColor: "rgba(0,0,0,0.2)",
										content: "Bronze",
										enabled: true,
									},
								},
								{
									adjustScaleRange: false,
									type: "line",
									borderColor: "#d8d8d8",
									borderDash: [5],
									borderWidth: 2,
									scaleID: "y",
									value: 3000,
									label: {
										backgroundColor: "rgba(0,0,0,0.2)",
										content: "Silver",
										enabled: true,
									},
								},
								{
									adjustScaleRange: false,
									type: "line",
									borderColor: "#d4af37",
									borderDash: [5],
									borderWidth: 2,
									scaleID: "y",
									value: 5400,
									label: {
										backgroundColor: "rgba(0,0,0,0.2)",
										content: "Gold",
										enabled: true,
									},
								},
								{
									adjustScaleRange: false,
									type: "line",
									borderColor: "#00b7db",
									borderDash: [5],
									borderWidth: 2,
									scaleID: "y",
									value: 8200,
									label: {
										backgroundColor: "rgba(0,0,0,0.2)",
										content: "Platinum",
										enabled: true,
									},
								},
								{
									adjustScaleRange: false,
									type: "line",
									borderColor: "#003de6",
									borderDash: [5],
									borderWidth: 2,
									scaleID: "y",
									value: 11400,
									label: {
										backgroundColor: "rgba(0,0,0,0.2)",
										content: "Diamond",
										enabled: true,
									},
								},
								{
									adjustScaleRange: false,
									type: "line",
									borderColor: "#b103fc",
									borderDash: [5],
									borderWidth: 2,
									scaleID: "y",
									value: 15000,
									label: {
										backgroundColor: "rgba(0,0,0,0.2)",
										content: "Masters",
										enabled: true,
									},
								},
							],
						},
					},
					scales:{
						y:{
							ticks: {
								stepSize: 500,
							},
						},
					},
				},
			};
			const imageBuffer = await chartJSNodeCanvas.renderToBuffer(config, "image/png");
			await writeFile(`./temp/history_${discordID}.png`, imageBuffer);
			logger.info("User history image written to disk!", { module: "canvas", discordID: discordID });
			return `./temp/history_${discordID}.png`;
		}
	}
	catch (error) {
		return logger.error(new Error(error), { module: "canvas", discordID: discordID });
	}

	/*
	const chart = `https://image-charts.com/chart.js/2.8.0?bkg=rgb(54,57,63)&c={type:'line',data:{labels:[${_labels.map(function(ele) {return "'" + ele + "'";})}],datasets:[{backgroundColor:'rgba(44,47,51,0)',borderColor:'rgb(277,166,0)',data:[${_data}],label:'RP'}]},options:{scales:{yAxes:[{ticks:{stepSize: 200}}]}}}`;
	return encodeURI(chart);
	*/

}

module.exports = {
	makeStatsChart,
};