import { DistributionData } from "../types/als";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { logger } from "../components/logger";
import { writeFile } from "fs/promises";
import { ChartConfiguration } from "chart.js";
import { filename, chartBackgroundColor } from "./const";

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