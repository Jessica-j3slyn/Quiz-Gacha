module.exports = (db) =>
  db.model(
    'Gacha',
    db.Schema({
      userId: String,
      prizeId: {
        type: db.Schema.Types.ObjectId,
        ref: 'Prize',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    })
  );
