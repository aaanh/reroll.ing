import { ServantClass, type Roll, type RollEvent } from "~/types";
import { SvSlot } from "~/pages/servants";

interface RollHistory {
  history: RollEvent[];
}

const RollHistory = ({ history }: RollHistory) => {
  return (
    <>
      {history.reverse().map((rollEvent: RollEvent, idx: number) => (
        <section
          key={history.length - idx}
          className={`flex flex-col ${
            rollEvent.type === "multi" ? "md:w-1/2" : ""
          }`}
        >
          <h3 className="text-yellow-500 font-bold text-center">
            Roll #{history.length - idx} &mdash; {rollEvent.type}
          </h3>
          <div className={`flex flex-wrap items-center justify-center`}>
            {rollEvent.roll.map((r: Roll, idx: number) => (
              <SvSlot
                sv={{
                  collectionNo: r.servant?.collectionNo ?? 0,
                  originalName: r.servant?.originalName ?? "",
                  name: r.servant?.name ?? "",
                  rarity: r.servant?.rarity ?? 0,
                  className: r.servant?.className ?? ServantClass.Saber,
                  atkMax: r.servant?.atkMax ?? 0,
                  hpMax: r.servant?.hpMax ?? 0,
                  attribute: r.servant?.attribute ?? "",
                  face: r.servant?.face ?? "",
                  face_path: r.servant?.face_path ?? "",
                }}
                id={idx}
              ></SvSlot>
            ))}
          </div>
        </section>
      ))}
    </>
  );
};

export default RollHistory;
