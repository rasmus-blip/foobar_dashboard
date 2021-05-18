"use strict";

import "./sass/style.scss";

import { getJSON } from "./rest_actions.js";

// personel.js
import { displayBartenders } from "./personel.js";
import { updateBartenders } from "./personel.js";

//orders.js
import { updateOrders } from "./orders.js";
import { calcWaitingTime } from "./orders.js";
import { appendOrders } from "./orders.js";
import { removeOrders } from "./orders.js";
import { updateServings } from "./orders.js";

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

  setTimeout(updateDataArrays, 5000);

  async function updateDataArrays() {
    oldData = newData;
    newData = await getJSON(url);

    determineDataToRemove(newData, oldData);
    determineDataToAppend(newData, oldData);
    determineDataToUpdate(newData, oldData);
  }
}

function displayDataInit(data) {
  displayBartenders(data.bartenders);

  const orderList = createOrdersArray(data.serving, data.queue);
  appendOrders(orderList);

  //TODO ny function for hvert objekt
}

function determineDataToRemove(newData, oldData) {
  const newOrderList = createOrdersArray(newData.serving, newData.queue);
  const oldOrderList = createOrdersArray(oldData.serving, oldData.queue);
  const ordersToRemove = getDataToRemove(newOrderList, oldOrderList, "id");
  removeOrders(ordersToRemove);
}

function determineDataToAppend(newData, oldData) {
  const newOrderList = createOrdersArray(newData.serving, newData.queue);
  const oldOrderList = createOrdersArray(oldData.serving, oldData.queue);
  const ordersToAppend = getDataToAppend(newOrderList, oldOrderList, "id");
  appendOrders(ordersToAppend);
}

function determineDataToUpdate(newData, oldData) {
  //Personel
  const bartendersToUpdate = getDataToUpdate(newData.bartenders, oldData.bartenders, "name");
  updateBartenders(bartendersToUpdate);

  //Orders
  updateServings(newData.serving, newData.bartenders);
  const newOrderList = createOrdersArray(newData.serving, newData.queue);
  calcWaitingTime(newOrderList);

  // const newOrderList = createOrdersArray(newData.serving, newData.queue);
  // const oldOrderList = createOrdersArray(oldData.serving, oldData.queue);
  // const ordersToUpdate = getDataToUpdate(newOrderList, oldOrderList, "id");
  // updateOrders(ordersToUpdate);

  //  const servingsToUpdate = getDataToUpdate(newData.serving, oldData.serving, "id");
}

function createOrdersArray(servings, queue) {
  const orders = [];

  servings.forEach((object) => {
    orders.push(object);
  });

  queue.forEach((object) => {
    orders.push(object);
  });

  return orders;
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
