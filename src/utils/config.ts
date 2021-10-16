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

export const getBarData = (label: string, xaxis: string[], yaxis: number[]) => {
    return {
        labels: xaxis,
    }
}
