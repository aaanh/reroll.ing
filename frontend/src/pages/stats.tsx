import { Inter } from "next/font/google"
import Head from "next/head"
import Header from "~/components/Header"
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { RollEvent } from "~/types";

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
      <title>Reroll.ing</title>
      <meta name="description" content="I bought this domain as a joke." />
      <link rel="icon" href="/logo-color-variant.png" />
      <meta property="og:image" content="/logo-color-variant.png"></meta>
      <meta property="og:url" content="https://reroll.ing" />
    </Head>
    <main className={`relative min-h-screen w-full bg-gradient-to-b from-slate-950 to-pink-950/20 items-center text-slate-200 flex ${inter.className} flex-col`}>
      <Header></Header>
      {/* <h1 className="text-4xl">🚧 Under Construction</h1> */}
      <section className="p-4 h-full flex w-full justify-center items-center">
        {/* ROLLS */}
        <div className="flex space-x-4 flex-wrap">
          <div className="text-center">
            <h2 className="text-2xl mb-2">Rolls</h2>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
          <div className="text-center">
            <h2 className="text-2xl mb-2">Costs</h2>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th>Currency</th>
                  <th>Amount</th>
                  <th>Per 4★</th>
                  <th>Per 5★</th>
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
      </section>
    </main>
  </>
}

export default Stats