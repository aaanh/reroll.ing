import { type Roll } from "~/types"
import SvCard from "./SvCard"

interface ISvModalProps {
  rolls: Roll[]
  isShow: boolean
  curRollIdx: number
  handleShowSvModal: () => void
  setCurrentRollIdx: React.Dispatch<React.SetStateAction<number>>
}

const SvModal = ({rolls, isShow, curRollIdx, handleShowSvModal, setCurrentRollIdx }: ISvModalProps) => {

  return isShow ? <div className="absolute m-auto left-0 right-0 z-50 bg-black/50 backdrop-blur-3xl">{ rolls.map((roll: Roll, idx: number) => idx === curRollIdx ? <SvCard curRollIdx={curRollIdx} setCurrentRollIdx={setCurrentRollIdx} handleShowSvModal={handleShowSvModal} roll={roll} key={idx}></SvCard> : null) }</div> : null
}

export default SvModal;