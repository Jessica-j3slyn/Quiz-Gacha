const gachaService = require('./gacha-services');

class GachaController {
  constructor() {
    this.service = gachaService;
  }

  async roll(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          message: 'userId wajib diisi yaw',
        });
      }

      const result = await this.service.roll(userId);

      return res.status(200).json({
        success: true,
        message: result.win
          ? `Omaigadd dapet ${result.prize} :D`
          : result.message,
        data: result,
      });
    } catch (error) {
      console.error('Gacha roll error:', error);
      if (error.message === 'LIMIT_EXCEEDED') {
        return res.status(403).json({
          success: false,
          message: 'Sorryy batasnya cuman gacha 5x per hari :(',
        });
      }

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async history(req, res) {
    try {
      const data = await this.service.getHistory(req.params.userId);

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async prizes(req, res) {
    try {
      const data = await this.service.getPrizes();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async winners(req, res) {
    try {
      const data = await this.service.getWinners();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new GachaController();
