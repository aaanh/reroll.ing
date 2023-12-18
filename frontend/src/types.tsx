export enum ServantClass {
  Saber, Lancer, Archer, Rider, Caster, Assassin, Berserker, Ruler, Avenger, MoonCancer, AlterEgo, Foreigner, Pretender, Beast, Shielder
}

export type Servant = {
  sv_collectionId: number
  sv_name: string
  sv_rarity: 5 | 4 | 3 | 2 | 1 | 0
  sv_class: ServantClass
  sv_face?: string
}

export type Roll = {
  servant: Servant | undefined
  order: number
}