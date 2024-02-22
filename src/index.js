"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const User_1 = __importDefault(require("./Routes/User"));
const Money_1 = __importDefault(require("./Routes/Money"));
const db_1 = __importDefault(require("./db"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/user", User_1.default);
app.use('/api/v1/money', Money_1.default);
(0, db_1.default)()
    .then((res) => {
    console.log(res);
})
    .catch((err) => console.log(err));
app.listen(process.env.PORT || 3000, () => {
    console.log("listning*:3000");
});
