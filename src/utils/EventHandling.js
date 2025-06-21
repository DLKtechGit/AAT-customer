import React, { useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './AuthContext'; 
import emitter from './EventEmitter';

const EventHandling = () => {
    const navigation = useNavigation();
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        const handleLogout = async () => {
            await logout();  
            navigation.navigate('Login'); 
        };

        const logoutListener = emitter.addListener('logout', handleLogout);

        return () => {
            logoutListener.remove(); 
        };
    }, [logout, navigation]);

    return (
<></>    );
};

export default EventHandling;
