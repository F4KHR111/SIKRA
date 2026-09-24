const bcrypt = require("bcryptjs");

const authModel = require("../models/authModel");

const { generateToken } = require("../utils/jwt");

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await authModel.getUserByEmail(email);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "Email tidak ditemukan"
            });

        }

        const valid = await bcrypt.compare(
            password,
            user.password
        );

        if (!valid) {

            return res.status(401).json({
                success: false,
                message: "Password salah"
            });

        }

        const token = generateToken(user);

        res.json({

            success: true,

            message: "Login berhasil",

            token,

            user: {

                id: user.id,

                nama: user.nama,

                email: user.email,

                role_id: user.role_id

            }

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

const profile = async (req, res) => {

    try {

        res.json({

            success: true,

            data: req.user

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

module.exports = {
    login,
    profile
};