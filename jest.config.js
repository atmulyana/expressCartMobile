module.exports = {
    preset: "react-native",
    setupFiles: [],
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[jt]s?(x)",
        "!**/__tests__/_includes/**"
    ],
    transformIgnorePatterns: [
        "node_modules/(?!(jssimpledateformat"
            + "|react-native"
            + "|@react-native"
            + "|react-native-feather"
            + "|react-native-form-input-validator"
            + "|@react-native-picker"
            + "|react-native-reanimated"
            + "|react-native-webview"
            + "|rn-flex-image"
            + "|rn-images-slider"
            + "|rn-select-option"
            + "|rn-style-props"
        + ")/)"
    ],
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__tests__/_includes/asset-files-mock.js"
    }
};
