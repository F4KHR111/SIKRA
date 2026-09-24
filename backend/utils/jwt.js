const jwt = require("jsonwebtoken");

const generateToken = (user) => {

    return jwt.sign(

        {
            id: user.id,
            nama: user.nama,
            role: user.nama_role
        },

        process.env.JWT_SECRET,

        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }

    );

};

module.exports = {
    generateToken
};