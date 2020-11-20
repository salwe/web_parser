const express = require('express');
const pixelRouter = express.Router();
const parseService = require('../services/parseService');
const {Commissions, Sales} = require('../dbConnection');

const prefix = '/api/v1';

pixelRouter.get(`${prefix}/commissions/all`, async (req, res) => {
    try {
        const data = await parseService.getCommissionList();
        return res.status(200).send(data);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
});

pixelRouter.get(`${prefix}/commissions/new`, async (req, res) => {
    try {
        const actualCommissions = await parseService.getCommissionList();
        const actualIds = actualCommissions.map(el => el.id);

        Commissions.find({'id': {$in: actualIds}}, async (err, commissions) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal server error');
            }
            const storedIds = commissions.map(el => el.id);
            const newCommissions = actualCommissions.filter(el => !storedIds.includes(el.id));
            const idsToDelete = storedIds.filter(el => !actualIds.includes(el.id));

            if (newCommissions.length || idsToDelete.length) {
                await Commissions.deleteMany({id: {$in: idsToDelete}});
                await Commissions.create(actualCommissions);
            }

            return res.status(200).send(newCommissions);
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
});

pixelRouter.get(`${prefix}/sales/all`, async (req, res) => {
    try {
        const data = await parseService.getSaleList();
        return res.status(200).send(data);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
});

pixelRouter.get(`${prefix}/sales/new`, async (req, res) => {
    try {
        const actualSales = await parseService.getSaleList();
        const actualTitles = actualSales.map(el => el.title);

        Sales.find({'title': {$in: actualTitles}}, async (err, sales) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal server error');
            }
            const storedTitles = sales.map(el => el.title);
            const newSales = actualSales.filter(el => !storedTitles.includes(el.title));
            const titlesToDelete = storedTitles.filter(el => !storedTitles.includes(el.title));

            if (newSales.length || titlesToDelete.length) {
                await Sales.deleteMany({title: {$in: titlesToDelete}});
                await Sales.create(actualSales);
            }

            return res.status(200).send(newSales);
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
});

module.exports = pixelRouter;