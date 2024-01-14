/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { type Servant } from '~/types';
import Image from 'next/image';
import {FaArrowLeft, FaArrowRight, FaHome} from 'react-icons/fa';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] })

export default function Page() {
  const router = useRouter();
  const collectionNo = router.query.collectionNo;
  const [sv, setSv] = useState<Servant | null>(null);
  const [totalSv, setTotalSv] = useState(0);


  const SERVER_MODE = process.env.NEXT_PUBLIC_SERVER_MODE
  const API_SERVER = SERVER_MODE == "release" ? process.env.NEXT_PUBLIC_PROD_API_SERVER : "http://localhost:8080"


  useEffect(() => {
    if (!router.isReady) return;

    async function getNumOfServants() {
      const res = await fetch(`${API_SERVER}/stats/total_servants`)
      const num: number = await res.json()

      setTotalSv(num)
    }

    async function fetchData() {
      try {
        const servantInfo = await getServantInfo();
        setSv(servantInfo);
      } catch (error) {
        // Handle error as needed
      }
    }

    void fetchData();
    void getNumOfServants();
  }, [router.isReady, collectionNo]);

  async function getServantInfo() {
    try {
      const res = await fetch(`${API_SERVER}/servants/${collectionNo}`);
      if (res.ok) {
        const _sv = await res.json();
        const servant: Servant = {
          collectionNo: _sv.servant.collectionNo,
          originalName: _sv.servant.originalName,
          name: _sv.servant.name,
          className: _sv.servant.className,
          rarity: _sv.servant.rarity,
          atkMax: _sv.servant.atkMax,
          hpMax: _sv.servant.hpMax,
          attribute: _sv.servant.attribute,
          face: _sv.servant.face_path
        }
        console.log(_sv.servant);
        return servant;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching servant information:', error);
      throw error;
    }
  }

  return (
    <main className={`text-white ${inter.className} w-full min-h-screen flex flex-col items-center justify-center`}>
      <section className='sm:border border-white/50 rounded-lg sm:w-1/3 w-full flex flex-wrap sm:flex-row flex-col sm:relative sm:justify-normal sm:items-start justify-center items-center p-6'>
        <div className='absolute right-1 top-1 rounded-full inline-flex justify-center items-center font-mono text-purple-300 font-bold'>#{sv?.collectionNo}</div>
        <div className='relative h-32 w-32 sm:mr-4'>
          {<Image alt={sv?.name ?? ""} fill={true} className="rounded-xl" src={sv?.face ?? ""}></Image>}
        </div>
        <div className='text-center sm:text-left'>
          <h1 className='text-green-500'>
            {sv?.name}
          </h1>
          <h1>{`「${sv?.originalName}」`}</h1>
          <h2 className='capitalize text-white/50'>
            {sv?.className}
          </h2>
          <h3 className='text-yellow-600'>
            {
              sv?.rarity === 5 ? '★★★★★' :
                sv?.rarity === 4 ? '★★★★' :
                  sv?.rarity === 3 ? '★★★' :
                    sv?.rarity === 2 ? '★★' :
                      sv?.rarity === 1 ? '★' :
                        'Unknown'
            }
          </h3>
          <p>HP Max: {sv?.hpMax}</p>
          <p>Attack Max: {sv?.atkMax}</p>
          <p className='capitalize'>Attribute: {sv?.attribute}</p>
        </div>
      </section>
      <div className='flex justify-between space-x-8 p-4'>
        <Link href={`/servants/${(sv?.collectionNo ?? 1) - 1}`} className={`hover:text-blue-500 transition-all ease-in-out duration-300 ${sv?.collectionNo == 1 ? 'pointer-events-none text-white/20' : ''}`}>
          <FaArrowLeft />
        </Link>

        <Link href={`/servants`} className={`hover:text-blue-500 transition-all ease-in-out duration-300`}>
          <FaHome />
        </Link>

        <Link href={`/servants/${(sv?.collectionNo ?? 1) + 1}`} className={`hover:text-blue-500 transition-all ease-in-out duration-300 ${sv?.collectionNo == totalSv ? 'pointer-events-none text-white/20' : ''}`}>
          <FaArrowRight />
        </Link>
      </div>
    </main>
  );
}
