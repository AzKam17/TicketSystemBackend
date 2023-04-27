//load tailwind.config.js as a PostCSS plugin
const tailwindcss = require('tailwindcss');
//load autoprefixer as a PostCSS plugin
const autoprefixer = require('autoprefixer');
const tailwindConfig = require('./tailwind.config.js');

module.exports = {
    plugins: [tailwindcss(tailwindConfig), autoprefixer],
}