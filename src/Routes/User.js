"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route = (0, express_1.default)();
const User_1 = __importDefault(require("../Models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Auth_1 = require("../Middleware/Auth");
route.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password } = req.body;
        const isExist = yield User_1.default.findOne({ email });
        if (isExist) {
            return res.status(409).json({ message: "User already exist" });
        }
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield User_1.default.create({ username, email, password: hashPassword });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "");
        if (token)
            return res.send({ user, token });
        else
            throw new Error("Failed to create user");
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
route.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Wrong credentials" });
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Wrong credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "");
        if (token) {
            return res.send({ user, token });
        }
        else {
            throw new Error("Failes to create account");
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
route.get('/profile', Auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.id;
        const user = yield User_1.default.findById(id);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.default = route;
