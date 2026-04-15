module.exports = (db) =>
  db.model(
    'Gacha',
    db.Schema({
      userId: {
        type: db.Schema.Types.ObjectId,
        ref: 'Users',
      },
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
