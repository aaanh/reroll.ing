export enum ServantClass {
  Saber, Lancer, Archer, Rider, Caster, Assassin, Berserker, Ruler, Avenger, MoonCancer, AlterEgo, Foreigner, Pretender, Beast, Shielder
}

export type Servant = {
  collectionNo: number
  originalName: string
  name: string
  rarity: 5 | 4 | 3 | 2 | 1 | 0
  className: ServantClass
  atkMax: number
  hpMax: number
  attribute: string
  face?: string
  face_path?: string
}

export type Roll = {
  servant: Servant | undefined
  order: number
}