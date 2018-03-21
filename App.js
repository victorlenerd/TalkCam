import { StackNavigator } from 'react-navigation';

import OnBoarding from './src/OnBoarding';
import Login from './src/Login';
import Notes from './src/Notes';
import Camera from './src/Camera';
import Reader from './src/Reader';

export default App = StackNavigator({
    OnBoarding: {  screen: OnBoarding },
    Login: { screen: Login },
    Notes: { screen: Notes },
    Camera: { screen: Camera },
    Reader: { screen: Reader }
},{
    headerMode: 'none'
});