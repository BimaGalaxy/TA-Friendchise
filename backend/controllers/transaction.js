import Users from "../models/UserModel.js";
import Franchise from "../models/FranchiseModel.js";
import Transactions from "../models/TransactionModel.js"

export const buyFeatured = async(req, res) => {
    const userId = req.decoded.id;
    const {id} = req.params;
    try {
        const franchise = await Franchise.findOne({
            where: {
                id: id,
                userId: userId,
                statusApproval: 'approved'
            }
        });
        if (!franchise) return res.status(404).json({ error: 'Franchise tidak ditemukan atau belum disetujui.' });

        const featuredUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 hari dari sekarang
        franchise.isFeatured = true;
        franchise.featuredUntil = featuredUntil;
        await franchise.save();

        const amount = req.body.amount || 200000; // Biaya membership
        const transaction = await Transactions.create({
            userId: userId,
            franchiseId: id,
            date: new Date(),
            amount: amount
        });

        res.status(201).json({
            message: 'Iklan berhasil dibeli. Waralaba Anda sekarang ditampilkan di halaman featured.',
            transaction: transaction
        });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan saat membeli fitur.' });
        console.log(error);
    }
};

export const getTransaction = async(req, res) => {
    const userId = req.decoded.id;
    try {
        const transactions = await Transactions.findAll({
            attributes: ['id', 'userId', 'date', 'amount'], 
            where: {
                userId: userId
            },
            include: [
                {
                    model: Franchise,
                    as: 'franchise',
                    attributes: ['id', 'userId', 'namaFranchise']
                }
            ]
        });

        res.json({
            msg: "Daftar transaksi",
            transactions: transactions
        });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil detail transaksi.' });
    }
}