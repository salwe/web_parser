const express = require('express');
const pixelRouter = express.Router();
const mailService = require('../services/mailService');
const parseService = require('../services/parseService');
const {User} = require('../dbConnection');

const prefix = '/api/v1';

pixelRouter.get(`${prefix}/mail/commissions`, async (req, res) => {
    try {
        const data = await parseService.getCommissionList();
        User.find({isGetCommissions: true}, 'email', async (err, users) => {
            for (let i = 0; i < users.length; i++) {
                await mailService.sendCommissionMail(data, users[i]);
            }

            return res.status(200).send('Mails successfully send');
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
});

pixelRouter.get(`${prefix}/mail/sales`, async (req, res) => {
    try {
        const data = await parseService.getSaleList();
        User.find({isGetSales: true}, 'email', async (err, users) => {
            for (let i = 0; i < users.length; i++) {
                await mailService.sendSaleMail(data, users[i]);
            }

            return res.status(200).send('Mails successfully send');
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
});

module.exports = pixelRouter;