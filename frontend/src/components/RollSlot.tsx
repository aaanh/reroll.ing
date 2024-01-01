import { type Roll } from "~/types";
import Image from "next/image"
import Link from "next/link";

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
      case 5: return "★★★★★"
      case 4: return "★★★★"
      case 3: return "★★★"
      case 2: return "★★"
      case 1: return "★"
      case 0:
      default: return ""
    }
  }

  return <div  className="flex flex-col justify-center items-center m-2 group">
    <Link href={`/servant/${roll.servant?.collectionNo}`} className={`hover:shadow-glow hover:border-blue-500 transition-all ease-in-out duration-300 relative text-center m-2 rounded-lg h-32 w-32 flex items-center justify-center border-2 p-1`.concat(" ", mapRarityToFrameColor(roll.servant?.rarity ?? 0))}>
      {roll.servant?.face && <Image sizes="(max-width: 768px) 100vw" alt={roll.servant.name} fill={true} className="h-24 w-24 rounded-xl p-2" src={roll.servant.face}></Image>}
      <div className="absolute z-10 bg-black/50 px-2 capitalize text-sm bottom-1 left-50 rounded-full text-yellow-500">{mapRarityToText(roll.servant?.rarity ?? 0)}</div>
    </Link>
    <div className="w-24 h-12 text-center text-sm">{roll.servant?.name}</div>
  </div>
}

export default RollSlot