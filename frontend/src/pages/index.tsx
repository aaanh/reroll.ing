/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Head from "next/head";
import { Inter } from "next/font/google"
import { useState } from "react";
import { type Roll } from "~/types";
import RollSlot from "~/components/RollSlot";
import Header from "~/components/Header";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const SERVER_MODE = process.env.NEXT_PUBLIC_SERVER_MODE
  const API_SERVER = SERVER_MODE == "release" ? process.env.NEXT_PUBLIC_PROD_API_SERVER : process.env.NEXT_PUBLIC_DEV_API_SERVER

  const [numOfRolls, setNumOfRolls] = useState(0);
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [numBatchRolls, setNumBatchRolls] = useState(0);
  // const [rollHistory, setRollHistory] = useState<Roll[]>([]);

  async function handleRoll(numOfRolls: 1 | 11) {
    if (numOfRolls === 1) {
      // Update the total number of rolls of the current session
      setNumOfRolls((prevNumOfRolls) => prevNumOfRolls + 1);

      // Calling the API server for a single roll
      const sv = await fetch(`${API_SERVER}/roll/single`).then((res) => res.json());

      const roll: Roll = {
        servant: {
          collectionNo: sv.roll.collectionNo,
          originalName: sv.roll.originalName,
          name: sv.roll.name,
          className: sv.roll.className,
          rarity: sv.roll.rarity,
          atkMax: sv.roll.atkMax,
          hpMax: sv.roll.hpMax,
          attribute: sv.roll.attribute,
          face: sv.roll.face_path
        }, order: numOfRolls
      }
      setRolls([roll]);
      // setRollHistory((prev) => [...prev, roll]);

      return;
    }

    if (numOfRolls === 11) {
      setNumOfRolls((prevNumOfRolls) => prevNumOfRolls + 11);
      setNumBatchRolls((prevNumBatchRolls) => prevNumBatchRolls + 1)

      const res = await fetch(`${API_SERVER}/roll/multi`).then((res) => res.json());

      setRolls([])

      res.rolls.map((sv: any, idx: number) => setRolls(prevRolls => [...prevRolls, {
        servant: {
          collectionNo: sv.collectionNo,
          originalName: sv.originalName,
          name: sv.name,
          className: sv.className,
          rarity: sv.rarity,
          atkMax: sv.atkMax,
          hpMax: sv.hpMax,
          attribute: sv.attribute,
          face: sv.face_path
        }, order: idx
      }]))
      return;
    }
  }

  return (
    <>
      <SpeedInsights />
      <Head>
        <title>Reroll.ing</title>
        <meta name="description" content="I bought this domain as a joke." />
        <link rel="icon" href="/logo-color-variant.png" />
        <meta property="og:image" content="/logo-color-variant.png"></meta>
        <meta property="og:url" content="https://reroll.ing" />
      </Head>
      <main className={`min-h-screen w-full bg-gradient-to-b from-slate-950 to-pink-950/20 justify-between items-center text-slate-200 flex ${inter.className} flex-col`}>
        <Header></Header>

        <div className="flex flex-wrap items-center justify-center h-[50vh] sm:border-none border-y border-blue-500 sm:shadow-none shadow-[inset_0_-5px_20px_rgba(0,0,0,0.3)] sm:overflow-hidden overflow-scroll no-scrollbar">
          {rolls.map((roll: Roll, idx: number) => <RollSlot key={idx} roll={roll}></RollSlot>)}
        </div>

        <div className="my-4 flex flex-col items-center">
          <div className="text-center">
            <p><span className="font-bold">Total Rolls:</span> {numOfRolls}</p>
            <p><span className="font-bold">Total Costs:</span> {(numOfRolls - numBatchRolls) * 3} <span className="text-pink-500">SQ</span> ~ {((numOfRolls - numBatchRolls) * 3 * 71.70).toFixed(2)} <span className="text-green-500">¥</span> ~ {((numOfRolls - numBatchRolls) * 3 * 71.70 / 145).toFixed(2)} <span className="text-green-500">US$</span></p>
            <p className="opacity-50 font-mono">Assuming biggest SQ purchase in JP: 1 sq = 71.70 ¥, 1 US$ = 145 ¥</p>
          </div>

          <div>
            <button id="single-roll" onClick={() => handleRoll(1)} className="btn-primary text-2xl">Roll x1</button>
            <button id="multi-roll" onClick={() => handleRoll(11)} className="btn-primary text-2xl">Roll x11</button>
          </div>
        </div>

      </main>
    </>
  );
}