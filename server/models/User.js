//لتعريف نموذج المستخدم في قاعدة البيانات باستخدام Mongoose
const mongoose = require('mongoose');
// تعريف مخطط المستخدم باستخدام Mongoose
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true ,
        lowercase: true,
        trim: true
    },
    password: { type: String, required: true},
    location: {type: String},
    description:{ type:String},
    occupation:{type:String}
},
// إضافة timestamps لتتبع وقت إنشاء وتحديث المستندات
    {timestamps:true});
    // تصدير الموديل لاستخدامه في أماكن أخرى
    module.exports=mongoose.model('User',userSchema);