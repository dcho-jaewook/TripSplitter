import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    // provider: { type: String, enum: ["kakao", "google", "local"] },
    // providerId: String,
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default:"" },
    // trips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
    // expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
    createdAt: { type: Date, default: Date.now },  
});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
}

const User = mongoose.model("User", userSchema);
export default User;