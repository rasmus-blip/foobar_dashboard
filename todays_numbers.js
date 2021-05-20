"use strict";

const todaysNumbersObj = {
  soldBeers: 0,
  bestBeer: "",
  bestBartender: "",
  longestWait: 0,
};

const beersSold = [];

const bartenderSales = [];

const receivedOrders = [];

export function setTodaysNumbers(data) {
  // push each beer from the storage array into the beersSold array
  data.storage.forEach((beer) => {
    const beerObj = {
      beerName: beer.name,
      beerAmount: 0,
    };
    beersSold.push(beerObj);
  });

  data.bartenders.forEach((bartender) => {
    const bartenderObj = {
      bartenderName: bartender.name,
      bartenderAmount: 0,
    };
    bartenderSales.push(bartenderObj);
  });

  updateTodaysNumbers(data);
}

export function updateTodaysNumbers(data) {
  //   updateBeersSold(data.queue);
  updateBeersSold(data.serving);
}

function updateBeersSold(data) {
  console.log(data);
  data.forEach((orderList) => {
    orderList.order.forEach((beer) => {
      beersSold.forEach((beerObj) => {
        console.log(beer);
        const doesExist = receivedOrders.includes(orderList.id);
        if (
          JSON.stringify(beerObj.beerName) === JSON.stringify(beer) &&
          doesExist === false
        ) {
          beerObj.beerAmount++;
          receivedOrders.push(orderList.id);
        }
      });
    });
  });
}
