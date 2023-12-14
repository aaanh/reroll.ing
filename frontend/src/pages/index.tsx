/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Head from "next/head";
import Link from "next/link";

import { Inter } from "next/font/google"
import { useState } from "react";

const inter = Inter({ subsets: ['latin'] })

enum ServantClass {
  Saber, Lancer, Archer, Rider, Caster, Assassin, Berserker, Ruler, Avenger, MoonCancer, AlterEgo, Foreigner, Pretender, Beast, Shielder
}

type Servant = {
  sv_collectionId: number
  sv_name: string
  sv_rarity: 5 | 4 | 3 | 2 | 1 | 0
  sv_class: ServantClass
  sv_face?: string
}

type Roll = {
  servant: Servant | undefined
  order: number
}




const RollSlot = ({ roll }: { roll: Roll }) => {
  const mapRarityToFrameColor = (rarity: number): string => {
    switch (rarity) {
      case 5:
        return "border-yellow-500"
      case 4:
        return "border-yellow-600"
      case 3:
        return "border-neutral-400"
      case 2:
        return "border-orange-950"
      case 1:
        return "border-orange-950"
      case 0:
      default:
        return "border-orange-950"
    }
  };

  return <div className={`text-center m-2 rounded-lg h-32 w-32 flex items-center justify-center border-2 p-1`.concat(" ", mapRarityToFrameColor(roll.servant?.sv_rarity ?? 0))}>{roll.servant?.sv_name}</div>
}

export default function Home() {
  const [numOfRolls, setNumOfRolls] = useState(0);
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [numBatchRolls, setNumBatchRolls] = useState(0);
  const [rollHistory, setRollHistory] = useState<Roll[]>([]);

  async function handleRoll(numOfRolls: 1 | 11) {


    if (numOfRolls === 1) {
      // Update the total number of rolls of the current session
      setNumOfRolls((prevNumOfRolls) => prevNumOfRolls + 1);

      // Calling the API server for a single roll
      const sv = await fetch("http://localhost:8080/roll/single").then((res) => res.json());
      console.log(sv.roll)
      const roll: Roll = {
        servant: {
          sv_collectionId: sv.roll.collectionNo,
          sv_name: sv.roll.name,
          sv_class: sv.roll.className,
          sv_rarity: sv.roll.rarity,
          sv_face: sv.roll.face
        }, order: numOfRolls
      }
      setRolls([roll]);
      setRollHistory((prev) => [...prev, roll]);
      console.log(rollHistory);
      return;
    }

    if (numOfRolls === 11) {
      setNumOfRolls((prevNumOfRolls) => prevNumOfRolls + 11);
      setNumBatchRolls((prevNumBatchRolls) => prevNumBatchRolls + 1)

      const res = await fetch("http://localhost:8080/roll/multi").then((res) => res.json());

      setRolls([])

      res.rolls.map((sv: any, idx: number) => setRolls(prevRolls => [...prevRolls, {
        servant: {
          sv_collectionId: sv.collectionNo,
          sv_name: sv.name,
          sv_class: sv.className,
          sv_rarity: sv.rarity,
          sv_face: sv.face
        }, order: idx
      }]))

      console.log(rolls)
      return;
    }
  }

  return (
    <>
      <Head>
        <title>Reroll.ing</title>
        <meta name="description" content="I bought this domain as a joke." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`min-h-screen w-full bg-slate-900 justify-between items-center text-slate-200 flex ${inter.className} flex-col`}>
        <div className="my-4 text-center">
          <h1 className="font-light text-4xl">Reroll.ing</h1>
          <br></br>
          <p>{`I bought this domain as a joke and I have to do something with it 🤡`}</p>
          <p>
            &mdash; <a className="hover:text-blue-500 underline underline-offset-4" href="https://github.com/aaanh"> @aaanh</a>
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center">{rolls.map((roll: Roll, idx: number) => <RollSlot key={idx} roll={roll}></RollSlot>)}</div>
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
