import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // check if user exists
        const user = await User.findOne({ where: { username: username } });
        if (!user) {
            const err = new Error("User does not exist");
            err.status = 400;
            return next(err);
        }

        if (await bcrypt.compare(password, user.password)) {

            const token = jwt.sign({
                id: user.id,
                username: user.username,
            }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRATION});

            return res.status(200).json({ message: "logged in", token: token });
        }
        else {
            return res.status(400).json({ message: "Invalid password" });
        }
    }
    catch (error) {
        console.log(`Error while trying to login user: ${error}`);
        const err = new Error("Internal server error while trying to login");
        err.status = 500;
        return next(err);
    }
};

export const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // check if user already exists
        const user = await User.findOne({ where: { username: username } });
        if (user) {
            const err = new Error("User already exists");
            err.status = 400;
            return next(err);
        }
        
        // hash password
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        await User.create({ 
            username: username,
            password: hash, 
        });

        return res.status(200).json({ message: "Successfully registered" });
    }
    catch (error) {
        console.log(`Error while creating user account: ${error}`);
        const err = new Error("Internal server error while creating user account");
        err.status = 500;
        return next(err);
    }
}