const fs = require('fs');
var _ = require('lodash');
const crypto = require('crypto');

// Open file and read it
const fileName = process.argv[2];
const fileNameAnswer = `${fileName}.answer`;
if (!fileName) {
  throw 'No filename specified';
}
const data = fs.readFileSync(fileName, 'UTF-8');

const dataFromFileSplitted = data.split(',');
const salt = dataFromFileSplitted[0];
const integer = dataFromFileSplitted[1];

// Getters
const getSaltAndIterator = (salt, iterator) => salt+iterator;
const getHexadecimalMD5Hash = (value) => crypto.createHash('md5').update(value).digest("hex");
const getNumberFirstZeros = (hexadecimal) => hexadecimal.match(/^[0]+/) ? hexadecimal.match(/^[0]+/)[0].length : 0;
const getMatchIndexInOutput = (hexadecimalMD5Hash, integer) => hexadecimalMD5Hash.charAt(integer);
const getCharacterIndex = (iterator) => iterator % 32;
const getCharacterInHash = (hexadecimalMD5Hash, iterator) => hexadecimalMD5Hash.charAt(getCharacterIndex(iterator));
const getNumberFilledValues = (outputArray) => outputArray.filter(String).length;

const isAMatch = (hexadecimalMD5Hash, integer) => Boolean(getNumberFirstZeros(hexadecimalMD5Hash) >= integer);
const hasValue = (outputArray, index) => Boolean(outputArray[parseInt(index)]);
const hasFoundOutput = (outputArray) => Boolean(outputArray.length === getNumberFilledValues(outputArray));

const findCharacterInHash = (outputArray, salt, integer, iterator) => {
  let hexadecimalMD5Hash = getHexadecimalMD5Hash(getSaltAndIterator(salt, iterator));

  if (isAMatch(hexadecimalMD5Hash, integer)) {
    const matchIndex = getMatchIndexInOutput(hexadecimalMD5Hash, integer);
    const number = parseInt(matchIndex);

    if (Number.isInteger(number)) {
      const characterInHash = getCharacterInHash(hexadecimalMD5Hash, iterator);
      if (!hasValue(outputArray, matchIndex)) {
        outputArray[parseInt(matchIndex)] = characterInHash;
      }
    }

  }

  return outputArray;
}

// Main function used to get the hash output
const getHashOuput = (salt, integer) => {
  let outputArray = new Array(10);
  let iterator = 1;
  
  do {
    outputArray = findCharacterInHash(outputArray, salt, integer, iterator);
    
    console.log('outputArray', outputArray, iterator);
  
    iterator++;
  } while (!hasFoundOutput(outputArray));

  return outputArray;
};

const outputArray = getHashOuput(salt, integer);

fs.writeFileSync(fileNameAnswer, outputArray.join(''));
