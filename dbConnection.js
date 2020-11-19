const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017');

const db = mongoose.connection;

db.on('error', err => console.error(err.message));
db.once('open', () => console.info('Connected to MongoDB!'));

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {type: String, unique: true, require: true},
    isGetCommissions: {type: Boolean, default: false},
    isGetSales: {type: Boolean, default: false},
});

const CommissionsSchema = new Schema({
    id: {type: Number, unique: true, require: true},
    title: {type: String, require: true},
    price: {type: Number},
    href: {type: String},
    img: {type: String},
});

const SalesSchema = new Schema({
    title: {type: String, require: true},
    dates: {type: String},
    link: {type: String},
    img: {type: String},
});

const User = mongoose.model('User', UserSchema);
const Commissions = mongoose.model('Commission', CommissionsSchema);
const Sales = mongoose.model('Sale', SalesSchema);

module.exports = {
    User,
    Commissions,
    Sales,
};
