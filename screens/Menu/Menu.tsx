import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MenuItem from '../../components/MenuItem';
import AppText from '../../components/common/AppText';
import { Colors } from '../../constant';

const Menu = () => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <AppText text="Menu" fontSize={24} fontName="CircularStd-Bold" color={Colors.white} />
                    <View style={styles.headerIcons}>
                        <TouchableOpacity>
                            <Image source={require('../../assets/images/notifications.png')} style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={require('../../assets/images/menu-line-icon.png')} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.menuItems}>
                    <MenuItem
                        label='App Settings'
                        icon={(require('../../assets/images/setting-icon.png'))}
                        onPress={() => navigation.navigate('AppSetting')}
                    />
                    <MenuItem
                        label='Medical Papers'
                        icon={(require('../../assets/images/madical-paper-icon.png'))}
                        onPress={() => navigation.navigate('MedicalPaper')}
                    />
                    <MenuItem
                        label='Give feedback'
                        icon={(require('../../assets/images/feedback-icon.png'))}
                        onPress={() => navigation.navigate('Feedback')}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black, // Let background be handled by transparent theme or global background
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 16,
    },
    icon: {
        width: 24,
        height: 24,
    },
    menuItems: {
        flex: 1,
    }
});

export default Menu;
