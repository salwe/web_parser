const express = require('express');
const router = express.Router();

const {User} = require('../dbConnection');
const prefix = '/api/v1';

router.post(`${prefix}/user`, async (req, res) => {
    const {email} = req.body;

    let user = await User.findOne({email});
    if (user) return res.status(400).send('User already registered');

    user = new User({...req.body});

    user.save((err) => {
        if (err) {
            console.error(err);
            if (err.name === 'ValidationError') {
                return res.status(400).send({error: 'Validation error'});
            }

            return res.status(500).send({error: 'Server error'});
        }

        return res.status(200).send(user);
    });
});

router.put(`${prefix}/user`, async (req, res) => {
    const {_id} = req.user;

    await User.updateOne({_id}, req.body);

    User.findOne({_id}, (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).json({error: 'Internal error, please try again later'});
        } else if (!user) {
            res.status(401).json({error: 'User not found'});
        } else {
            res.status(200).send(user);
        }
    });
});

router.delete(`${prefix}/user`, async (req, res) => {
    const {_id} = req.user;

    await User.findByIdAndDelete(_id, err => {
        if (err) {
            console.error(err);
            res.status(500).json({error: 'Internal error, please try again later'});
        }
        res.status(200).send('User was removed');
    });
});

module.exports = router;