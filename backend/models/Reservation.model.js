import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({

    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    quantity:Number,

    expiresAt:Date,

    status:{
        type:String,
        enum:["ACTIVE","PURCHASED","EXPIRED"],
        default:"ACTIVE"
    }

},{timestamps:true});

export default mongoose.model("Reservation",reservationSchema);