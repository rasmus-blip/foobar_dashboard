"use strict";

import "./sass/style.scss";

import { getJSON } from "./rest_actions.js";

window.addEventListener("DOMContentLoaded", init);

async function init() {
  const url = "https://foobarfirefjerdedele.herokuapp.com/";
  let newData = await getJSON(url);
  let oldData = [];

  displayDataInit(newData);

  setInterval(updateDataArrays, 2000);

  async function updateDataArrays() {
    oldData = newData;
    newData = await getJSON(url);

    determineDataToUpdate(newData, oldData);
  }
}

function displayDataInit(data) {
  displayBartenders(data.bartenders);

  //TODO ny function for hvert objekt
}

function displayBartenders(bartenders) {
  const container = document.querySelector("#personel ul");
  const temp = document.querySelector("#bartenders_temp");
  console.log(bartenders);

  bartenders.forEach((bartender) => {
    const klon = temp.cloneNode(true).content;

    klon.querySelector("li").dataset.id = bartender.name.toLowerCase();
    klon.querySelector("h2").textContent = bartender.name;

    if (bartender.status === "WORKING") {
      klon.querySelector(".status span").textContent = getDetailText(bartender);
    } else {
      klon.querySelector(".status span").textContent = "Ready";
      klon.querySelector(".status span").classList.add("green");
    }

    container.appendChild(klon);

    console.log(klon);
  });
}

function getDetailText(bartender) {
  if (bartender.statusDetail === "pourBeer") {
    return `Pouring beer on tap #${bartender.usingTap}, for order #${bartender.servingCustomer}`;
  }

  if (bartender.statusDetail === "releaseTap") {
    return `Released tap, order #${bartender.servingCustomer}`;
  }

  if (bartender.statusDetail === "receivePayment") {
    return `Receiving payment from order #${bartender.servingCustomer}`;
  }

  if (bartender.statusDetail === "startServing") {
    return `Preparing order #${bartender.servingCustomer}`;
  }

  if (bartender.statusDetail === "replaceKeg") {
    return `Replacing keg on tap #${bartender.usingTap}`;
  }
}

function determineDataToUpdate(newData, oldData) {
  const bartendersToUpdate = getDataToUpdate(newData.bartenders, oldData.bartenders, "name");
  updateBartenders(bartendersToUpdate);
}

function getDataToUpdate(newData, oldData, id) {
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

function updateBartenders(bartenders) {
  bartenders.forEach((bartender) => {
    const container = document.querySelector(`#personel [data-id="${bartender.name.toLowerCase()}"]`);

    container.querySelector(".status span").textContent = getDetailText(bartender);
  });
}

function getDataToAppend() {}
function getDataToRemove() {}

//inital displaying UI;
// sammenligner new med old - dvs vi får alt dataen
// append

//update UI
//sammenligner new med old - dvs vi får noget af dataen
//append
//sammeligner old med med
//remove
//Find elementer der staig eksisterer men har ændret sig (brug data-set)
