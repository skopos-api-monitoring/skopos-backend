CREATE DATABASE requests;

\c requests

CREATE TABLE collections (
  collection_id serial NOT NULL PRIMARY KEY,
  title varchar NOT NULL,
  created_at timestamp DEFAULT NOW()
);

CREATE TABLE calls (
  call_id serial NOT NULL PRIMARY KEY,
  collection_id integer NOT NULL REFERENCES collections(collection_id) ON DELETE CASCADE
);

CREATE TABLE requests (
  request_id serial NOT NULL PRIMARY KEY,
  method varchar NOT NULL,
  url varchar NOT NULL,
  headers jsonb,
  body jsonb,
  call_id integer NOT NULL REFERENCES calls(call_id) ON DELETE CASCADE
);

CREATE TABLE responses (
  response_id serial NOT NULL PRIMARY KEY,
  status integer NOT NULL,
  headers jsonb,
  latency integer,
  call_id integer NOT NULL REFERENCES calls(call_id) ON DELETE CASCADE
);

CREATE TABLE assertions (
  assertion_id serial NOT NULL PRIMARY KEY,
  property varchar,
  expected varchar,
  actual varchar,
  response_id integer NOT NULL REFERENCES responses(response_id) ON DELETE CASCADE,
  call_id integer NOT NULL REFERENCES calls(call_id) ON DELETE CASCADE
);
