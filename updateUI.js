"use strict"; 

export function getDataToUpdate(newData, oldData, id) {
  const result = []; 

  newData.forEach((newObject) => {
     
    const objectToUpdate = oldData.filter(compareData);

    function compareData(oldObject) {
      if (
        JSON.stringify(oldObject) !== JSON.stringify(newObject) &&
        oldObject[id] === newObject[id]
      ) {
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



export function getDataToAppend(newData, oldData, id) {
   const indenticalObjects = findIdenticalObjects(newData, oldData, id); 
   const dataToAppend = newData; 
   for (let  i = 0; i < indenticalObjects.length; i++) {
     if (indenticalObjects[i][id] === dataToAppend[i][id]) {
dataToAppend.shift(); 
     }
   }


   
}

function findIdenticalObjects(newData, oldData, id) {
  const result = [];

  newData.forEach((newObject) => {
    const objectToAppend = oldData.filter(compareData);
    function compareData(oldObject) {
      if (newObject[id] === oldObject[id]) {
        return true;
      } else {
        return false;
      }
    }

    if (objectToAppend[0] !== undefined) {
      result.push(objectToAppend[0]);
    }
  });

  return result;
}





export function getDataToRemove() {}
