// import 'date-fns';
import React from 'react';
// import Grid from '@mui/material/Grid';
// import DateFnsUtils from '@date-io/date-fns';

// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import DatePicker from '@mui/material/DatePicker';
// import {
//   MuiPickersUtilsProvider,
//   KeyboardDatePicker,
// } from '@mui/';

export default function MaterialUIPickers({ setSelectedDate, selectedDate }) {
  // The first commit of Material-UI


  // const handleDateChange = (date) => {
  //   setSelectedDate(date.toISOString());
  // };

  return (
    <>
      {/* <LocalizationProvider dateAdapter={DateFnsUtils}>
        <Grid container justifyContent="space-around" style={{ width: '97%', paddingLeft: '10px', paddingBottom: '15px' }}>
          <DatePicker
            fullWidth
            disableToolbar
            variant="outline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date paid"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
      </Grid>
      </LocalizationProvider> */}
      {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          fullWidth
          disableToolbar
          variant="outline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Date paid"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
    </MuiPickersUtilsProvider> */}
    </>
    );
}
