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



export function getDataToAppend() {}
export function getDataToRemove() {}
