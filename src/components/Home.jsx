import React, { useEffect } from "react";
import debounce from "lodash.debounce";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useMemo } from "react";
import StockChart from "./StockChart";

function Home() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState("");
  const [priceColor, setPriceColor] = useState("green");

  const [stockData, setStockData] = useState({
    labels: [],
    values: [],
  });

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const debouncedChangeHandler = useMemo(
    () => debounce(handleSearch, 1000),
    []
  );

  useEffect(() => {
    const price1 = stockData.values[stockData.values.length - 1];
    const price2 = stockData.values[stockData.values.length - 2];

    console.log(price1);
    console.log(price2);

    if (price1 < price2) {
      setPriceColor("red");
    } else {
      setPriceColor("green");
    }
  }, [stockData.values]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${search}&interval=1day&outputsize=30&apikey=0cb7e155f7694782ba9a3b6cc40395ff`
      );

      if (!response.ok) {
        throw new Error("Error");
      }

      const res = await response.json();
      console.log(res);
      setData(res);
      setStockData({
        labels: res.values.map((item) => item.datetime),
        values: res.values.map((item) => item.close),
      });
    };

    if (search) {
      fetchData();
    }

    console.log(data);
  }, [search]);
  console.log(stockData);
  return (
    <>
      <div className="flex justify-center mt-3 mx-auto container">
        <nav className="flex flex-row justify-center items-center">
          <b className="font-extrabold text-3xl hidden md:inline">
            Stock Seach
          </b>
          <div className="relative flex items-center">
            <div className="absolute left-5 ">
              <AiOutlineSearch />
            </div>
            <input
              type="text"
              placeholder="Search Stocks"
              className="w-[500px] h-10 pr-3 pl-10 rounded-md bg-gray-100 p-2 ml-2"
              onChange={debouncedChangeHandler}
            />
          </div>
        </nav>
      </div>
      <main className="container mx-auto mt-10">
        {data && data.meta && data.meta.symbol && (
          <p className="font-extrabold font-[40px]">{data.meta.name}</p>
        )}
        {data && data.values ? (
          <div key={data.values[data.values.length - 1].timestamp}>
            <p className={"text-5xl font-{priceColor}-500"}>
              {data.values[data.values.length - 1].close}USD
            </p>
            <p>Open : {data.values[data.values.length - 1].open}</p>
            <p>High: {data.values[data.values.length - 1].high}</p>
            <p>Low: {data.values[data.values.length - 1].low}</p>
          </div>
        ) : (
          <p>No data available</p>
        )}

        <StockChart stockData={stockData} />
      </main>
    </>
  );
}

export default Home;
