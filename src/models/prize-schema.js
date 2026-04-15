module.exports = (db) =>
  db.model(
    'Prize',
    db.Schema({
      name: String,
      quota: Number,
      remaining: Number,
    })
  );
