import * as api from '../API/index';
import { AUTH, CREATE_PROFILE } from './constants';

export const signup = (formData, openSnackbar) => async (dispatch) => {

    try {
        //Sign up the user
        const { data } = await api.signUp(formData);
        dispatch({ type: AUTH, data });
        const { info } = await api.createProfile({ name: data?.result?.name, email: data?.result?.email, userId: data?.result?._id, phoneNumber: '', businessName: '', contactAddress: '', logo: '', website: '' });
        dispatch({ type: CREATE_PROFILE, payload: info });
        window.location.href = "/Login";
        // history.push('/dashboard')
        openSnackbar("Sign up successfull")

    } catch (error) {
        console.log(error)
        openSnackbar(error?.response?.data?.message)
    }
}

export const signin =(formData, openSnackbar) => async(dispatch) => {

    try {
        //login the user
        const { data } = await api.signIn(formData)

        dispatch({ type: AUTH, data})

        openSnackbar("Signin successfull")
        // history.push('/dashboard')
        window.location.href="/Dashboard"

    } catch (error) {
        console.log(error)
        openSnackbar(error?.response?.data?.message)
    }
}