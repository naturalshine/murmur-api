// psql table creation scripts

export const createMessageTable = `
DROP TABLE IF EXISTS messages;
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR DEFAULT '',
  message VARCHAR NOT NULL
  )
  `;

export const insertMessages = `
INSERT INTO messages(name, message)
VALUES ('chidimo', 'first message'),
      ('orji', 'second message')
`;

export const dropMessagesTable = 'DROP TABLE messages';

export const createVideosTable = `
DROP TABLE IF EXISTS videos;
CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  tokenId INT,
  tablelandId INT,
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image TEXT DEFAULT '', 
  video TEXT DEFAULT '', 
  audio TEXT DEFAULT '', 
  file TEXT DEFAULT '',
  path TEXT DEFAULT '',
  authorship JSONB,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE,
  published BOOLEAN DEFAULT FALSE,
  duration TEXT,
  play_count INT, 
  keywords JSONB,
  asmr_sounds JSONB,
  lyrics TEXT
  )
  `;

export const insertVideos = `
INSERT INTO videos(title, description)
VALUES ('chidimo', 'first message'),
      ('orji', 'second message')
`;

export const dropVideosTable = 'DROP TABLE videos';


export const createSamplesTable = `
DROP TABLE IF EXISTS samples;
CREATE TABLE IF NOT EXISTS samples (
  id SERIAL PRIMARY KEY,
  tokenId INT,
  tablelandId INT,
  tablelandPackId INT, 
  tablelandVideoId INT,
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image TEXT DEFAULT '', 
  audio TEXT DEFAULT '', 
  file TEXT DEFAULT '',
  path TEXT DEFAULT '',
  decimals INT, 
  authorship JSONB,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE,
  published BOOLEAN DEFAULT FALSE,
  edition_size INT,
  start_time TEXT,
  end_time TEXT,
  duration TEXT,
  loop BOOLEAN,
  keywords JSONB,
  asmr_sounds JSONB,
  lyrics TEXT,
  video_id integer REFERENCES videos(id),
  pack_id integer REFERENCES packs(id)
  )
  `;

export const insertSamples = `
INSERT INTO samples(title, description)
VALUES ('chidimo', 'first message'),
      ('orji', 'second message')
`;

export const dropSamplesTable = 'DROP TABLE samples';


export const createPacksTable = `
DROP TABLE IF EXISTS packs;
CREATE TABLE IF NOT EXISTS packs (
  id SERIAL PRIMARY KEY,
  tokenId INT,
  tablelandId INT,
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image TEXT DEFAULT '', 
  file TEXT DEFAULT '',
  path TEXT DEFAULT '',
  decimals INT, 
  price INT,
  authorship JSONB,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE,
  published BOOLEAN DEFAULT FALSE,
  asmr_sounds JSONB,
  keywords JSONB,
  edition_size INT
  )
  `;

export const insertPacks = `
INSERT INTO packs(title, description)
VALUES ('chidimo', 'first message'),
      ('orji', 'second message')
`;

export const dropPacksTable = 'DROP TABLE packs';