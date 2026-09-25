const db = require("../config/db");

const getDashboard = async () => {
    const [[kendaraan]] = await db.query(
        "SELECT COUNT(*) AS total FROM kendaraan"
    );

    const [[users]] = await db.query(
        "SELECT COUNT(*) AS total FROM users"
    );

    const [[pemeriksaan]] = await db.query(
        "SELECT COUNT(*) AS total FROM pemeriksaan"
    );

    const [recent] = await db.query(`
        SELECT
            p.id,
            p.tanggal,
            k.jenis_kendaraan,
            k.plat_merah,
            u.nama AS inspektor
        FROM pemeriksaan p
        JOIN kendaraan k
            ON p.kendaraan_id = k.id
        JOIN users u
            ON p.inspektor_id = u.id
        ORDER BY p.tanggal DESC
        LIMIT 5
    `);

    // Ambil data kendaraan beserta masa berlaku STNK
    const [kendaraanList] = await db.query(`
        SELECT
            id,
            jenis_kendaraan,
            tipe,
            asal_kendaraan,
            plat_merah,
            plat_hitam,
            stnk_tahunan,
            stnk_lima_tahunan
        FROM kendaraan
        ORDER BY id DESC
    `);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stnkList = [];
    let totalExpired = 0;
    let totalSegera = 0;
    let totalPerhatian = 0;
    let totalAman = 0;
    let totalBelumDiisi = 0;

    for (const k of (kendaraanList || [])) {
        const checkStnk = (dateVal, jenis) => {
            if (!dateVal) return null;
            const targetDate = new Date(dateVal);
            targetDate.setHours(0, 0, 0, 0);
            const diffTime = targetDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let status = "aman";
            let statusLabel = "Aman";
            let badgeColor = "#10B981";

            if (diffDays < 0) {
                status = "expired";
                statusLabel = `Kedaluwarsa (${Math.abs(diffDays)} hari lalu)`;
                badgeColor = "#EF4444";
            } else if (diffDays <= 30) {
                status = "kritis";
                statusLabel = `Segera Habis (${diffDays === 0 ? "Hari ini" : diffDays + " hari lagi"})`;
                badgeColor = "#F97316";
            } else if (diffDays <= 365) {
                status = "peringatan";
                const months = Math.ceil(diffDays / 30);
                statusLabel = `Perlu Perhatian (${diffDays} hari / ~${months} bln)`;
                badgeColor = "#F59E0B";
            } else {
                status = "aman";
                statusLabel = `Berlaku (${Math.floor(diffDays / 365)} thn lagi)`;
                badgeColor = "#10B981";
            }

            return {
                jenis,
                tanggal: dateVal,
                diffDays,
                status,
                statusLabel,
                badgeColor
            };
        };

        const alertTahunan = checkStnk(k.stnk_tahunan, "Pajak 1 Tahunan");
        const alertLimaTahunan = checkStnk(k.stnk_lima_tahunan, "STNK 5 Tahunan");

        const alerts = [alertTahunan, alertLimaTahunan].filter(Boolean);

        let worstStatus = "belum_diisi";
        if (alerts.length > 0) {
            if (alerts.some(a => a.status === "expired")) {
                worstStatus = "expired";
                totalExpired++;
            } else if (alerts.some(a => a.status === "kritis")) {
                worstStatus = "kritis";
                totalSegera++;
            } else if (alerts.some(a => a.status === "peringatan")) {
                worstStatus = "peringatan";
                totalPerhatian++;
            } else {
                worstStatus = "aman";
                totalAman++;
            }
        } else {
            totalBelumDiisi++;
        }

        stnkList.push({
            id: k.id,
            jenis_kendaraan: k.jenis_kendaraan,
            tipe: k.tipe,
            asal_kendaraan: k.asal_kendaraan,
            plat_merah: k.plat_merah,
            plat_hitam: k.plat_hitam,
            stnk_tahunan: k.stnk_tahunan,
            stnk_lima_tahunan: k.stnk_lima_tahunan,
            alertTahunan,
            alertLimaTahunan,
            worstStatus
        });
    }

    const priority = { expired: 1, kritis: 2, peringatan: 3, belum_diisi: 4, aman: 5 };
    stnkList.sort((a, b) => (priority[a.worstStatus] || 99) - (priority[b.worstStatus] || 99));

    return {
        totalKendaraan: kendaraan?.total || 0,
        totalUser: users?.total || 0,
        totalPemeriksaan: pemeriksaan?.total || 0,
        recent: recent || [],
        stnkSummary: {
            totalExpired,
            totalSegera,
            totalPerhatian,
            totalAman,
            totalBelumDiisi,
            totalNeedAction: totalExpired + totalSegera + totalPerhatian
        },
        stnkAlerts: stnkList
    };
};

module.exports = {
    getDashboard
};