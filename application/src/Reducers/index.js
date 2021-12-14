import { combineReducers } from 'redux';

import auth from './auth';
import profiles from './profiles';
import invoices from './invoices';
import clients from './clients';

export default combineReducers({ invoices, clients, auth, profiles });
