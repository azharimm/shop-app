import { createAppContainer} from 'react-navigation'
import { Platform } from 'react-native'
import { createStackNavigator } from 'react-navigation-stack'

import Color from '../constants/Color'
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen'

const ProductsNavigator = createStackNavigator({
    ProductsOverview: ProductsOverviewScreen
}, {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: Platform.OS === 'android' ? Color.primary : ''
        },
        headerTintColor: Platform.OS === 'android' ? 'white' : Color.primary
    }
})

export default createAppContainer(ProductsNavigator)