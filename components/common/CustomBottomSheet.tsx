import { X } from 'lucide-react-native';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constant';
import AppText from './AppText';

interface CustomBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    contentStyle?: any;
}

const CustomBottomSheet = ({ visible, onClose, title, children, contentStyle }: CustomBottomSheetProps) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
                <View style={styles.sheet}>
                    <View style={styles.handleContainer}>
                        <View style={styles.handle} />
                    </View>

                    <View style={styles.header}>
                        <View style={styles.headerSpacer} />
                        <AppText
                            text={title}
                            color={Colors.white}
                            fontSize={18}
                            fontName="CircularStd-Bold"
                            style={styles.title}
                            textAlign="center"
                        />
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <View style={styles.closeIconContainer}>
                                <X color={Colors.white} size={20} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.content, contentStyle]}>
                        {children}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    sheet: {
        backgroundColor: '#1A1A1A',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
        minHeight: '94%',
        maxHeight: '98%',
        width: '100%',
    },
    handleContainer: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#555',
        borderRadius: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerSpacer: {
        width: 40, // To balance the close button
    },
    title: {
        flex: 1,
        fontWeight: 600
    },
    closeButton: {
        padding: 5,
    },
    closeIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#303030',
        borderRadius: 15,
        width: 30,
        height: 30
    },
    content: {
        paddingHorizontal: 20,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    }
});

export default CustomBottomSheet;
