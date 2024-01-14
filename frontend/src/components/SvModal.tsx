import { type Roll } from "~/types"
import SvCard from "./SvCard"

interface ISvModalProps {
  rolls: Roll[]
  curRollIdx: number
  handleShowSvModal: () => void
  setCurrentRollIdx: React.Dispatch<React.SetStateAction<number>>
}

const SvModal = ({rolls, curRollIdx, handleShowSvModal, setCurrentRollIdx }: ISvModalProps) => {
  return <div className="absolute m-auto left-0 right-0 z-50 bg-black/50 backdrop-blur-3xl">{ rolls.map((roll: Roll, idx: number) => idx === curRollIdx ? <SvCard curRollIdx={curRollIdx} setCurrentRollIdx={setCurrentRollIdx} handleShowSvModal={handleShowSvModal} roll={roll} key={idx}></SvCard> : null) }</div>
}

export default SvModal;