"use strict";
import CircleChart from "circle-chart";

import { getTimeInSeconds } from "./orders.js";

const todaysNumbersObj = {
  soldBeers: 0,
  servedBeers: 0,
  bestBeer: "",
  bestBartender: "",
  longestWait: 0,
  longestWaitInMin: "",
};

const beersSold = [];
const bartenderSales = [];
const receivedOrders = [];

let theCircleChart = null;

// Initially builds the beersSold and bartenderObj
export function setTodaysNumbers(data) {
  // push each beer from the storage array into the beersSold array
  data.storage.forEach((beer) => {
    const beerObj = {
      beerName: beer.name,
      beerAmount: 0,
    };
    beersSold.push(beerObj);
  });

  // push each bartender from the bartender array into the bartenderSales array
  data.bartenders.forEach((bartender) => {
    const bartenderObj = {
      bartenderName: bartender.name,
      bartenderAmount: 0,
      servingId: null,
    };
    bartenderSales.push(bartenderObj);
  });

  setCircleChart();

  updateTodaysNumbers(data);
  updateCircleChart();
}

// Controller for updating todays numbers
export function updateTodaysNumbers(data) {
  doesOrderExist(data.serving);
  doesOrderExist(data.queue);
  updateBartenderSales(data.bartenders, data.serving);

  todaysNumbersObj.bestBartender = getBestBartender();
  todaysNumbersObj.bestBeer = getBestBeer();
  data.serving.forEach(updateLongestWaitingTime);
  data.queue.forEach(updateLongestWaitingTime);

  updateCircleChart();

  updateUi();
}

//
//
//
// PERFORMANCE / CIRCLE CHART
// Initially builds the chartDefinitions array (NPM module), and appends an li elemt forEach bartender
function setCircleChart() {
  const chartDefinitions = [];

  bartenderSales.forEach((bartender) => {
    //an object with bartender data is pushed to chartDef
    const nameLower = bartender.bartenderName.toLowerCase();
    const defObject = {
      label: bartender.bartenderName,
      name: nameLower,
      cls: nameLower,
      value: 25,
    };
    chartDefinitions.push(defObject);

    setupChartLi(bartender);
  });

  const chartObject = {
    $container: document.querySelector("#performance .container"),
    isPie: true,
    animated: false,
    middleCircleColor: "transparent",
    background: "transparent",
    definition: chartDefinitions,
  };

  theCircleChart = new CircleChart(chartObject);
}

//Create li elm for bartender
function setupChartLi(bartender) {
  const container = document.querySelector("#performance ul");
  const newLi = document.createElement("li");
  newLi.classList = bartender.bartenderName;
  const bullet = document.createElement("span");
  bullet.classList = "bullet";
  const txt = document.createElement("span");
  txt.classList = "txt";

  newLi.appendChild(bullet);
  newLi.appendChild(txt);
  container.appendChild(newLi);
}

// Updates the circle chart (NPM module)
function updateCircleChart() {
  const statsToUpdate = {};

  bartenderSales.forEach((bartender) => {
    statsToUpdate[bartender.bartenderName.toLowerCase()] = bartender.bartenderAmount;
    updatePerformanceList(bartender);
  });

  theCircleChart.update(statsToUpdate);
}

// Updates the performance li-elements
function updatePerformanceList(bartender) {
  const container = document.querySelector(`#performance .${bartender.bartenderName}`);
  const amount = ((bartender.bartenderAmount / todaysNumbersObj.servedBeers) * 100).toFixed(0);
  container.querySelector(".txt").textContent = `${bartender.bartenderName}: ${amount}%`;
}

//
//
//
// BEERS SOLD
// Excludes orders that are already included in the statics - only update the statistic with new orders.
function doesOrderExist(data) {
  data.forEach((orderList) => {
    const doesExist = receivedOrders.includes(orderList.id);
    if (doesExist === false) {
      receivedOrders.push(orderList.id);

      orderList.order.forEach(updateBeersSold);
    }
  });
}

// Updates total beers sold with the new orders form doesOrdersExist
function updateBeersSold(beer) {
  const beerToUpdate = beersSold.filter(compareBeerNames);

  beerToUpdate[0].beerAmount++;
  todaysNumbersObj.soldBeers++;

  function compareBeerNames(beerFromList) {
    if (beerFromList.beerName === beer) {
      return true;
    } else {
      return false;
    }
  }
}

// Returns the most sold beer from beerSold array.
function getBestBeer() {
  let result = null;
  let bestAmount = 0;
  beersSold.forEach((beer) => {
    if (beer.beerAmount > bestAmount) {
      bestAmount = beer.beerAmount;
      result = beer.beerName;
    }
  });
  return result;
}

//
//
//
// bartenderSales - global array
// Updates the objects in bartenderSales
function updateBartenderSales(bartenders, servings) {
  //Foreach bartender, find get the bartender-object from global bartender-array
  bartenders.forEach((bartender) => {
    const bartenderFromList = bartenderSales.filter(compareBartenders)[0];

    //Only update the sales-amount if the order-id isnt already included
    if (bartender.servingCustomer !== bartenderFromList.servingId) {
      //then we update the current order in the global array
      bartenderFromList.servingId = bartender.servingCustomer;

      //And adds this order, to amount of beers served
      const amountToAdd = getAmountFromOrderArray(bartender.servingCustomer, servings);
      bartenderFromList.bartenderAmount += amountToAdd;
      todaysNumbersObj.servedBeers += amountToAdd;
    }

    //Closure function for filtering the right bartender from global bartender-array
    function compareBartenders(bartenderObj) {
      if (bartenderObj.bartenderName === bartender.name) {
        return true;
      } else {
        return false;
      }
    }
  });
}

// Returns the amount of objects / beers, in order-array
function getAmountFromOrderArray(id, servings) {
  //Find the order that matches the bartenders serving-id
  const theOrder = servings.filter(compareIds);

  let amount = 0;

  if (theOrder.length !== 0) {
    //For each beer, ++ to amount
    theOrder[0].order.forEach((beer) => {
      amount++;
    });
  }
  return amount;

  function compareIds(order) {
    if (order.id === id) {
      return true;
    } else {
      return false;
    }
  }
}

// Returns best bartender with most beers served - for "top bartender"
function getBestBartender() {
  let result = null;
  let bestAmount = 0;
  bartenderSales.forEach((bartender) => {
    if (bartender.bartenderAmount > bestAmount) {
      bestAmount = bartender.bartenderAmount;
      result = bartender.bartenderName;
    }
  });
  return result;
}

//
//
//
// LONGEST WATING TIME
function updateLongestWaitingTime(order) {
  const currentEpoch = Date.now();
  const differenceInMin = ((currentEpoch - order.startTime) / 60000).toFixed(2);

  if (differenceInMin > todaysNumbersObj.longestWait) {
    todaysNumbersObj.longestWait = differenceInMin;
    todaysNumbersObj.longestWaitInMin = getTimeInSeconds(differenceInMin);
  }
}

//
//
//
// Updates the UI with the new numbers from todaysNumbersObj
function updateUi() {
  const todaysNrsCont = document.querySelector("#todays_numbers");
  todaysNrsCont.querySelector(".beers_sold .txt").textContent = todaysNumbersObj.soldBeers;
  todaysNrsCont.querySelector(".best_beer .txt").textContent = todaysNumbersObj.bestBeer;
  todaysNrsCont.querySelector(".best_bartender .txt").textContent = todaysNumbersObj.bestBartender;
  todaysNrsCont.querySelector(".longest_waiting_time .txt").textContent = todaysNumbersObj.longestWaitInMin;
}
