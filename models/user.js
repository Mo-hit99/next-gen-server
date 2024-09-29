import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import validator from 'validator'

const userSchema = mongoose.Schema({
  name: { type: String},
  email:{ type: String,unique: true,lowercase:true },
  password:{ type: String},
  image:{type:String},
  otp:{type:String},
  isVerified:{type:Boolean,default:false},
},{timestamps:true});


// static signup for User
userSchema.statics.signup= async function(name,email,password,otp){
    if(!email || !password || !name){
        throw Error("All fields must be filled")
    }
    if(!validator.isEmail(email)){
        throw Error('Email not valid')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password not strong enough')
    }
    const exist = await this.findOne({email})
    if(exist){
        throw Error('Email already in use')
    }
    if(!otp){
        throw Error('Invalid otp')
    }
    const salt=await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password,salt)
    const user = await this.create({name,email,password:hash,otp})
    return user;
}
// login authentication for USer

userSchema.statics.login = async function(email,password){
    if(!email || !password){
        throw Error('All Fields must be filled')
    }
    const user= await this.findOne({email})
    if(!user){
        throw Error('Incorrect email')
    }
    const match = await bcrypt.compare(password,user.password)
    if(!match){
        throw Error("Invalid Password")
    }
    return user;
}

userSchema.statics.forgotPassword = async function(email){
    
    if(!email){
        throw Error('email Fields must be filled')
    }
    const user = await this.findOne({email})
    if(!user){
        throw Error('Invalid Email')
    }
    return user;
}
userSchema.statics.restPassword = async function(id,password){
    // if(!id || !password){
    //     throw Error('Password Fields must be filled');
    // }
    // if(!validator.isStrongPassword(password)){
    //     throw Error('Password not strong enough')
    // }
    const salt=await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password,salt)
    const user = await this.findByIdAndUpdate(id,{password:hash}).exec();
    if(!user){
        throw Error('Password Not Created')
    }
    return user;
}
const userModel = mongoose.model("userSchema", userSchema);
export { userModel };
