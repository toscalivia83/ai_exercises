const fs = require('fs');
var _ = require('lodash');

// Open file and read it
const fileName = process.argv[2];
const fileNameAnswer = `${fileName}.answer`;
if (!fileName) {
  throw 'No filename specified';
}
const coordinatesFromFile = fs.readFileSync(fileName, 'UTF-8');

let coordinates;

// Getters
const getStart = () => coordinates[0];
const getEnd = () => coordinates[coordinates.length - 1];
const getXValue = (coordinate) => coordinate.charAt(1);
const getYValue = (coordinate) => coordinate.charAt(3);
const getXValueEndPoint = () => getXValue(getEnd());
const getYValueEndPoint = () => getYValue(getEnd());
const isStartCell = (x, y) => getXValue(getStart()) == x && getYValue(getStart()) == y;
const getStartCoordinates = (coordinates) =>
  coordinates.find(c => isStartCell(c.x, c.y));
const getMaximumXCoordinate = () => getXValue(_.maxBy(coordinates, coordinate => getXValue(coordinate)));
const getMaximumYCoordinate = () => getYValue(_.maxBy(coordinates, coordinate => getYValue(coordinate)));
const getFlatCoordinateFormat = (x, y) => `x${x}y${y}`;
const getVectorCoordinateWithCounter = (x, y, counter) => ({ x, y, counter });
const getBestCoordinatesSuiteByCounter = (coordinates, counter) =>
  coordinates.filter(coordinate => coordinate.counter === counter);
const getAdjacentCells = (cell, counter) => {
  const { x, y } = cell;
  
  return [
    { x: x, y: y-1, counter },
    { x: x+1, y: y, counter },
    { x: x, y: y+1, counter },
    { x: x-1, y: y, counter },
  ];
};

// Used to determine which type in the map is the coordinate
function getPointType(x, y) {
  if (isFlatCoordinateFormatOfStartCell(x, y)) {
    return 'S';
  } else if (isFlatCoordinateFormatOfEnd(x, y)) {
    return 'E';
  } else if (isReef(x, y)) {
    return 'x';
  } else if (isTheBestPath(x, y)) {
    return '0';
  } else if (!isInCoordinates(x, y)) {
    return '.';
  } else {
    return '.';
  }
}

const isInCoordinates = (x, y) => Boolean(
  coordinates.includes(getFlatCoordinateFormat(x, y)) && isReef(x, y)
);
const isFlatCoordinateFormatOfStartCell = (x, y) => getFlatCoordinateFormat(x, y) === getStart();
const isFlatCoordinateFormatOfEnd = (x, y) => getFlatCoordinateFormat(x, y) === getEnd();
const isReef = (x, y) => Boolean(
  coordinates.includes(getFlatCoordinateFormat(x, y))
  && !isFlatCoordinateFormatOfStartCell(x, y)
  && !isFlatCoordinateFormatOfEnd(x, y)
);
const isOutOfBound = (adjacentCell) =>
  adjacentCell.x > getMaximumXCoordinate(coordinates)
  || adjacentCell.x < 0
  || adjacentCell.y > getMaximumYCoordinate(coordinates)
  || adjacentCell.y < 0
  || isReef(adjacentCell.x, adjacentCell.y);
const isAlreadyInAdjacentCellsWithLowerCounter = (validAdjacentCells, cell) =>{
  return validAdjacentCells.some((adjacentCell) => {
    return adjacentCell.x === cell.x && adjacentCell.y === cell.y && adjacentCell.counter<=cell.counter;
  });
};
const isAlreadyInListWithSmallerOrEqualCounter = (validAdjacentCells, cell) => {
  return isAlreadyInAdjacentCellsWithLowerCounter(validAdjacentCells, cell);
};
const isDirectAdjacent = (coordinate, nextCoordinate) => {
  const directCoordinates = [
    { x: coordinate.x, y: coordinate.y-1, counter: coordinate.counter-1 },
    { x: coordinate.x+1, y: coordinate.y, counter: coordinate.counter-1 },
    { x: coordinate.x, y: coordinate.y+1, counter: coordinate.counter-1 },
    { x: coordinate.x-1, y: coordinate.y, counter: coordinate.counter-1 },
  ];
  return directCoordinates.find(coordinate =>
    coordinate.x == nextCoordinate.x && coordinate.y == nextCoordinate.y && coordinate.counter == nextCoordinate.counter
  );
}
const adjacentCellsHaveReachedStartCell = (adjacentCells) => adjacentCells.some(cell => isStartCell(cell.x, cell.y));
const isTheBestPath = (x, y) => bestPath().some(coordinate => coordinate.x == x && coordinate.y == y);

const parseInput = (input) => input.split(',').map(val => val.replace(/\s+/g, ''));

// All functions to draw the map visually
const drawMap = () => {
  const maximumXCoordinate = getMaximumXCoordinate(coordinates);
  const maximumYCoordinate = getMaximumYCoordinate(coordinates);

  let map = '';

  for(j=0;j<=maximumYCoordinate; j++) {
    for(i=0; i<=maximumXCoordinate; i++) {
      map = map.concat(getPointType(i, j));
      if (i===parseInt(maximumXCoordinate)) map = map.concat('\n');
    }
  }

  return map;
};

const createMap = (coordinatesFromFile) => {
  coordinates = parseInput(coordinatesFromFile);
  return drawMap();
};

const findPathWithinAvaiableCoordinates = (coordinates) => {
  const bestCoordinatesSuite = [];
  const coordinatesFromStart = coordinates.reverse();
  const maximumCounter = _.maxBy(coordinatesFromStart, coordinate => coordinate.counter).counter;
  
  for (let i=maximumCounter; i >0; i--) {
    if(i === maximumCounter) {
      const startCoordinates = getStartCoordinates(coordinates);
      bestCoordinatesSuite.push(startCoordinates);
    } else {
      let bestsWithCounter = getBestCoordinatesSuiteByCounter(coordinates, i);
      const bestsAdjacentPoints = bestsWithCounter.length > 1
        ? bestsWithCounter.filter(coordinate => isDirectAdjacent(bestCoordinatesSuite[bestCoordinatesSuite.length-1], coordinate))
        : bestsWithCounter;
      bestCoordinatesSuite.push(bestsAdjacentPoints[0]); // get the first one by default
    }
  }
  return bestCoordinatesSuite;
}

const findBestPath = () => {
  let validAdjacentCells = [];
  let lastAdjacentCells = [];

  const endPointVectorCoordinatesWithCounterFormat = () =>
    getVectorCoordinateWithCounter(parseInt(getXValueEndPoint()), parseInt(getYValueEndPoint()), 0);
  
  // Add endPoint to first adjacentCells
  validAdjacentCells.push(endPointVectorCoordinatesWithCounterFormat());
  lastAdjacentCells.push(endPointVectorCoordinatesWithCounterFormat());

  let iterator = 1;
  let currentAdjacentCells = [];
  
  do {
    lastAdjacentCells.forEach(cell => {
      const cells = getAdjacentCells(cell, iterator);
      let filteredCells = filteredAdjacentCells(validAdjacentCells, cells);

      currentAdjacentCells = currentAdjacentCells.concat(filteredCells);
      validAdjacentCells = validAdjacentCells.concat(filteredCells);
    })

    lastAdjacentCells = currentAdjacentCells;
    currentAdjacentCells = [];
    iterator++;
  } while(!adjacentCellsHaveReachedStartCell(validAdjacentCells));

  return findPathWithinAvaiableCoordinates(validAdjacentCells); 
}

const filteredAdjacentCells = (validAdjacentCells, adjacentCells) => {
  const newAdjCells =  adjacentCells.filter(adjacentCell =>
    !isOutOfBound(adjacentCell) && !isAlreadyInListWithSmallerOrEqualCounter(validAdjacentCells, adjacentCell)
  );
  return newAdjCells;
};

const bestPath = () => findBestPath();

const map = createMap(coordinatesFromFile);
console.log(map);

fs.writeFileSync(fileNameAnswer, map);

// TODO:
// Handle error paths
// split this into multiple files ? What should they be ?
