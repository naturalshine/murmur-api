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