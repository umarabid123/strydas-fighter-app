import { Dimensions } from "react-native"

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width
export const wp = (float: number) => WIDTH * float / 100
export const hp = (float: number) => HEIGHT * float / 100

// Design dimensions from Figma: 393px width x 852px height
export const DESIGN_WIDTH = 393
export const DESIGN_HEIGHT = 852