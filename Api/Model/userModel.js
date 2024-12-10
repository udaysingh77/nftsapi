const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const { validate } = require("./nftModel")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please tell us your name!"]
    },
    email:{
        type:String,
        required:[true,"please provide your email"],
        unique:true,
        lowercase:true,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    password:{
        type:String,
        required:[true,"please provide a password"]
    },
    passwordConfirm:{
        type:String,
        required:[true,"please confirm your password"],
        validate:{
            validator:function(el){
                return el === this.password;
            },
        },
        message :"passwords are not the same!"
    }
})

userSchema.pre("save",async function(next){
    //only runs if the password s actually modefied
    if(!this.isModified("password")) return next();

    //hash the pasword with the cost of 10
    this.password = await bcrypt.hash(this.password,12);

    //Delete passwordCorm field
    this.passwordConfirm = undefined;
    next();
})

userSchema.pre("save",function(next){
    if(!this.isModified("password") || this.isNew) return next();
    this.passwordChangedAt = Date.now()-1000;
    next()
});

userSchema.pre(/^find/,function (next){
    //this points to current query
    this.find({active:{$ne:false}});
    next();
})


userSchema.methods.correctPassword= async function(candidatePassword, userPassword){
return await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChanged){
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }

    return false
}

const User = mongoose.model("User",userSchema);

module.exports = User;