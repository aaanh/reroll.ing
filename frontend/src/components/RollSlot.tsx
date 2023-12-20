import { type Roll } from "~/types";
import Image from "next/image"

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

  const mapRarityToText = (rarity: number): string => {
    switch(rarity) {
      case 5: return "SSR"
      case 4: return "SR"
      case 3: return "Rare"
      case 2: return "Common"
      case 1: return "Normal"
      case 0:
      default: return ""
    }
  }

  return <div className="flex flex-col justify-center items-center m-2">
    <div className={`relative text-center m-2 rounded-lg h-32 w-32 flex items-center justify-center border-2 p-1`.concat(" ", mapRarityToFrameColor(roll.servant?.sv_rarity ?? 0))}>
      {roll.servant?.sv_face && <Image sizes="(max-width: 768px) 100vw" alt={roll.servant.sv_name} fill={true} className="h-24 w-24 rounded-lg p-2" src={roll.servant.sv_face}></Image>}
      <div className="absolute z-10 bg-black capitalize text-sm opacity-75 bottom-0 right-0">{roll.servant?.sv_class}</div>
      <div className="absolute z-10 bg-black capitalize text-sm opacity-75 top-0 left-0 rounded-full">{mapRarityToText(roll.servant?.sv_rarity ?? 0)}</div>
    </div>
    <div className="w-24 h-12 text-center text-sm">{roll.servant?.sv_name}</div>
  </div>
}

export default RollSlot