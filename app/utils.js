const { format } = require('date-fns')

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}

function stringToBinary(input) {
    var characters = input.split('');
  
    return characters.map(function(char) {
      const binary = char.charCodeAt(0).toString(2)
      const pad = Math.max(8 - binary.length, 0);
      // Just to make sure it is 8 bits long.
      return '0'.repeat(pad) + binary;
    }).join('');
  }

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  function toDate(year, month, day) {
    let date = new Date()
    date.setUTCFullYear(year, month-1, day)
    return date
}

function dateString(year, month, day) {
    return format(toDate(year, month, day), "eee dd MMM yyyy").toUpperCase()
}

function colorToMaterialName(color) {
    switch(color) {
        case 0: return "Blue"
        case 1: return "Red"
        case 2: return "Green"
        case 3: return "Black"
        case 4: return "Silver"
        case 5: return "Gold"
        case 6: return "Neon"
        case 7: return "Pearl"
    }
    return ""
}

function isLeapYear(year) {
    return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

module.exports = {
    dec2bin,
    stringToBinary,
    isNumeric,
    dateString,
    colorToMaterialName,
    isLeapYear,
    toDate
}