import mongoose from 'mongoose'

const User = new mongoose.Schema({
    name: String,
    rut: {
        type: Number,
        unique: true,
       required:true
    }
})

export default mongoose.model('User', User)
