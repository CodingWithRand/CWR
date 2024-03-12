// Credit to kavin-m-simform for the source code!

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size: number, screenWidth: number) => (screenWidth / guidelineBaseWidth) * size;
const verticalScale = (size: number, screenHeight: number) => (screenHeight / guidelineBaseHeight) * size;
const moderateScale = (size: number, screenWidth: number, factor = 0.5) => size + (horizontalScale(size, screenWidth) - size) * factor;

export { horizontalScale, verticalScale, moderateScale };