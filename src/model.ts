import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema(
    {
    id: {
        type: String,
        unique: true,
        required: true
      },
      fname: {
        type: String,
        unique: false,
        required: true
      },
      lname: {
          type: String,
          unique: false,
          required: true
        },
      email: {
          type: String,
          unique: false,
          required: false
        },
       addresses : {
         type: Array,
         unique: false,
         required: false
       } 
    },
    { timestamps: true },
  );
export const UserModel = mongoose.model("priyanka_dbs",UserSchema);