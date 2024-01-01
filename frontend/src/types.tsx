export enum ServantClass {
  Saber, Lancer, Archer, Rider, Caster, Assassin, Berserker, Ruler, Avenger, MoonCancer, AlterEgo, Foreigner, Pretender, Beast, Shielder
}

export type Servant = {
  collectionNo: number
  name: string
  rarity: 5 | 4 | 3 | 2 | 1 | 0
  className: ServantClass
  face?: string
}

export type Roll = {
  servant: Servant | undefined
  order: number
}