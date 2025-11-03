// postcss-kazaksha/index.js
const postcss = require('postcss');
const dictionary = require('./dictionary');


const translateCustomProperty = (prop) => {
  if (!prop.startsWith('--')) return prop;
  const varName = prop.substring(2);
  const translated = dictionary[varName];
  return translated ? `--${translated}` : prop;
};

const translateCSSVariables = (value) =>
  value.replace(/var\(\s*--([^)]+)\s*\)/g, (match, varName) => {
    const translated = dictionary[varName.trim()];
    return translated ? `var(--${translated})` : match;
  });

const isWordChar = (char) => {
  if (!char) return false;
  return /[a-zA-Zа-яА-ЯәіңғүұқөһӘІҢҒҮҰҚӨҺ0-9_-]/.test(char);
};

const isWordBoundary = (str, startPos, endPos) => {
  const before = startPos > 0 ? str[startPos - 1] : '';
  const after = endPos < str.length ? str[endPos] : '';
  return !isWordChar(before) && !isWordChar(after);
};

const translateValues = (value) => {
  const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);
  
  return sortedKeys.reduce((acc, kazakh) => {
    let result = acc;
    let searchFrom = 0;
    
    while (true) {
      const index = result.indexOf(kazakh, searchFrom);
      if (index === -1) break;
      
      const endIndex = index + kazakh.length;
      if (isWordBoundary(result, index, endIndex)) {
        result = result.substring(0, index) + dictionary[kazakh] + result.substring(endIndex);
        searchFrom = index + dictionary[kazakh].length;
      } else {
        searchFrom = index + 1;
      }
    }
    
    return result;
  }, value);
};

const translateProperty = (prop) =>
  dictionary[prop.toLowerCase()] || prop;

module.exports = postcss.plugin('postcss-kazaksha', () => {
  return (root) => {
    root.walkDecls((decl) => {
      const translatedValue = [translateCSSVariables, translateValues]
        .reduce((value, transform) => transform(value), decl.value);
      
      const translatedProp = decl.prop.startsWith('--') 
        ? translateCustomProperty(decl.prop)
        : translateProperty(decl.prop);
      
      decl.value = translatedValue;
      decl.prop = translatedProp;
    });
    
        root.walkAtRules((atRule) => {
      if (atRule.params) {
        atRule.params = translateValues(atRule.params);
      }
    });
  };
});

module.exports.postcss = true;