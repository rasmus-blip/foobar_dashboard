"use strict";

import "./sass/style.scss";

import { getJSON } from "./rest_actions.js";

import { setLoadAnimDelay } from "./loading.js";
import { mobileMenuSetup } from "./mobile_menu.js";

// personel.js
import { displayBartenders } from "./personel.js";
import { updateBartenders } from "./personel.js";

//orders.js
import { updateOrders } from "./orders.js";
import { appendOrders } from "./orders.js";
import { removeOrders } from "./orders.js";

//taps.js
import { toggleBeerSections } from "./beers.js";
import { appendTaps } from "./beers.js";
import { updateTaps } from "./beers.js";
import { appendStorage } from "./beers.js";
import { updateStorage } from "./beers.js";

//todays_numbers.js
import { updateTodaysNumbers } from "./todays_numbers.js";
import { setTodaysNumbers } from "./todays_numbers.js";

//updateUI.js
import { getDataToUpdate } from "./updateUI.js";
import { getDataToAppend } from "./updateUI.js";
import { getDataToRemove } from "./updateUI.js";

window.addEventListener("DOMContentLoaded", init);

async function init() {
  setTheming();
  setLoadAnimDelay();
  mobileMenuSetup();

  const url = "https://foobarfirefjerdedele.herokuapp.com/";
  let newData = await getJSON(url);
  let oldData = [];

  setTodaysNumbers(newData);

  displayDataInit(newData);

  const beerSectionBtns = document.querySelectorAll("#beers button");
  beerSectionBtns.forEach((btn) => {
    btn.addEventListener("click", toggleBeerSections);
  });

  setInterval(updateDataArrays, 5000);

  async function updateDataArrays() {
    oldData = newData;
    newData = await getJSON(url);

    determineDataToRemove(newData, oldData);
    determineDataToAppend(newData, oldData);
    determineDataToUpdate(newData, oldData);

    updateTodaysNumbers(newData);
    setTheming();

    //remove loadingscreen - should be fired just after init-display, but we think look so cool and deserves more spotlight :)
    document.querySelector("#loading").classList.remove("load");
  }
}

function displayDataInit(data) {
  displayBartenders(data.bartenders);

  const orderList = createOrdersArray(data.serving, data.queue);
  appendOrders(orderList);
  appendTaps(data.taps);
  appendStorage(data.storage);
}

function determineDataToRemove(newData, oldData) {
  //Orders
  const newOrderList = createOrdersArray(newData.serving, newData.queue);
  const oldOrderList = createOrdersArray(oldData.serving, oldData.queue);
  const ordersToRemove = getDataToRemove(newOrderList, oldOrderList, "id");
  removeOrders(ordersToRemove);
}

function determineDataToAppend(newData, oldData) {
  //Orders
  const newOrderList = createOrdersArray(newData.serving, newData.queue);
  const oldOrderList = createOrdersArray(oldData.serving, oldData.queue);
  const ordersToAppend = getDataToAppend(newOrderList, oldOrderList, "id");
  appendOrders(ordersToAppend);
}

function determineDataToUpdate(newData, oldData) {
  //Personel
  const bartendersToUpdate = getDataToUpdate(newData.bartenders, oldData.bartenders, "name");
  updateBartenders(bartendersToUpdate);

  //Taps
  const tapsToUpdate = getDataToUpdate(newData.taps, oldData.taps, "id");
  updateTaps(tapsToUpdate);

  //Storage
  const beersToUpdate = getDataToUpdate(newData.storage, oldData.storage, "name");
  updateStorage(beersToUpdate);

  //Orders
  //Orders updates waiting time, therefore its always the whole array - no need for getDataToUpdate
  const newOrderList = createOrdersArray(newData.serving, newData.queue);
  updateOrders(newData.serving, newData.bartenders, newOrderList);
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

function setTheming() {
  const hours = new Date().getHours();
  if (hours >= 18 || hours <= 6) {
    document.querySelector("body").classList.add("darkmode");
  } else {
    document.querySelector("body").classList.remove("darkmode");
  }
}
