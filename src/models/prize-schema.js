module.exports = (db) =>
  db.model(
    'Prize',
    db.Schema({
      id: Number,
      name: String,
      quota: Number,
      remaining: Number,
    })
  );
