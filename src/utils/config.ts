// import  getColorPair  from "random-color-pair";
import randomColor from "randomcolor";

const getColorPair = () => {
  const isForegroundDark = true;
  const foregroundColor = randomColor({
    luminosity: isForegroundDark ? 'dark' : 'light'
  });
  const backgroundColor = randomColor({
    luminosity: isForegroundDark ? 'light' : 'dark'
  });
  return [foregroundColor, backgroundColor];
}

export const dataClean = (fields: string[], forecast: any) => {
  return fields.map((label) => {
    return {
      label: label,
      data: forecast.map((param: any) => {
        return {
          date: new Date(param.dt * 1000),
          value: param[label.toLowerCase()],
        };
      }),
    };
  });
};

export const graphConfig = (type: string) => {
  if (type === "Bar") {
    return {
      title: {
        display: true,
        text: "Average Rainfall per month",
        fontSize: 20,
      },
      legend: {
        display: true,
        position: "right",
      },
      maintainAspectRatio: false,
    };
  } else if (type === "Pie") {
    return {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    };
  } else if (type === "Line") {
    return {
      title: {
        display: true,
        text: "Average Rainfall per month",
        fontSize: 20,
      },
      legend: {
        display: true,
        position: "right",
      },
      maintainAspectRatio: false,
    };
  }
};

interface BarDataset {
  label: string,
  data: number[],
  backgroundColor?: string,
  borderColor?: string,
  borderWidth?: number
}

export const getBarData = (labels: string[], datasets: BarDataset[]) => {
    return {
        labels: labels,
        datasets: datasets.map((val) => {
          const [border, fill] = getColorPair();         
          return {
            label: val.label,
            data: val.data,
            backgroundColor: val.backgroundColor || fill,
            borderColor: val.borderColor || border,
            borderWidth: val.borderWidth || 2
          }
        })
    }
}

interface LineDataset {
  label: string,
  data: number[],
  backgroundColor?: string,
  borderColor?: string,
  borderWidth?: number,
  fill?: boolean,
  lineTension?: number
}

export const getLineData = (labels: string[], datasets: LineDataset[]) => {
  return {
      labels: labels,
      datasets: datasets.map((val) => {
        const [border, fill] = getColorPair();         
        return {
          label: val.label,
          data: val.data,
          backgroundColor: val.backgroundColor || border,
          borderColor: val.borderColor || border,
          borderWidth: val.borderWidth || 2,
          fill: val.fill || false,
          lineTension: val.lineTension || 0.5
        }
      })
  }
}

interface ScatterDataset {
  label: string,
  data: any[],
  backgroundColor?: string,
}

export const getScatterData = (labels: string[], datasets: ScatterDataset[]) => {
  return {
      datasets: datasets.map((val) => {
        const [border, fill] = getColorPair();         
        return {
          label: val.label,
          data: val.data.map((obj, id) => {
            return {
              x : labels[id],
              y : obj,
            };
          }),
          backgroundColor: val.backgroundColor || fill,
        }
      })
  }
}