const repository = require('./gacha-repository');

const gachaLogic = async (userId) => {
  // cek limit
  const total = await repository.countUserGachaToday(userId);

  if (total >= 5) {
    throw new Error('LIMIT_EXCEEDED');
  }

  // ambil hadiah
  const prizes = await repository.getAvailablePrizes();

  if (!prizes || prizes.length === 0) {
    return {
      win: false,
      message: 'Hadiah sudah habis',
    };
  }

  // 🎲 random hadiah
  const index = Math.floor(Math.random() * prizes.length);
  const randomPrize = prizes[index];

  if (!randomPrize) {
    return {
      win: false,
      message: 'Gagal mengambil hadiah',
    };
  }

  // 🔥 FIX ASLI (INI KUNCINYA)
  const prizeId = randomPrize.id;

  // update kuota
  await repository.decreasePrize(prizeId);

  // simpan log
  await repository.createGachaLog({
    userId,
    prizeId,
  });

  return {
    win: true,
    prize: randomPrize.name,
  };
};

const getHistory = async (userId) => repository.getUserHistory(userId);

const getPrizes = async () => repository.getAllPrizes();

const getWinners = async () => repository.getWinners();

module.exports = {
  gachaLogic,
  getHistory,
  getPrizes,
  getWinners,
};
