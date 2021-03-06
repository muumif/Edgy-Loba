/**
 * @file Makes charts for user and top commands.
 * @author muumif
 * @version 1.0.0
*/

const { default: axios } = require("axios");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { existsSync } = require("fs");
const { writeFile } = require("fs").promises;
const { logger } = require("./internal/logger");
/**
 * @param  {Array} dates=[]
 * @param  {Array} rps=[]
 * @param  {string} discordID User discordID
 * @return {string} The path to the file
 */
async function makeStatsChart(dates = [], rps = [], discordID) {
	try {
		const exists = existsSync(`./temp/history_${discordID}.png`);

		if (exists) {
			return `./temp/history_${discordID}.png`;
		}
		else {
			const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 400, backgroundColour: "#36393f", plugins: { modern: ["chartjs-plugin-annotation"] } });
			const config = {
				type: "line",
				data: {
					labels: dates,
					datasets:[
						{
							label: "RP",
							backgroundColor: "rgba(44,47,51,0)",
							borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
							data: rps,
						},
					],
				},
				options:{
					fontSize: 50,
					plugins: {
						annotation: {
							annotations: [
								// {
								// 	adjustScaleRange: false,
								// 	type: "line",
								// 	borderColor: "black",
								// 	borderDash: [10],
								// 	borderWidth: 2,
								// 	scaleID: "y",
								// 	value: averageRP,
								// 	label: {
								// 		backgroundColor: "rgba(0,0,0,0.2)",
								// 		content: "Average RP in bot: " + averageRP,
								// 		enabled: true,
								// 	},
								// },
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
}
/**
 * @param  {Object} data Total count of users in each rank
 * @return {string} The path to the file
 */
async function makeDistribChart(distData) {
	try {

		const labels = [], data = [], colors = [];
		for (let i = 1; i < distData.length; i++) {
			labels.push(distData[i].name);
			data.push(distData[i].totalCount);
			colors.push(distData[i].color);
		}
		const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 1280, height: 720, backgroundColour : "#36393f" });
		const config = {
			type: "doughnut",
			data: {
				datasets: [
					{
						label: labels,
						data: data,
						backgroundColor: colors,
						borderWidth: 0,
					},
				],
			},
			options:{
			},
		};

		const imageBuffer = await chartJSNodeCanvas.renderToBuffer(config, "image/png");
		await writeFile("./temp/distChart.png", imageBuffer);
		logger.info("Distribution chart image written to disk!", { module: "canvas" });
		return "./temp/distChart.png";

	}
	catch (error) {
		return logger.error(error, { module: "canvas" });
	}
}

/**
 * @param  {Array} usersHistory All users history data
 * @param  {string} guildID GuildID where the command was ran
 * @return {string} The path to the file
 */
async function makeTopChart(usersHistory, guildID) {
	try {
		const exists = existsSync(`./temp/top_${guildID}.png`);

		if (exists) {
			return `./temp/top_${guildID}.png`;
		}
		else {
			const _labels = [], datasets = [];
			for (let i = 0; i < usersHistory.length; i++) {
				usersHistory[i][0].map(dates => {
					if (!_labels.includes(dates)) {
						_labels.push(dates);
					}
				});

				datasets.push({
					label: i + 1,
					data: usersHistory[i][1],
					backgroundColor: "rgba(44,47,51,0)",
					borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
				});
			}
			const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 400, backgroundColour : "#36393f", plugins: { modern: ["chartjs-plugin-annotation"] } });
			const config = {
				type: "line",
				data: {
					labels: _labels,
					datasets: datasets,
				},
				options:{
					fontSize: 50,
					plugins: {
						annotation: {
							annotations: [
								/* Get average for the given guild
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
								},*/
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

			/*
			for (let i = 0; i <= users; i++) {
				config.data.datasets.push(
					{
						label: "RP",
						backgroundColor: "rgba(44,47,51,0)",
						borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
						data: ,
					},
				);
			}*/
			const imageBuffer = await chartJSNodeCanvas.renderToBuffer(config, "image/png");
			await writeFile(`./temp/top_${guildID}.png`, imageBuffer);
			logger.info("Top history image written to disk!", { module: "canvas", guildID: guildID });
			return `./temp/top_${guildID}.png`;
		}
	}
	catch (error) {
		return logger.error(new Error(error), { module: "canvas", guildID: guildID });
	}
}

module.exports = {
	makeStatsChart,
	makeTopChart,
	makeDistribChart,
};