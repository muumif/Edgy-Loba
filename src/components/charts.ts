import { DistributionData } from "../types/als";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { logger } from "../components/logger";
import { writeFile } from "fs/promises";
import { ChartConfiguration } from "chart.js";
import { filename, chartBackgroundColor } from "./const";
import { HistoryDocument } from "../types/mongo";
import ChartJsAnnotation from "chartjs-plugin-annotation";
import { Snowflake } from "discord.js";

export async function makeDistributionChart(distData: DistributionData[]) {
      const labels: string[] = [], data: number[] = [], colors: string[] = [];
      for (let i = 1; i < distData.length; i++) {
            labels.push(distData[i].name);
            data.push(distData[i].totalCount);
            colors.push(distData[i].color);
      }

      const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 1280, height: 720, backgroundColour : chartBackgroundColor });
      const config: ChartConfiguration = {
            type: "doughnut",
            data: {
                  datasets: [
                        {
                              data: data,
                              backgroundColor: colors,
                              borderWidth: 0,
                        },
                  ],
            },
      };

      const imageBuffer = await chartJSNodeCanvas.renderToBuffer(config, "image/png");
      const currentTime = new Date().getTime();
      await writeFile(`./temp/distribution_${currentTime}.png`, imageBuffer).then(function() {logger.info(`Made temp file: distribution_${currentTime}.png`, { file: filename(__filename) });});
      return `./temp/distribution_${currentTime}.png`;
}

export async function makeStatsChart(historyData: HistoryDocument[], todayRP: number, discordId: Snowflake) {
      const labels: string[] = [], data: number[] = [];
      for (let i = 0; i < historyData.length; i++) {
            const historyDate = new Date(historyData[i].date);
            labels.push(`${historyDate.getUTCDate()} / ${(historyDate.getUTCMonth()) + 1}`);
            data.push(historyData[i].RP);
            if (i == historyData.length - 1) {
                  const today = new Date();
                  labels.push(`${today.getUTCDate()} / ${(today.getUTCMonth()) + 1}`);
                  data.push(todayRP);
            }
      }

      const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 1280, height: 720, backgroundColour: chartBackgroundColor, plugins: { modern: [ChartJsAnnotation] } });
      const imageBuffer = await chartJSNodeCanvas.renderToBuffer({
            type: "line",
            data: {
                  labels: labels,
                  datasets: [
                        {
                              label: "Ranked Points",
                              borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                              data: data,
                        },
                  ],
            },
            options: {
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
      },
      "image/png");
      const currentTime = new Date().getTime();
      await writeFile(`./temp/history_${discordId}_${currentTime}.png`, imageBuffer).then(function() {logger.info(`Made temp file: history_${discordId}_${currentTime}.png`, { file: filename(__filename) });});
      return `./temp/history_${discordId}_${currentTime}.png`;
}