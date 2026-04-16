const { Gacha, Prize } = require('../../../models');

class GachaRepository {
  constructor() {
    this.Gacha = Gacha;
    this.Prize = Prize;
  }

  // itung gacha user hari ini
  async countUserGachaToday(userId) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    return this.Gacha.countDocuments({
      userId,
      createdAt: { $gte: start },
    });
  }

  async getUserAttemptsToday(userId) {
    console.log('Getting user attempts for:', userId);
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const result = await this.Gacha.find({
      userId,
      createdAt: { $gte: start },
    });
    console.log('User attempts result:', result);
    return result;
  }

  async getPrizeById(id) {
    return this.Prize.findOne({ id });
  }

  // Ambil hadiah yg masi ada
  async getAvailablePrizes() {
    return this.Prize.find({ remaining: { $gt: 0 } });
  }

  async getPrizes() {
    return this.Prize.find();
  }

  async updatePrizeRemaining(prizeId, remaining) {
    return this.Prize.findOneAndUpdate(
      { id: prizeId },
      { remaining },
      { new: true }
    );
  }

  // Kurangi kuota hadiah
  async decreasePrize(prizeId) {
    return this.Prize.findOneAndUpdate(
      { id: prizeId },
      { $inc: { remaining: -1 } },
      { new: true }
    );
  }

  // nyimpen hasil gacha
  async createAttempt(userId, prizeId) {
    return this.Gacha.create({ userId, prizeId });
  }

  async createGachaLog(data) {
    return this.Gacha.create(data);
  }

  // History user
  async getUserHistory(userId) {
    return this.Gacha.find({ userId })
      .populate('prizeId')
      .sort({ createdAt: -1 });
  }

  //  Semua hadiah
  async getAllPrizes() {
    return this.Prize.find();
  }

  // Semua pemenang
  async getAllAttemptsWithPrizes() {
    return this.Gacha.find({ prizeId: { $ne: null } })
      .populate('prizeId')
      .sort({ createdAt: -1 });
  }

  async getWinners() {
    return this.Gacha.find({ prizeId: { $ne: null } })
      .populate('prizeId')
      .sort({ createdAt: -1 });
  }
}

module.exports = new GachaRepository();
