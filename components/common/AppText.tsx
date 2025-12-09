import React from "react";
import { Text, TextStyle, StyleSheet } from "react-native";
import { wp } from "../../constant/constants";
import { NavigationProp, useNavigation } from "@react-navigation/native";
type Props = {
    text?: string
    lines?: number
    fontName?: "CircularStd-Bold" | "CircularStd-Medium" | "CircularStd-Book",
    fontSize?: number,
    color?: string,
    marginVertical?: number
    padding?: number
    textAlign?: 'center' | 'left' | 'right' | 'justify',
    style?: TextStyle | any,
    route?: any
}
export default ({
    lines, fontName, fontSize = Number(wp(3.5)), color,
    marginVertical, textAlign, text, padding, style, route
}: Props) => {
    return (
        <Text numberOfLines={lines}
            style={[styles.text, {
                fontFamily: fontName,
                fontSize,
                color: color || "#000",
                marginVertical, textAlign, padding,
                
            }, style]}
        >
            {text} 
        </Text >
    );
}

const styles = StyleSheet.create({
    text: {
        // You can add any default styles here if needed
    }
});
