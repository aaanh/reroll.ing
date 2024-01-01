CREATE TABLE servants(
  collectionNo INT PRIMARY KEY,
  sv_original_name VARCHAR(128) NOT NULL,
  sv_name VARCHAR(128) NOT NULL,
  rarity INT NOT NULL,
  class_name VARCHAR(50) NOT NULL,
  atk_max INT NOT NULL,
  hp_max INT NOT NULL,
  attribute VARCHAR(50) NOT NULL,
  face_url VARCHAR(200) NOT NULL,
  face_path VARCHAR(200) NOT NULL
);