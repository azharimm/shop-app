import { AsyncStorage } from 'react-native';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const AUTHENTICATE = 'AUTHENTICATE';
let timer;

export const authenticated = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({
            type: AUTHENTICATE,
            userId,
            token
        });
    }
}

export const signup = (email, password) => {
    return async (dispatch) => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDLucC1WJpJm7O8IDEIxFIEQIVOL5vudLM',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true
                })
            }
        );
        if (!response.ok) {
            const errData = await response.json();
            let errorId = errData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email not available';
            }
            throw new Error(message);
        }
        const resData = await response.json();
        dispatch(authenticated(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn * 1000)
        );
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};

export const login = (email, password) => {
    return async (dispatch) => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDLucC1WJpJm7O8IDEIxFIEQIVOL5vudLM',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true
                })
            }
        );
        if (!response.ok) {
            const errData = await response.json();
            let errorId = errData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'Email not found!';
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'This password is not valid';
            }
            throw new Error(message);
        }
        const resData = await response.json();

        dispatch(authenticated(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn * 1000)
        );
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');

    return {
        type: LOGOUT
    }
}

const clearLogoutTimer = () => {
    if(timer) {
        clearTimeout(timer);
    }
}

export const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout())
        }, expirationTime)
    }
}

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem(
        'userData',
        JSON.stringify({
            token,
            userId,
            expiryDate: expirationDate.toISOString()
        })
    );
};
