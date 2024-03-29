import { Inter } from "next/font/google";
import Head from "next/head";
import Header from "~/components/Header";
import React, { useEffect, useState } from "react";
import type { RollEvent } from "~/types";
import { Legend, Pie, PieChart, Tooltip } from "recharts";
import Image from "next/image";
import RollHistory from "~/components/RolHistory";

const inter = Inter({ subsets: ["latin"] });

const Stats = () => {
  const [rollHistory, setRollHistory] = useState<RollEvent[]>([]);
  const [numSingleRolls, setNumSingleRolls] = useState(0);
  const [numMultiRolls, setNumMultiRolls] = useState(0);
  const [numOfSR, setNumOfSR] = useState(0);
  const [numOfSSR, setNumOfSSR] = useState(0);

  const [jpyToUsd, setJpyToUsd] = useState(0);
  const [jpyToCad, setJpyToCad] = useState(0);
  const [forexDate, setForexDate] = useState("");

  useEffect(() => {
    const history = localStorage.getItem("rollHistory");
    try {
      const parsed = history ? (JSON.parse(history) as RollEvent[]) : [];

      // Stats
      setNumSingleRolls(parsed.filter((obj) => obj.type === "single").length);
      setNumMultiRolls(parsed.filter((obj) => obj.type === "multi").length);
      let numOfSR = 0;
      let numOfSSR = 0;
      parsed.forEach((rollEvent) => {
        rollEvent.roll.forEach((roll) => {
          if (roll.servant?.rarity === 4) {
            numOfSR++;
          }
          if (roll.servant?.rarity === 5) {
            numOfSSR++;
          }
        });
      });

      setNumOfSR(numOfSR);
      setNumOfSSR(numOfSSR);

      setRollHistory(parsed);

      // Exchange rates
      void getExchangeRates();
    } catch (error: unknown) {
      console.log(error);
    }
  }, []);

  async function getExchangeRates() {
    const baseJpyExchangeJson = (await (
      await fetch(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/jpy.json",
      )
    ).json()) as { date: string; jpy: { usd: number; cad: number } };

    const rateJpyToCad = baseJpyExchangeJson.jpy.cad;
    const rateJpyToUsd = baseJpyExchangeJson.jpy.usd;
    const forexDate = baseJpyExchangeJson.date;

    setJpyToUsd(rateJpyToUsd);
    setJpyToCad(rateJpyToCad);
    setForexDate(forexDate);
  }

  return (
    <>
      <Head>
        <title>Reroll.ing | Stats</title>
        <meta name="description" content="I bought this domain as a joke." />
        <link rel="icon" href="/logo-color-variant.png" />
        <meta property="og:image" content="/logo-color-variant.png"></meta>
        <meta property="og:url" content="https://reroll.ing" />
      </Head>
      <main
        className={`relative min-h-screen w-full bg-gradient-to-b from-slate-950 to-pink-950/20 items-center text-slate-200 flex ${inter.className} flex-col`}
      >
        <Header></Header>

        <section className="p-4 h-full flex w-full justify-center items-center flex-col space-y-8">
          <div className="border rounded-xl">
            <h2 className="text-2xl mb-2 text-center">Rarity Distribution</h2>
            <PieChart width={300} height={300}>
              <Pie
                dataKey="value"
                isAnimationActive={true}
                data={[
                  { name: "★★★★★", value: numOfSSR, fill: "#FFD700" },
                  { name: "★★★★", value: numOfSR, fill: "#42f58a" },
                  {
                    name: "Other",
                    value:
                      numMultiRolls * 11 + numSingleRolls - numOfSR - numOfSSR,
                    fill: "#1497e3",
                  },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
                innerRadius={40}
                height={400}
                width={400}
                className="outline-none"
              ></Pie>
              <Legend></Legend>
              <Tooltip></Tooltip>
            </PieChart>
          </div>
          <div className="flex md:space-x-4 flex-wrap justify-center space-y-4 md:space-y-0">
            {/* ROLLS */}
            <div className="text-center">
              <h2 className="text-2xl mb-2">Rolls</h2>
              <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th>Type</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Single</td>
                    <td>{numSingleRolls}</td>
                  </tr>
                  <tr>
                    <td>Multi</td>
                    <td>{numMultiRolls}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* RARITY */}
            <div className="text-center">
              <h2 className="text-2xl mb-2">Servants</h2>
              <table className="overflow-scroll w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th>Rarity</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-yellow-500">★★★★</td>
                    <td>{numOfSR}</td>
                  </tr>
                  <tr>
                    <td className="text-yellow-500">★★★★★</td>
                    <td>{numOfSSR}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* FINANCIAL COSTS */}
            <div className="text-center overflow-x-scroll">
              <h2 className="text-2xl mb-2">Costs</h2>

              <table className="table table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col">Currency</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Per 4★</th>
                    <th scope="col">Per 5★</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-mono">Saint Quartz</td>
                    <td className="font-mono">
                      {numSingleRolls * 3 + numMultiRolls * 30}
                    </td>
                    <td className="font-mono">
                      {(
                        numSingleRolls * 3 +
                        (numMultiRolls * 30) / numOfSR
                      ).toFixed(2)}
                    </td>
                    <td className="font-mono">
                      {(
                        numSingleRolls * 3 +
                        (numMultiRolls * 30) / numOfSSR
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-mono">¥en</td>
                    <td className="font-mono">
                      {(
                        (numSingleRolls * 3 + numMultiRolls * 30) *
                        71.7
                      ).toFixed(2)}
                    </td>
                    <td className="font-mono">
                      {(
                        ((numSingleRolls * 3 + numMultiRolls * 30) * 71.7) /
                        numOfSR
                      ).toFixed(2)}
                    </td>
                    <td className="font-mono">
                      {(
                        ((numSingleRolls * 3 + numMultiRolls * 30) * 71.7) /
                        numOfSSR
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-mono">US$</td>
                    <td className="font-mono">
                      {(
                        (numSingleRolls * 3 + numMultiRolls * 30) *
                        71.7 *
                        jpyToUsd
                      ).toFixed(2)}
                    </td>
                    <td className="font-mono">
                      {(
                        ((numSingleRolls * 3 + numMultiRolls * 30) *
                          71.7 *
                          jpyToUsd) /
                        numOfSR
                      ).toFixed(2)}
                    </td>
                    <td className="font-mono">
                      {(
                        ((numSingleRolls * 3 + numMultiRolls * 30) *
                          71.7 *
                          jpyToUsd) /
                        numOfSSR
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-mono">CA$</td>
                    <td className="font-mono">
                      {(
                        (numSingleRolls * 3 + numMultiRolls * 30) *
                        71.7 *
                        jpyToCad
                      ).toFixed(2)}
                    </td>
                    <td className="font-mono">
                      {(
                        ((numSingleRolls * 3 + numMultiRolls * 30) *
                          71.7 *
                          jpyToCad) /
                        numOfSR
                      ).toFixed(2)}
                    </td>
                    <td className="font-mono">
                      {(
                        ((numSingleRolls * 3 + numMultiRolls * 30) *
                          71.7 *
                          jpyToCad) /
                        numOfSSR
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm mt-2">
                Assume best JP SQ pack: 1 sq = 71.70 ¥, US$ 1 ={" "}
                {(1 / jpyToUsd).toFixed(2)} ¥, CA$ 1 ={" "}
                {(1 / jpyToCad).toFixed(2)} ¥
              </p>
              <p className="text-sm mt-2">Forex Rates as of {forexDate}.</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="font-bold text-green-500 text-2xl">Fun Fact</h2>
            <div className="relative w-56 h-56">
              <Image
                src="/artoria-borgar.jpg"
                fill={true}
                alt="artoria borgar"
                className="rounded-xl"
              ></Image>
            </div>
            <p className="mt-2">
              {`According to Artoria's Börgar Index, your spending could have bought:`}{" "}
              <span className="text-yellow-500 font-bold">
                {(
                  ((numSingleRolls * 3 + numMultiRolls * 30) * 71.7) /
                  145 /
                  5.58
                ).toFixed(2)}
              </span>{" "}
              börgars in the Freedom state.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="font-bold text-green-500 text-2xl">Roll History</h2>
            <div className="flex flex-wrap">
              <RollHistory history={rollHistory}></RollHistory>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Stats;
