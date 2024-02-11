import { Inter } from "next/font/google"
import Head from "next/head"
import Header from "~/components/Header"
import React, { useEffect, useState } from 'react';
import type { RollEvent } from "~/types";
import { Legend, Pie, PieChart, ResponsiveContainer, Text, Tooltip } from "recharts";
import Image from "next/image";

const inter = Inter({ subsets: ['latin'] })

const Stats = () => {
  const [rollHistory, setRollHistory] = useState<RollEvent[]>([])
  const [numSingleRolls, setNumSingleRolls] = useState(0);
  const [numMultiRolls, setNumMultiRolls] = useState(0);
  const [numOfSR, setNumOfSR] = useState(0);
  const [numOfSSR, setNumOfSSR] = useState(0);

  useEffect(() => {
    const history = localStorage.getItem("rollHistory")
    try {
      const parsed = history ? JSON.parse(history) as RollEvent[] : []

      // Stats
      setNumSingleRolls(parsed.filter((obj) => obj.type === "single").length)
      setNumMultiRolls(parsed.filter((obj) => obj.type === "multi").length)
      let numOfSR = 0
      let numOfSSR = 0
      parsed.forEach((rollEvent) => {
        rollEvent.roll.forEach(roll => {
          if (roll.servant?.rarity === 4) {
            numOfSR++;
          }
          if (roll.servant?.rarity === 5) {
            numOfSSR++;
          }
        })
      })

      setNumOfSR(numOfSR)
      setNumOfSSR(numOfSSR)

      setRollHistory(parsed)
    } catch (error: unknown) {
      console.log(error)
    }
  }, [])

  return <>
    <Head>
      <title>Reroll.ing | Stats</title>
      <meta name="description" content="I bought this domain as a joke." />
      <link rel="icon" href="/logo-color-variant.png" />
      <meta property="og:image" content="/logo-color-variant.png"></meta>
      <meta property="og:url" content="https://reroll.ing" />
    </Head>
    <main className={`relative min-h-screen w-full bg-gradient-to-b from-slate-950 to-pink-950/20 items-center text-slate-200 flex ${inter.className} flex-col`}>
      <Header></Header>
      {/* <h1 className="text-4xl">🚧 Under Construction</h1> */}
      <section className="p-4 h-full flex w-full justify-center items-center flex-col space-y-8">
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
                  <td className="font-mono">{(numSingleRolls * 3 + numMultiRolls * 30)}</td>
                  <td className="font-mono">{(numSingleRolls * 3 + numMultiRolls * 30 / numOfSR)}</td>
                  <td className="font-mono">{(numSingleRolls * 3 + numMultiRolls * 30 / numOfSSR)}</td>
                </tr>
                <tr>
                  <td className="font-mono">Yen (¥)</td>
                  <td className="font-mono">{((numSingleRolls * 3 + numMultiRolls * 30) * 71.70).toFixed(2)}</td>
                  <td className="font-mono">{((numSingleRolls * 3 + numMultiRolls * 30) * 71.70 / numOfSR).toFixed(2)}</td>
                  <td className="font-mono">{((numSingleRolls * 3 + numMultiRolls * 30) * 71.70 / numOfSSR).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="font-mono">US Dollars</td>
                  <td className="font-mono">{((numSingleRolls * 3 + numMultiRolls * 30) * 71.70 / 145).toFixed(2)}</td>
                  <td className="font-mono">{((numSingleRolls * 3 + numMultiRolls * 30) * 71.70 / 145 / numOfSR).toFixed(2)}</td>
                  <td className="font-mono">{((numSingleRolls * 3 + numMultiRolls * 30) * 71.70 / 145 / numOfSSR).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="font-mono">Canada Monopoly Money</td>
                  <td className="font-mono">{((numSingleRolls * 3 + numMultiRolls * 30) * 71.70 / 145 * 1.35).toFixed(2)}</td>
                  <td className="font-mono">{((numSingleRolls * 3 + numMultiRolls * 30) * 71.70 / 145 * 1.35 / numOfSR).toFixed(2)}</td>
                  <td className="font-mono">{((numSingleRolls * 3 + numMultiRolls * 30) * 71.70 / 145 * 1.35 / numOfSSR).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-sm mt-2">Assume best JP SQ pack: 1 sq = 71.70 ¥, 1 US$ = 145 ¥, 1 US$ = 1.35 CA$</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="font-bold text-green-500 text-2xl">Fun Fact</h2>
          <div className="relative w-56 h-56">
            <Image src="/artoria-borgar.jpg" fill={true} alt="artoria borgar" className="rounded-xl"></Image>
          </div>
          <p className="mt-2">{`According to Artoria's Börgar Index, your spending could have bought:`} <span className="text-yellow-500 font-bold">{((numSingleRolls * 3 + numMultiRolls * 30) * 71.70 / 145 / 5.58).toFixed(2)}</span> börgars in the Freedom state.</p>
        </div>

        <div className="border rounded-xl">
          {/* values: [numOfSR, numOfSSR, numMultiRolls * 11 + numSingleRolls - numOfSR - numOfSSR], */}

          <h2 className="text-2xl mb-2 text-center">Rarity Distribution</h2>
          <PieChart
            width={300}
            height={300}
          >
            <Pie
              dataKey="value"
              isAnimationActive={true}
              data={[
                { name: '★★★★★', value: numOfSSR, fill: '#FFD700' },
                { name: '★★★★', value: numOfSR, fill: '#42f58a' },
                { name: 'Other', value: numMultiRolls * 11 + numSingleRolls - numOfSR - numOfSSR, fill: '#1497e3' }
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
      </section>
    </main>
  </>
}

export default Stats