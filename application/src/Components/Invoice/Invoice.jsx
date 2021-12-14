import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import { Container, Grid, TextField, Autocomplete, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, InputBase, Avatar, Divider, Button, IconButton, Chip } from '@mui/material';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import Save from '@mui/icons-material/Save';
import { makeStyles } from '@mui/styles';

// import DateFnsUtils from '@date-io/date-fns';
// import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@mui/pickers';

import styles from './Invoice.module.css';
import { toCommas } from '../../utils/utils';
import { initialState } from '../../initialState';
import currencies from '../../currencies.json';
import { createInvoice, getInvoice, updateInvoice } from '../../Actions/invoiceActions';
import { getClientsByUser } from '../../Actions/clientActions';
import AddClient from './AddClient';
import InvoiceType from './InvoiceType';
// import SelectType from './SelectType'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': { margin: theme = { spacing: (1) }, },
    },
    large: {
        width: theme = { spacing: (12) },
        height: theme = { spacing: (12) },
    },
    table: { minWidth: 650, },
    headerContainer: {
        // display: 'flex'
        paddingTop: theme = { spacing: (1) },
        paddingLeft: theme = { spacing: (5) },
        paddingRight: theme = { spacing: (1) },
    }
}));

const Invoice = () => {

    const [invoiceData, setInvoiceData] = useState(initialState);
    const [rates, setRates] = useState(0);
    const [vat, setVat] = useState(0);
    const [currency, setCurrency] = useState(currencies[0].value);
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const [client, setClient] = useState(null);
    const [type, setType] = React.useState('Invoice');
    const [status, setStatus] = useState('');
    const { id } = useParams();
    const clients = useSelector((state) => state.clients.clients);
    const { invoice } = useSelector((state) => state.invoices);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));

    // Get the invoice from id
    // eslint-disable-next-line 
    useEffect(() => { dispatch(getInvoice(id)); }, [id]);
    // get client for users
    // eslint-disable-next-line
    useEffect(() => { dispatch(getClientsByUser({ search: user?.result._id || user?.result?.googleId })); }, [dispatch]);

    //Automatically set the default invoice values as the ones in the invoice to be updated.
    useEffect(() => { if (invoice) { setInvoiceData(invoice); setRates(invoice.rates); setClient(invoice.client); setType(invoice.type); setStatus(invoice.status); setSelectedDate(invoice.dueDate); } }, [invoice])

    // If Receipt then status will be paid.
    useEffect(() => { if (type === 'Receipt') { setStatus('Paid'); } else { setStatus('Unpaid'); } }, [type])

    // get list of all countries
    const defaultProps = {
        options: currencies,
        getOptionLabel: (option) => option.label
    };
    // get list of clients
    const clientsProps = {
        options: clients,
        getOptionLabel: (option) => option.name
    };

    // eslint-disable-next-line
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleRates = (e) => {
        setRates(e.target.value)
        setInvoiceData((prevState) => ({ ...prevState, tax: e.target.value }))
    }


    // Change handler for dynamically added input field
    const handleChange = (index, e) => {
        const values = [...invoiceData.items];
        values[index][e.target.name] = e.target.value;
        setInvoiceData({ ...invoiceData, items: values });
    }
    //Get the subtotal
    useEffect(() => {
        const subTotal = () => {
            var arr = document.getElementsByName("amount");
            var subtotal = 0;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].value) { subtotal += +arr[i].value; }
                setSubTotal(subtotal);
            }
        }
        subTotal();
    }, [invoiceData])


    useEffect(() => {
        const total = () => {
            //Tax rate is calculated as (input / 100 ) * subtotal + subtotal 
            const overallSum = rates / 100 * subTotal + subTotal;
            //VAT is calculated as tax rates /100 * subtotal
            setVat(rates / 100 * subTotal);
            setTotal(overallSum);
        }
        total();
    }, [invoiceData, rates, subTotal]);


    const handleAddField = (e) => {
        e.preventDefault();
        setInvoiceData((prevState) => ({ ...prevState, items: [...prevState.items, { itemName: '', unitPrice: '', quantity: '', discount: '', amount: '' }] }))
    }

    const handleRemoveField = (index) => {
        const values = invoiceData.items;
        values.splice(index, 1);
        setInvoiceData((prevState) => ({ ...prevState, values }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (invoice) {
            dispatch(updateInvoice(invoice._id, { ...invoiceData, subTotal: subTotal, total: total, vat: vat, rates: rates, currency: currency, dueDate: selectedDate, client, type: type, status: status }));
            navigate(`/invoice/${invoice._id}`);
        } else {
            dispatch(createInvoice({ ...invoiceData, subTotal: subTotal, total: total, vat: vat, rates: rates, currency: currency, dueDate: selectedDate, client, type: type, status: status, paymentRecords: [], creator: [user?.result?._id || user?.result?.googleId] }, navigate));
        }
        // setInvoiceData(initialState);
    }

    const classes = useStyles()
    const [open, setOpen] = useState(false);

    const CustomPaper = (props) => {
        return <Paper elevation={3} {...props} />;
    };


    if (!user) {
        navigate('/login')
    }


    return (
        <div className={styles.invoiceLayout}>
            <form onSubmit={handleSubmit} className="mu-form">
                <AddClient setOpen={setOpen} open={open} />
                <Container className={classes.headerContainer}>

                    <Grid container justifyContent="space-between" >
                        <Grid item>
                            {/* <Avatar alt="Logo" variant='square' src="" className={classes.large} /> */}
                        </Grid>
                        <Grid item>
                            {/* <div style={{paddingTop: '20px'}}>
                            <SelectType  type={type} setType={setType} />
                        </div> */}
                            <InvoiceType type={type} setType={setType} />
                            <Typography variant="overline" style={{ color: 'gray' }} >Invoice#: </Typography>
                            <InputBase defaultValue={invoiceData.invoiceNumber} />
                        </Grid>
                    </Grid >
                </Container>
                <Divider />
                <Container>
                    <Grid container justifyContent="space-between" style={{ marginTop: '40px' }} >
                        <Grid item style={{ width: '50%' }}>
                            <Container>
                                <Typography variant="overline" style={{ color: 'gray', paddingRight: '3px' }} gutterBottom>Bill to</Typography>


                                {client && (
                                    <>
                                        <Typography variant="subtitle2" gutterBottom>{client.name}</Typography>
                                        <Typography variant="body2" >{client.email}</Typography>
                                        <Typography variant="body2" >{client.phone}</Typography>
                                        <Typography variant="body2">{client.address}</Typography>
                                        <Button color="primary" size="small" style={{ textTransform: 'none' }} onClick={() => setClient(null)}>Change</Button>
                                    </>
                                )}
                                <div style={client ? { display: 'none' } : { display: 'block' }}>
                                    <Autocomplete
                                        {...clientsProps}
                                        PaperComponent={CustomPaper}
                                        renderInput={(params) => <TextField {...params}
                                            required={!invoice && true}
                                            label="Select Customer"
                                            margin="normal"
                                            variant="outlined"
                                        />}
                                        value={clients?.name}
                                        onChange={(event, value) => setClient(value)}
                                    />
                                </div>
                                {!client &&
                                    <>
                                        <Grid item style={{ paddingBottom: '10px' }}>
                                            <Chip
                                                avatar={<Avatar>+</Avatar>}
                                                label="New Customer"
                                                onClick={() => setOpen(true)}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </>
                                }
                            </Container>
                        </Grid>

                        <Grid item style={{ marginRight: 20, textAlign: 'right' }}>
                            <Typography variant="overline" style={{ color: 'gray' }} gutterBottom>Status</Typography>
                            <Typography variant="h6" gutterBottom style={{ color: (type === 'Receipt' ? 'green' : 'red') }}>{(type === 'Receipt' ? 'Paid' : 'Unpaid')}</Typography>
                            <Typography variant="overline" style={{ color: 'gray' }} gutterBottom>Date</Typography>
                            <Typography variant="body2" gutterBottom>{moment().format("MMM Do YYYY")}</Typography>
                            <Typography variant="overline" style={{ color: 'gray' }} gutterBottom>Due Date</Typography>
                            <Typography variant="body2" gutterBottom>{selectedDate ? moment(selectedDate).format("MMM Do YYYY") : '27th Sep 2021'}</Typography>
                            <Typography variant="overline" gutterBottom>Amount</Typography>
                            <Typography variant="h6" gutterBottom>{currency} {toCommas(total)}</Typography>
                        </Grid>
                    </Grid>
                </Container>


                <div>

                    <TableContainer component={Paper} className="tb-container">
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item</TableCell>
                                    <TableCell >Qty</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell >Disc(%)</TableCell>
                                    <TableCell >Amount</TableCell>
                                    <TableCell >Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {invoiceData.items.map((itemField, index) => (
                                    <TableRow key={index}>
                                        <TableCell scope="row" style={{ width: '40%' }}> <InputBase style={{ width: '100%' }} outline="none" sx={{ ml: 1, flex: 1 }} type="text" name="itemName" onChange={e => handleChange(index, e)} value={itemField.itemName} placeholder="Item name or description" /> </TableCell>
                                        <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="quantity" onChange={e => handleChange(index, e)} value={itemField.quantity} placeholder="0" /> </TableCell>
                                        <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="unitPrice" onChange={e => handleChange(index, e)} value={itemField.unitPrice} placeholder="0" /> </TableCell>
                                        <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="discount" onChange={e => handleChange(index, e)} value={itemField.discount} placeholder="0" /> </TableCell>
                                        <TableCell align="right"> <InputBase sx={{ ml: 1, flex: 1 }} type="number" name="amount" onChange={e => handleChange(index, e)} value={(itemField.quantity * itemField.unitPrice) - (itemField.quantity * itemField.unitPrice) * itemField.discount / 100} disabled /> </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleRemoveField(index)}>
                                                <DeleteOutlineRounded style={{ width: '20px', height: '20px' }} />
                                            </IconButton>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className={styles.addButton}>
                        <button onClick={handleAddField}>+</button>
                    </div>
                </div>

                <div className={styles.invoiceSummary}>
                    <div className={styles.summary}>Invoice Summary</div>
                    <div className={styles.summaryItem}>
                        <p>Sub total:</p>
                        <h4>{subTotal}</h4>
                    </div>
                    <div className={styles.summaryItem}>
                        <p>GST(%):</p>
                        <h4>{vat}</h4>
                    </div>
                    <div className={styles.summaryItem}>
                        <p>Total</p>
                        <h4 style={{ color: "black", fontSize: "18px", lineHeight: "8px" }}>{currency} {toCommas(total)}</h4>
                    </div>

                </div>


                <div className={styles.toolBar}>
                    <Container >
                        <Grid container >
                            <Grid item style={{ marginTop: '16px', marginRight: 10 }}>
                                <TextField
                                    type="text"
                                    step="any"
                                    name="rates"
                                    id="rates"
                                    defaultValue="18"
                                    value={rates}
                                    onChange={handleRates}
                                    placeholder="e.g 18"
                                    label="Tax Rates(%)"

                                />
                            </Grid>
                            <Grid item style={{ marginRight: 10 }} >

                                {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="date-picker-dialog"
                                        label="Due date"
                                        format="MM/dd/yyyy"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </ MuiPickersUtilsProvider> */}
                            </Grid>
                            <Grid item style={{ width: 270, marginRight: 10 }}>
                                <Autocomplete
                                    {...defaultProps}
                                    id="debug"
                                    debug
                                    renderInput={(params) => <TextField {...params}
                                        label="Select currency"
                                        margin="normal"
                                    />}
                                    defaultValue={currencies[0]}
                                    value={currency.value}
                                    onChange={(event, value) => setCurrency(value.value)}
                                />
                            </Grid>
                        </Grid>

                    </Container>
                </div>
                <div className={styles.note}>
                    <h4>Notes/Terms</h4>
                    <textarea
                        placeholder="Provide additional details or terms of service"
                        onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                        value={invoiceData.notes}
                    />
                </div>

                {/* <button className={styles.submitButton} type="submit">Save and continue</button> */}
                <Grid container justifyContent="center">
                    <Button
                        variant="contained"
                        style={{ justifyContentContent: 'center' }}
                        type="submit"
                        color="primary"
                        size="large"
                        className={classes.button}
                        startIcon={<Save />}
                    >
                        Save and Continue
                    </Button>
                </Grid>
            </form>
        </div>
    )
}

export default Invoice
