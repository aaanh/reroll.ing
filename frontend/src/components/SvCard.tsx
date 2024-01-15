import Image from "next/image"
import { FaArrowLeft, FaArrowRight, FaWindowClose } from "react-icons/fa"
import { type Roll } from "~/types"

interface ISvCardProps {
  roll: Roll,
  handleShowSvModal: () => void,
  setCurrentRollIdx: React.Dispatch<React.SetStateAction<number>>,
  curRollIdx: number
}

const SvCard = ({ roll, handleShowSvModal, setCurrentRollIdx, curRollIdx }: ISvCardProps) => {
  const sv = roll.servant

  return <main className="text-white w-full min-h-screen flex flex-col items-center justify-center">
    <section className='sm:border border-white/50 rounded-lg sm:w-1/3 w-full flex sm:flex-row flex-col sm:relative sm:justify-normal sm:items-start justify-center items-center'>
        <div className='absolute right-2 top-2 rounded-full inline-flex justify-center items-center font-mono text-purple-300 font-bold'>#{sv?.collectionNo}</div>
        <div className='relative h-32 w-32 m-4'>
          {<Image sizes="(max-width: 768px) 100vw" alt={sv?.name ?? ""} fill={true} className="h-24 w-24 rounded-xl" src={sv?.face ?? ""}></Image>}
        </div>
        <div className='text-center sm:text-left m-4'>
          <h1 className=''>
            {sv?.name}
          </h1>
          <h2 className='text-sm'>
            {`「${sv?.originalName}」`}
          </h2>
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
        <button onClick={() => {setCurrentRollIdx(curRollIdx - 1)}} className={`hover:text-blue-500 transition-all ease-in-out duration-300 ${curRollIdx == 0 ? 'pointer-events-none text-white/20' : ''}`}>
          <FaArrowLeft />
        </button>

        <button onClick={handleShowSvModal} className={`hover:text-blue-500 transition-all ease-in-out duration-300`}>
          <FaWindowClose />
        </button>

        <button onClick={() => {setCurrentRollIdx(curRollIdx + 1)}} className={`hover:text-blue-500 transition-all ease-in-out duration-300 ${curRollIdx == 10 ? 'pointer-events-none text-white/20' : ''}`}>
          <FaArrowRight />
        </button>
      </div>
  </main>
}

export default SvCard