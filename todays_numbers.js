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

const chartDefinitions = [];

const chartObject = {
  $container: document.querySelector("#performance .container"),
  isPie: true,
  animated: false,
  middleCircleColor: "transparent",
  background: "transparent",
  definition: chartDefinitions,
};

let chartToUpdate = null;

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

function setCircleChart() {
  // foreach bartender
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

    //li element for each bartender is created and appended to DOM
    const container = document.querySelector("#performance ul");
    const newLi = document.createElement("li");
    newLi.classList = bartender.bartenderName;
    container.appendChild(newLi);
  });

  //creating chart
  chartToUpdate = new CircleChart(chartObject);
}

function updateCircleChart() {
  const statsToUpdate = {};

  bartenderSales.forEach((bartender) => {
    statsToUpdate[bartender.bartenderName.toLowerCase()] = bartender.bartenderAmount;
    updatePerformanceList(bartender);
  });

  chartToUpdate.update(statsToUpdate);
}

function updatePerformanceList(bartender) {
  const container = document.querySelector(`#performance .${bartender.bartenderName}`);
  const amount = ((bartender.bartenderAmount / todaysNumbersObj.servedBeers) * 100).toFixed(0);
  container.textContent = `${bartender.bartenderName}: ${amount}%`;

  //TODO: set bullet for the bartender
}

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

function doesOrderExist(data) {
  data.forEach((orderList) => {
    const doesExist = receivedOrders.includes(orderList.id);
    if (doesExist === false) {
      receivedOrders.push(orderList.id);

      orderList.order.forEach(updateBeersSold);
    }
  });
}

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

function updateBartenderSales(bartenders, servings) {
  //Foreach bartender, find get the bartender-object from global bartender-array
  bartenders.forEach((bartender) => {
    const bartenderFromList = bartenderSales.filter(compareBartenders);

    //Only update the sales-amount if dont already have included that order
    if (bartender.servingCustomer !== bartenderFromList[0].servingId) {
      //then we update the current order in the global array
      bartenderFromList[0].servingId = bartender.servingCustomer;

      //And adds this order, to amount of beers served
      const amountToAdd = getAmountFromString(bartender.servingCustomer, servings);
      bartenderFromList[0].bartenderAmount += amountToAdd;
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

function getAmountFromString(id, servings) {
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

function updateLongestWaitingTime(order) {
  const currentEpoch = Date.now();
  const differenceInMin = ((currentEpoch - order.startTime) / 60000).toFixed(2);

  if (differenceInMin > todaysNumbersObj.longestWait) {
    todaysNumbersObj.longestWait = differenceInMin;
    todaysNumbersObj.longestWaitInMin = getTimeInSeconds(differenceInMin);
  }
}

function updateUi() {
  const todaysNrsCont = document.querySelector("#todays_numbers");
  todaysNrsCont.querySelector(".beers_sold .txt").textContent = todaysNumbersObj.soldBeers;
  todaysNrsCont.querySelector(".best_beer .txt").textContent = todaysNumbersObj.bestBeer;
  todaysNrsCont.querySelector(".best_bartender .txt").textContent = todaysNumbersObj.bestBartender;
  todaysNrsCont.querySelector(".longest_waiting_time .txt").textContent = todaysNumbersObj.longestWaitInMin;
}
