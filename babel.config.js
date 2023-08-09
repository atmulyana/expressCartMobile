module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        'react-native-reanimated/plugin',
        
        /*** Adding plugins here causes FlatList error. Move them to package.json ****/
        //   //["@babel/plugin-proposal-class-properties", { loose: true }],
        //   ["@babel/plugin-proposal-private-methods", { loose: true }], /*** enables private methods */
        //   ["@babel/plugin-proposal-private-property-in-object", { loose: true }], /*** enables private properties */

    ],
};
