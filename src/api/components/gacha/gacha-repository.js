const { Gacha, Prize } = require('../../../models');

class GachaRepository {
  constructor() {
    this.Gacha = Gacha;
    this.Prize = Prize;
  }

  // 🔢 Hitung gacha user hari ini
  async countUserGachaToday(userId) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    return this.Gacha.countDocuments({
      userId,
      createdAt: { $gte: start },
    });
  }

  // 🎁 Ambil hadiah tersedia
  async getAvailablePrizes() {
    return this.Prize.find({ remaining: { $gt: 0 } });
  }

  // 🔄 Kurangi kuota hadiah
  async decreasePrize(prizeId) {
    return this.Prize.findOneAndUpdate(
      { id: prizeId }, // ⚠️ pakai id (sesuai kamu)
      { $inc: { remaining: -1 } },
      { new: true }
    );
  }

  // 💾 Simpan hasil gacha
  async createGachaLog(data) {
    return this.Gacha.create(data);
  }

  // 📜 History user
  async getUserHistory(userId) {
    return this.Gacha.find({ userId })
      .populate('prizeId')
      .sort({ createdAt: -1 });
  }

  // 🎁 Semua hadiah
  async getAllPrizes() {
    return this.Prize.find();
  }

  // 👥 Semua pemenang
  async getWinners() {
    return this.Gacha.find({ prizeId: { $ne: null } })
      .populate('prizeId')
      .sort({ createdAt: -1 });
  }
}

module.exports = new GachaRepository();
