const db = require('../config/database');

const insertLog = (data) => {
    // Data: { user_id, action, description, ip_address }
    const query = "INSERT INTO activity_logs (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)";
    
    // Callback error handling sederhana agar tidak crash jika log gagal
    db.query(query, [data.user_id, data.action, data.description, data.ip_address], (err) => {
        if (err) console.error("Gagal mencatat log:", err);
    });
};

module.exports = { insertLog };