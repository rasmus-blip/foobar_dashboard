"use strict";

export function getDataToUpdate(newData, oldData, id) {
  const result = [];

  newData.forEach((newObject) => {
    const objectToUpdate = oldData.filter(compareData);

    function compareData(oldObject) {
      if (JSON.stringify(oldObject) !== JSON.stringify(newObject) && oldObject[id] === newObject[id]) {
        return newObject;
      } else {
        return false;
      }
    }

    if (objectToUpdate[0] !== undefined) {
      result.push(objectToUpdate[0]);
    }
  });

  return result;
}

// export function getDataToAppend(newData, oldData, id) {
//   const indenticalObjects = findIdenticalObjects(newData, oldData, id);
//   const dataToAppend = newData;
//   for (let i = 0; i < indenticalObjects.length; i++) {
//     if (indenticalObjects[i][id] === dataToAppend[i][id]) {
//       dataToAppend.shift();
//     }
//   }
// }

export function getDataToAppend(newData, oldData, id) {
  const result = [...newData];

  newData.forEach((newObject) => {
    oldData.forEach((oldObject) => {
      if (newObject[id] === oldObject[id]) {
        const objectIndex = result.indexOf(newObject);
        result.splice(objectIndex, 1);
      }
    });
  });

  return result;
}

function findIdenticalObjects(newData, oldData, id) {
  const result = [];

  newData.forEach((newObject) => {
    const identicalObject = oldData.filter(compareData);

    function compareData(oldObject) {
      if (newObject[id] === oldObject[id]) {
        return true;
      } else {
        return false;
      }
    }

    if (identicalObject[0] !== undefined) {
      result.push(identicalObject[0]);
    }
  });

  return result;
}

export function getDataToRemove(newData, oldData, id) {
  const result = [...oldData];

  oldData.forEach((oldObject) => {
    newData.forEach((newObject) => {
      if (oldObject[id] === newObject[id]) {
        const objectIndex = result.indexOf(oldObject);
        result.splice(objectIndex, 1);
      }
    });
  });

  return result;
}
