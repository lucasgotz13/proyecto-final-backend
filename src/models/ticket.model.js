import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = mongoose.Schema(
    {
        code: String,
        amount: Number,
        purchaser: String,
    },
    {
        timestamps: {
            createdAt: "purchase_datetime",
        },
    }
);

ticketSchema.pre("findOne", function () {
    this.populate("purchaser");
});

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);
