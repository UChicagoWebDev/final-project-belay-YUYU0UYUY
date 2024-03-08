DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS channels;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS last_messages_seen;
DROP TABLE IF EXISTS emoji;


create table users (
  id INTEGER PRIMARY KEY,
  name VARCHAR(40) UNIQUE,
  password VARCHAR(40),
  api_key VARCHAR(40)
);

create table channels (
    id INTEGER PRIMARY KEY,
    name VARCHAR(40) UNIQUE
);

create table messages (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  room_id INTEGER,
  body TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(room_id) REFERENCES rooms(id)
);


create table last_messages_seen (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    last_message_id INTEGER NOT NULL,
    time_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES channels(id),
    FOREIGN KEY (last_message_id) REFERENCES messages(id)
);


CREATE TABLE emoji (
    id INTEGER PRIMARY KEY,
    content TEXT NOT NULL,
    message_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (message_id) REFERENCES messages(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);