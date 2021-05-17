"use strict";

import "./sass/style.scss";

import { getJSON } from "./rest_actions.js";


// personel.js
import { displayBartenders } from "./personel.js";
import { updateBartenders } from "./personel.js";

//updateUI.js 
import { getDataToUpdate } from "./updateUI.js"; 
import { getDataToAppend } from "./updateUI.js"; 
import { getDataToRemove } from "./updateUI.js"; 

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

function determineDataToUpdate(newData, oldData) {
  const bartendersToUpdate = getDataToUpdate(newData.bartenders, oldData.bartenders, "name");
  updateBartenders(bartendersToUpdate);
}



//inital displaying UI;
// sammenligner new med old - dvs vi får alt dataen
// append

//update UI
//sammenligner new med old - dvs vi får noget af dataen
//append
//sammeligner old med med
//remove
//Find elementer der staig eksisterer men har ændret sig (brug data-set)
