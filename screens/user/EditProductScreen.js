import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import Input from '../../components/UI/Input';
import * as productActions from '../../store/actions/products';
import Color from '../../constants/Color'

const formReducer = (state, action) => {
    switch (action.type) {
        case 'FORM_INPUT_UPDATE':
            const updatedValues = {
                ...state.inputValues,
                [action.input]: action.value
            }
            const updatedValidity = {
                ...state.inputValidity,
                [action.input]: action.isValid
            }
            let updatedFormIsValid = true;
            for (const key in updatedValues) {
                updatedFormIsValid = updatedFormIsValid && updatedValidity[key]
            }
            return {
                formIsValid: updatedFormIsValid,
                inputValidity: updatedValidity,
                inputValues: updatedValues
            }
        default:
            return state;
    }
};

const EditProductScreen = (props) => {
    const dispatch = useDispatch();
    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector((state) =>
        state.products.userProducts.find((prod) => prod.id === prodId)
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        },
        inputValidity: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false
        },
        formIsValid: editedProduct ? true : false
    });

    useEffect(() => {
        if(error) {
            Alert.alert('An error occured!', error, [{text: 'Ok'}]);
        }
    }, [error])

    const submitHandler = useCallback(async () => {
        // console.log(formState)
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form', [
                { text: 'Okay' }
            ]);
            return;
        }
        setIsLoading(true)
        setError(null)
        try {
            if (editedProduct) {
                await dispatch(
                    productActions.updateProduct(
                        prodId,
                        formState.inputValues.title,
                        formState.inputValues.description,
                        formState.inputValues.imageUrl
                    )
                );
            } else {
                await dispatch(
                    productActions.createProduct(
                        formState.inputValues.title,
                        formState.inputValues.description,
                        formState.inputValues.imageUrl,
                        +formState.inputValues.price
                    )
                );
            }
            props.navigation.goBack();
        }catch(e) {
            setError(e.message)
        }
        
        setIsLoading(false)

    }, [dispatch, prodId, formState]);

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler });
    }, [submitHandler]);

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        // console.log(inputIdentifier, inputValue, inputValidity)
        dispatchFormState({
            type: 'FORM_INPUT_UPDATE',
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState]);

    if(isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size="large" color={Color.primary}/>
        </View>
    }

    return (
        <ScrollView>
            <View style={styles.form}>
                <Input
                    id="title"
                    label="Title"
                    keyboardType="default"
                    errorText="Please enter a valid title!"
                    autoCapitalize="sentences"
                    autoCorrect
                    returnKeyType="next"
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.title : ''}
                    initialValid={!!editedProduct}
                    required
                 />
                 <Input
                    id="imageUrl"
                    label="Image Url"
                    keyboardType="default"
                    errorText="Please enter a valid Image URL!"
                    returnKeyType="next"
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.imageUrl : ''}
                    initialValid={!!editedProduct}
                    required
                 />
                {editedProduct ? null : (
                    <Input
                        id="price"
                        label="Price"
                        keyboardType="decimal-pad"
                        errorText="Please enter a valid Price!"
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}
                        required
                        min={0.1}
                    />
                )}
                <Input
                    id="description"
                    label="Description"
                    keyboardType="default"
                    errorText="Please enter a valid description"
                    autoCapitalize="sentences"
                    autoCorrect
                    multiline
                    numberOfLines={3}
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.description : ''}
                    initialValid={!!editedProduct}
                    required
                    minLength={5}
                 />
            </View>
        </ScrollView>
    );
};

EditProductScreen.navigationOptions = (navData) => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: navData.navigation.getParam('productId')
            ? 'Edit Product'
            : 'Add Product',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Save"
                    iconName={
                        Platform.OS === 'android'
                            ? 'md-checkmark'
                            : 'ios-checkmark'
                    }
                    onPress={submitFn}
                />
            </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default EditProductScreen;
