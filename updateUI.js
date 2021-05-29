"use strict";

export function getDataToUpdate(newData, oldData, id) {
  const result = [];

  newData.forEach((newObject) => {
    //NOTE: filter always returns an array, even though we only need 1 object.
    const objectToUpdate = oldData.filter(compareData);

    //If the object-id's are the same, but parts of the object(.stringify) have changed, return the object
    function compareData(oldObject) {
      if (oldObject[id] === newObject[id] && JSON.stringify(oldObject) !== JSON.stringify(newObject)) {
        return newObject;
      } else {
        return false;
      }
    }

    //Fallback if the array is empty
    if (objectToUpdate[0] !== undefined) {
      result.push(objectToUpdate[0]);
    }
  });

  return result;
}

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
