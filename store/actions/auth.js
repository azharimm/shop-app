export const SIGNUP = 'SIGNUP'
export const LOGIN = 'LOGIN'

export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDLucC1WJpJm7O8IDEIxFIEQIVOL5vudLM', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true
            })
        })
        if(!response.ok) {
            const errData = await response.json();
            let errorId = errData.error.message;
            let message = 'Something went wrong!'
            if(errorId === 'EMAIL_EXISTS') {
                message = 'This email not available';
            }
            throw new Error(message);
        }
        const resData = await response.json()
        dispatch({
            type: SIGNUP,
            token: resData.idToken,
            userId: resData.localId
        })
    }
}

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDLucC1WJpJm7O8IDEIxFIEQIVOL5vudLM', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true
            })
        })
        if(!response.ok) {
            const errData = await response.json();
            let errorId = errData.error.message;
            let message = 'Something went wrong!'
            if(errorId === 'EMAIL_NOT_FOUND') {
                message = 'Email not found!';
            }else if(errorId === 'INVALID_PASSWORD') {
                message = 'This password is not valid';
            }
            throw new Error(message);
        }
        const resData = await response.json()
        // console.log(resData)
        
        dispatch({
            type: LOGIN,
            token: resData.idToken,
            userId: resData.localId
        })
    }
}