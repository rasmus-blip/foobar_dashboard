"use strict";

import { getJSON } from "./rest_actions.js";

window.addEventListener("DOMContentLoaded", init);

async function init() {
  let newData;
  let oldData;

  const url = "https://foobarfirefjerdedele.herokuapp.com/";
  newData = await getJSON(url);

  displayDataInit(newData);

  setInterval(updateData, 5000);

  async function updateData() {
    oldData = newData;
    newData = await getJSON(url);

    const dataToUpdate = compareData(oldData, newData);
    console.log(dataToUpdate.length);
    if (dataToUpdate.length > 0) {
      updateUI(dataToUpdate);
    }
  }
}

function displayDataInit(data) {
  const peter = document.querySelector("#Peter");
  const dannie = document.querySelector("#Dannie");
  const jonas = document.querySelector("#Jonas");

  data.bartenders.forEach((person) => {
    if (person.name === "Peter") {
      peter.querySelector(".using_tap").textContent = person.usingTap;
    }
  });
}

function compareData(oldData, newData) {
  let result;

  oldData.bartenders.forEach((oldObject) => {
    result = newData.bartenders.filter(comparingBartenders);

    function comparingBartenders(newObject) {
      if (JSON.stringify(oldObject) !== JSON.stringify(newObject) && newObject.name === oldObject.name) {
        return true;
      } else {
        return false;
      }
    }
  });

  return result;
}

function updateUI(data) {
  console.log("update");

  data.forEach((object) => {
    const person = document.querySelector("#" + object.name);
    person.querySelector(".using_tap").textContent = object.usingTap;
    console.log(object.usingTap);
  });
}
