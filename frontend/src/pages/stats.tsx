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

  useEffect(() => {
    const history = localStorage.getItem("rollHistory")
    try {
      const parsed = history ? JSON.parse(history) as RollEvent[] : []

      // Stats
      setNumSingleRolls(parsed.filter((obj) => obj.type === "single").length)
      setNumMultiRolls(parsed.filter((obj) => obj.type === "multi").length)

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
      <h1 className="text-4xl">🚧 Under Construction</h1>
      {/* <section className="p-4 h-full flex w-full justify-center items-center">
      </section> */}
    </main>
  </>
}

export default Stats