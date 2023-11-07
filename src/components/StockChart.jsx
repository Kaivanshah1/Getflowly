import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { parseISO } from "date-fns";
import { Line } from "react-chartjs-2";

const StockChart = ({ stockData }) => {
  const [lineColor, setLineColor] = useState("green");
  const [priceColor, setPriceColor] = useState("green");

  useEffect(() => {
    const firstPrice = stockData.values[0];
    const lastPrice = stockData.values[stockData.values.length - 1];

    const price1 = stockData.values[stockData.values.length];
    const price2 = stockData.values[stockData.values.length - 1];

    let color;

    if (firstPrice >= lastPrice) {
      color = "red";
    } else {
      color = "green";
    }

    if (price1 > price2) {
      setPriceColor("red");
    } else {
      setPriceColor("green");
    }

    setLineColor(color);
  }, [stockData.values]);

  const reversedLabels = [...stockData.labels].reverse();

  const data = {
    labels: reversedLabels,
    datasets: [
      {
        label: "Stock graph",
        backgroundColor: lineColor,
        borderColor: lineColor,
        data: stockData.values,
      },
    ],
  };

  return (
    <div>
      <Line data={data} />
    </div>
  );
};

export default StockChart;
