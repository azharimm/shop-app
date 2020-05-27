import Order from '../../models/order'
export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDER = 'SET_ORDER';

export const fetchOrder = () => {
    return async dispatch => {
        try {
            const response = await fetch(
                'https://rn-shop-app-c81ba.firebaseio.com/orders/u1.json'
            );
            console.log(response)

            if(!response.ok) {
                throw new Error('Something went wrong!')
            }
    
            const resData = await response.json();
            const loadedOrders = [];
            for (const key in resData) {
                loadedOrders.push(
                    new Order(
                        key,
                        resData[key].cartItems,
                        resData[key].totalAmount,
                        new Date(resData[key].date),
                    )
                );
            }
            dispatch({type: SET_ORDER, orders: loadedOrders})
        }catch(e) {
            throw new Error('Something went wrong!')
        }
    }
}

export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch, getState) => {
        const date = new Date()
        const token = getState().auth.token;
        const response = await fetch(
            `https://rn-shop-app-c81ba.firebaseio.com/orders/u1.json?auth=${token}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cartItems,
                    totalAmount,
                    date: date.toISOString()
                })
            }
        );

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        const resData = await response.json();

        dispatch({
            type: ADD_ORDER,
            orderData: {
                id: resData.name,
                items: cartItems,
                amount: totalAmount,
                date: date
            }
        });
    };
};
