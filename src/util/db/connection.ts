import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('/volume/db.json');
const connection = lowdb(adapter);

connection
  .defaults({
    entrances: {},
    exits: {},
    ignoreList: [],
    sounds: []
  })
  .write();

export default connection;
