// postcss-kazaksha/index.js
const postcss = require('postcss');
const dictionary = require('./dictionary');


module.exports = postcss.plugin('postcss-kazaksha', () => {
  return (root) => {
    root.walkDecls((decl) => {
      if (decl.prop.startsWith('--')) {
        const varName = decl.prop.substring(2);
        const translatedVar = dictionary[varName];
        if (translatedVar) {
          decl.prop = `--${translatedVar}`;
        }
      }
      
      const translatedProp = dictionary[decl.prop.toLowerCase()];
      if (translatedProp) {
        decl.prop = translatedProp;
      }
      
      let value = decl.value;
      
      value = value.replace(/var\(\s*--([^)]+)\s*\)/g, (match, varName) => {
        const translatedVar = dictionary[varName.trim()];
        return translatedVar ? `var(--${translatedVar})` : match;
      });
      
      Object.keys(dictionary).forEach((kazakh) => {
        const regex = new RegExp(`\\b${kazakh}\\b`, 'gi');
        value = value.replace(regex, dictionary[kazakh]);
      });
      
      decl.value = value;
    });
    
        root.walkAtRules((atRule) => {
      if (atRule.params) {
        let params = atRule.params;
        Object.keys(dictionary).forEach((kazakh) => {
          const regex = new RegExp(`\\b${kazakh}\\b`, 'gi');
          params = params.replace(regex, dictionary[kazakh]);
        });
        atRule.params = params;
      }
    });
  };
});

module.exports.postcss = true;