const express = require('express');
const  { createInvoice, updateInvoice, deleteInvoice, getInvoice, getInvoicesByUser } = require('../controllers/invoiceControls')

const router = express.Router();

router.get('/:id', getInvoice)
router.get('/', getInvoicesByUser)
router.post('/', createInvoice)
router.patch('/:id', updateInvoice)
router.delete('/:id', deleteInvoice)

module.exports = router;