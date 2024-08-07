"use client";

import Head from "next/head";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import type {
  Servant,
  Roll,
  RollEvent,
  RollSingleResponse,
  RollMultiResponse,
} from "~/types";
import RollSlot from "~/components/RollSlot";
import Header from "~/components/Header";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SvModal from "~/components/SvModal";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const SERVER_MODE = process.env.NEXT_PUBLIC_SERVER_MODE;
  const API_SERVER =
    SERVER_MODE == "release"
      ? process.env.NEXT_PUBLIC_PROD_API_SERVER
      : "http://localhost:8080";

  const [numOfRolls, setNumOfRolls] = useState(0);
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [numBatchRolls, setNumBatchRolls] = useState(0);
  const [playHalo, setPlayHalo] = useState(false);
  const [showSvInfoModal, setShowSvInfoModal] = useState(false);
  const [currentRollIdx, setCurrentRollIdx] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [rollDelay, setRollDelay] = useState(200); // 200 ms
  const [rollHistory, setRollHistory] = useState<RollEvent[]>([]);
  const [showSessionIO, setShowSessionIO] = useState(false);
  const [isUploadOk, setIsUploadOk] = useState(false);
  const [isUploadFailed, setIsUploadFailed] = useState(false);

  const [isServerUp, setIsServerUp] = useState(false);

  async function checkServerStatus() {
    const res = (await fetch(`${API_SERVER}/health`).then((res) =>
      res.json(),
    )) as { status: string };
    if (res.status === "ok") {
      setIsServerUp(true);
    } else {
      setIsServerUp(false);
    }
  }

  useEffect(() => {
    setRollDelay(200); // Reset rollDelay to default value after each render
    if (localStorage.getItem("rollHistory") === null) {
      localStorage.setItem("rollHistory", "[]");
    } else {
      const history = localStorage.getItem("rollHistory");
      try {
        const parsed = history ? (JSON.parse(history) as RollEvent[]) : [];
        setRollHistory(parsed);
      } catch (error) {
        console.log(error);
      }
    }

    void checkServerStatus();
  }, [rollDelay]);

  function handleShowSvInfoModal(curRollIdx: number) {
    setCurrentRollIdx(curRollIdx);
    setShowSvInfoModal((prev) => !prev);
  }

  function updateRollHistoryOnLocalStorage(type: 1 | 11, rolls: Roll[]) {
    try {
      localStorage.setItem(
        "rollHistory",
        JSON.stringify(
          rollHistory.concat({
            type: type === 1 ? "single" : "multi",
            roll: rolls,
          }),
        ),
      );
    } catch (error) {
      return;
    }
  }

  async function handleRoll(
    numOfRolls: 1 | 11,
    e: React.MouseEvent<HTMLElement>,
  ) {
    e.preventDefault();
    setRolls([]);
    setPlayHalo(false);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const tempRolls: Roll[] = [];

    if (numOfRolls === 1) {
      // Update the total number of rolls of the current session
      setNumOfRolls((prevNumOfRolls) => prevNumOfRolls + 1);

      // Calling the API server for a single roll
      const sv = await fetch(`${API_SERVER}/roll/single`).then(
        (res) => res.json() as unknown as RollSingleResponse,
      );

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
          face: sv.roll.face_path,
        },
        order: numOfRolls,
      };

      setRolls([roll]);
      tempRolls.push(roll);

      if (sv.roll.rarity >= 4) {
        // Set the playHalo state to trigger the animation
        setPlayHalo(true);

        // Reset the playHalo state after a delay to allow the animation to complete
        await delay(1000); // Adjust the delay time according to your animation duration
        setPlayHalo(false);
      }
      setRollHistory((prevRollHistory) => [
        ...prevRollHistory,
        { type: "single", roll: tempRolls },
      ]);
      updateRollHistoryOnLocalStorage(1, tempRolls);

      setIsRolling(false);
    }

    if (numOfRolls === 11) {
      setIsRolling(true);
      setNumOfRolls((prevNumOfRolls) => prevNumOfRolls + 11);
      setNumBatchRolls((prevNumBatchRolls) => prevNumBatchRolls + 1);

      const res = await fetch(`${API_SERVER}/roll/multi`).then(
        (res) => res.json() as unknown as RollMultiResponse,
      );

      await Promise.all(
        res.rolls.map(async (sv: Servant, idx: number) => {
          await delay(rollDelay * idx); // Adjust the delay time as needed

          const roll: Roll = {
            servant: {
              collectionNo: sv.collectionNo,
              originalName: sv.originalName,
              name: sv.name,
              className: sv.className,
              rarity: sv.rarity,
              atkMax: sv.atkMax,
              hpMax: sv.hpMax,
              attribute: sv.attribute,
              face: sv.face_path,
            },
            order: idx,
          };

          // Update the rolls state without wiping it completely
          setRolls((prevRolls) => [...prevRolls, roll]);
          tempRolls.push(roll);

          if ((idx > 0 && sv.rarity >= 4) || (idx === 0 && sv.rarity === 5)) {
            // Set the playHalo state to trigger the animation
            setPlayHalo(true);

            // Reset the playHalo state after a delay to allow the animation to complete
            await delay(1000); // Adjust the delay time according to your animation duration
            setPlayHalo(false);
          }
        }),
      );
      setRollHistory((prevRollHistory) => [
        ...prevRollHistory,
        { type: "multi", roll: tempRolls },
      ]);
      updateRollHistoryOnLocalStorage(11, tempRolls);
      setIsRolling(false);
    }
  }

  function handleDownloadSessionHistory(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    const dateTime = new Date().toISOString();
    const element = document.createElement("a");
    const history = localStorage.getItem("rollHistory");
    const file = new Blob(history ? [history] : [], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `rerolling-${dateTime}.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  function handleUploadSessionHistory(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    try {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function () {
          const history = JSON.parse(
            (reader.result as string).replace(/\\/g, ""),
          ) as RollEvent[]; // Explicitly type the result as RollEvent[]
          localStorage.setItem("rollHistory", JSON.stringify(history));
          setRollHistory(history);
        };
        reader.readAsText(file);
      }
      setIsUploadOk(true);
      setIsUploadFailed(false);
    } catch (e: unknown) {
      setIsUploadOk(false);
      setIsUploadFailed(true);
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
      <main
        className={`${
          playHalo ? "halo-animation" : ""
        } relative flex min-h-screen w-full items-center justify-between bg-gradient-to-b from-slate-950 to-pink-950/20 text-slate-200 ${
          inter.className
        } flex-col`}
      >
        <Header>
          {isServerUp ? "Server: 🟢 Available" : "Server: 🔴 Down"}
        </Header>

        {showSvInfoModal ? (
          <SvModal
            setCurrentRollIdx={setCurrentRollIdx}
            handleShowSvModal={() => handleShowSvInfoModal(0)}
            curRollIdx={currentRollIdx}
            rolls={rolls}
          ></SvModal>
        ) : null}

        {!isServerUp ? (
          <div className="absolute z-50 h-screen w-screen bg-black/50 flex items-center justify-center">
            <div className="bg-black p-8">
              <h1 className="font-bold text-yellow-500">
                API Server is currently under maintenance.
              </h1>
              <p>Sorry for the inconveniences. Please check back later.</p>
              <p>
                {`If it's still down after 1-2 hours, contact `}
                <a className="link" href="mailto:support@aaanh.com">
                  support@aaanh.com
                </a>
              </p>
            </div>
          </div>
        ) : null}

        <div
          className={`no-scrollbar flex h-[50vh] flex-wrap items-center justify-center overflow-scroll border-y border-blue-500 shadow-[inset_0_-5px_20px_rgba(0,0,0,0.3)] sm:h-[55vh] sm:border-none sm:shadow-none`}
        >
          {rolls.map((roll: Roll, idx: number) => (
            <RollSlot
              currRollIdx={currentRollIdx}
              handleShowSvInfoModal={() => handleShowSvInfoModal(idx)}
              key={idx}
              roll={roll}
            ></RollSlot>
          ))}
        </div>

        <div className={`my-4 flex flex-col items-center`}>
          <div className="text-center">
            <p>
              <span className="font-bold">Total Rolls:</span> {numOfRolls}
            </p>
            <p>
              <span className="font-bold">Total Costs:</span>{" "}
              {(numOfRolls - numBatchRolls) * 3}{" "}
              <span className="text-pink-500">SQ</span> ~{" "}
              {((numOfRolls - numBatchRolls) * 3 * 71.7).toFixed(2)}{" "}
              <span className="text-green-500">¥</span> ~{" "}
              {(((numOfRolls - numBatchRolls) * 3 * 71.7) / 145).toFixed(2)}{" "}
              <span className="text-green-500">US$</span>
            </p>
            <p className="font-mono text-xs opacity-50">
              Assume best JP SQ pack: 1 sq = 71.70 ¥, 1 US$ = 145 ¥
            </p>
          </div>
          <div>
            <button
              onClick={() => setShowSessionIO(true)}
              className="btn-primary text-sm"
            >
              Session History Management
            </button>
          </div>
          <div>
            <button
              id="single-roll"
              onClick={(e: React.MouseEvent<HTMLElement>) => handleRoll(1, e)}
              className={`btn-primary text-2xl ${
                isRolling ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Roll x1
            </button>
            <button
              id="multi-roll"
              onClick={(e: React.MouseEvent<HTMLElement>) => handleRoll(11, e)}
              className={`btn-primary text-2xl ${
                isRolling ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Roll x11
            </button>
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 top-0 z-50 flex flex-col flex-wrap items-center justify-center space-y-4 bg-black/90 p-2 ${
            showSessionIO ? "" : "hidden"
          }`}
        >
          <h2
            className="rounded-xl border p-2 text-center text-4xl"
            style={{ boxShadow: "5px 5px #dbb01696" }}
          >
            Reroll.ing Session Management
          </h2>
          <button
            onClick={(e: React.MouseEvent<HTMLElement>) =>
              handleDownloadSessionHistory(e)
            }
            className="btn-primary border-green-500 bg-transparent text-green-500"
          >
            Save Session History
          </button>
          <div className="group btn-primary relative flex flex-col items-center justify-center border-green-500 bg-transparent text-center text-green-500 hover:bg-transparent">
            <label className="font-bold text-green-500">
              Upload Session History
            </label>
            <input
              onChange={handleUploadSessionHistory}
              className="relative z-50 w-64 text-sm opacity-0 file:mr-4 file:rounded-full file:border-2 file:border-green-500 file:bg-transparent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-500 file:transition-all file:ease-in-out hover:text-green-500 hover:file:cursor-pointer hover:file:bg-green-700 group-hover:cursor-pointer"
              accept=".json"
              type="file"
              multiple
            ></input>
            <div className="absolute left-0 right-0 top-0 m-auto p-10 text-center">
              <p className="group-hover:cursor-pointer">Select Files</p>
            </div>
          </div>
          <p className={`${isUploadOk ? "" : "hidden"}`}>
            Loaded session history successfully!
          </p>
          <p className={`${isUploadFailed ? "" : "hidden"}`}>
            Failed to load session history!
          </p>

          <button
            className="btn-secondary"
            onClick={() => {
              if (confirm("Are you sure clearing session history?") == true) {
                localStorage.setItem("rollHistory", "");
                setRollHistory([]);
                setShowSessionIO(false);
                setRolls([]);
                setNumBatchRolls(0);
                setNumOfRolls(0);
              }
            }}
          >
            Clear Session History
          </button>
          <button
            className="btn-secondary"
            onClick={() => setShowSessionIO(false)}
          >
            Close
          </button>
        </div>
      </main>
    </>
  );
}
