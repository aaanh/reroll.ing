/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import Head from "next/head"
import { Inter } from "next/font/google"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { type Servant } from "~/types";
import Image from "next/image"
import { FaHome } from "react-icons/fa";
import Link from "next/link";

const inter = Inter({ subsets: ['latin'] })

const ServantIndexPage = () => {
  const router = useRouter();
  const [servants, setServants] = useState<Servant[]>([]);
  const [totalSv, setTotalSv] = useState(0);

  const SERVER_MODE = process.env.NEXT_PUBLIC_SERVER_MODE
  const API_SERVER = SERVER_MODE == "release" ? process.env.NEXT_PUBLIC_PROD_API_SERVER : "http://localhost:8080"

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_SERVER}/servants`).then(res => res.json());
      if (res.servants) {
        res.servants.forEach((sv: Servant) => {
          const _sv: Servant = {
            collectionNo: sv.collectionNo,
            originalName: sv.originalName,
            name: sv.name,
            className: sv.className,
            rarity: sv.rarity,
            atkMax: sv.atkMax,
            hpMax: sv.hpMax,
            attribute: sv.attribute,
            face: sv.face_path
          };
          setServants((prev) => [...prev, _sv]);
        });
      }
    } catch (error) {
      // Handle error as needed
    }
  };

  useEffect(() => {

    if (servants.length > 0) return;

    async function getNumOfServants() {
      const res = await fetch(`${API_SERVER}/stats/total_servants`)
      const num: number = await res.json()

      setTotalSv(num)
    }

    void fetchData();
    void getNumOfServants();
  }, []);



  return <>
    <Head>
      <title>Reroll.ing</title>
      <meta name="description" content="I bought this domain as a joke." />
      <link rel="icon" href="/logo-color-variant.png" />
      <meta property="og:image" content="/logo-color-variant.png"></meta>
      <meta property="og:url" content="https://reroll.ing" />
    </Head>
    <main className={`relative min-h-screen w-full bg-gradient-to-b from-slate-950 to-pink-950/20 justify-center items-center text-slate-200 flex ${inter.className} flex-col p-8`}>
      <h1 className="text-4xl">Servant Index</h1>
      <Link className="text-white hover:text-blue-500 transition-all ease-in-out my-4" href="/">
        <FaHome></FaHome>
      </Link>
      <div className="flex flex-wrap items-center">
        Total: {servants.length}&nbsp;|&nbsp;
        <GoToCollectionNo totalSv={totalSv} router={router}></GoToCollectionNo>
      </div>
      <div className="flex flex-wrap justify-center items-center">
        {servants.map((sv: Servant, idx: number) => <SvSlot id={sv.collectionNo} key={idx} sv={sv}></SvSlot>)}
      </div>
    </main>
  </>
}

const SvSlot = ({ sv, id }: { sv: Servant, id: number }) => {
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

  const mapRarityToText = (rarity: number): string => {
    switch(rarity) {
      case 5: return "★★★★★"
      case 4: return "★★★★"
      case 3: return "★★★"
      case 2: return "★★"
      case 1: return "★"
      case 0:
      default: return ""
    }
  }

  return <div id={id.toString()} className="flex flex-col justify-center items-center m-2 group">
    <a href={`/servants/${sv.collectionNo}`} className={`hover:shadow-glow hover:border-blue-500 transition-all ease-in-out duration-300 relative text-center m-2 rounded-lg h-32 w-32 flex items-center justify-center border-2 p-1`.concat(" ", mapRarityToFrameColor(sv.rarity ?? 0))}>
      {sv.face && <Image sizes="(max-width: 768px) 100vw" alt={sv.name} fill={true} className="h-24 w-24 rounded-xl p-2" src={sv.face}></Image>}
      <div className="absolute z-10 bg-black/50 px-2 capitalize text-sm bottom-1 left-50 rounded-full text-yellow-500">{mapRarityToText(sv.rarity)}</div>
      <div className="absolute top-1 left-1 bg-black p-1 rounded-xl font-bold text-sm">{sv.collectionNo}</div>
    </a>
    <div className="w-24 text-center text-sm capitalize font-bold">{sv.className}</div>
    <div className="w-24 h-16 text-center text-sm">{sv.name}</div>
  </div>

}



const GoToCollectionNo = ({ totalSv, router } : { totalSv: number, router: any}) => {
  const [targetId, setTargetId] = useState(1);

  function handleTargetIdChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setTargetId(parseInt(e.target.value))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(`#${targetId}`)
  }

  return <form className="my-2" onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
    <input className="bg-blue-700 p-1 rounded-lg hover:bg-opacity-70 hover:cursor-pointer" type="submit" value="Jump To"></input>&nbsp;
    <label>
    Collection #&nbsp;
    <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTargetIdChange(e)} value={targetId} className="rounded-lg bg-transparent border text-white p-1" type="number" max={totalSv} min={1} id="targetId"></input>
    </label>
    &nbsp;
  </form>
}

export default ServantIndexPage