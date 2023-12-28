CREATE TABLE servants(
  collectionNo INT PRIMARY KEY,
  sv_name VARCHAR(128) NOT NULL,
  rarity INT,
  class_name VARCHAR(50) NOT NULL,
  face_url VARCHAR(200) NOT NULL,
  face_path VARCHAR(200) NOT NULL
);