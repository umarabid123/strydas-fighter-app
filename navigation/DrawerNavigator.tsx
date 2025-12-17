import AppSetting from '@/screens/AppSetting';
import GiveFeedback from '@/screens/GiveFeedback';
import MedicalPaper from '@/screens/MedicalPaper';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MenuItem from '../components/MenuItem';
import AppText from '../components/common/AppText';
import { Colors } from '../constant';
import DiscoverNavigator from './DicoverNavigator';
import TabNavigator from './TabNavigator';

const Drawer = createDrawerNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CustomDrawerContent = () => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <AppText text="Menu" fontSize={24} fontName="CircularStd-Bold" color={Colors.white} />
                </View>
                <View style={styles.menuItems}>
                    <MenuItem
                        label='App Settings'
                        icon={(require('../assets/images/setting-icon.png'))}
                        onPress={() => navigation.navigate('AppSetting')}
                    />
                    <MenuItem
                        label='Medical Papers'
                        icon={(require('../assets/images/madical-paper-icon.png'))}
                        onPress={() => navigation.navigate('MedicalPaper')}
                    />
                    <MenuItem
                        label='Give feedback'
                        icon={(require('../assets/images/feedback-icon.png'))}
                        onPress={() => navigation.navigate('Feedback')}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: Colors.black,
                    width: SCREEN_WIDTH * 0.8,
                },
                drawerType: 'front',
                overlayColor: 'rgba(0,0,0,0.7)',
            }}
            drawerContent={() => <CustomDrawerContent />}
        >
            <Drawer.Screen name="Tabs" component={TabNavigator} />
            <Drawer.Screen name="Discover" component={DiscoverNavigator} />
            <Drawer.Screen name="AppSetting" component={AppSetting} />
            <Drawer.Screen name="MedicalPaper" component={MedicalPaper} />
            <Drawer.Screen name="Feedback" component={GiveFeedback} />

        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    menuItems: {
        flex: 1,
    }
});

export default DrawerNavigator;
