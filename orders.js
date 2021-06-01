export function appendOrders(orders) {
  const container = document.querySelector("#orders ol");
  const temp = document.querySelector("#orders_temp");

  orders.forEach((order) => {
    const klon = temp.cloneNode(true).content;
    klon.querySelector("li").dataset.id = order.id;
    klon.querySelector("h2").textContent = `#${order.id}`;
    const completeOrder = buildOrderString(order.order);
    klon.querySelector("p").textContent = completeOrder;
    container.appendChild(klon);
  });
}

export function updateOrders(servings, bartenders, newOrderList) {
  updateServings(servings, bartenders);

  newOrderList.forEach(calcWaitingTime);
}

function updateServings(servings, bartenders) {
  servings.forEach((serving) => {
    //TODO: make this less ninja
    const servedBy = bartenders.filter(compareData)[0].name.toLowerCase();
    const container = document.querySelector(`#orders li[data-id="${serving.id}"]`);

    container.querySelector(".bartender_icon").dataset.servedBy = servedBy;
    container.querySelector(".bartender_icon").classList.remove("hide");

    function compareData(bartender) {
      if (serving.id === bartender.servingCustomer) {
        return true;
      } else {
        return false;
      }
    }
  });
}

function buildOrderString(order) {
  let result = "";

  order.forEach((beer) => {
    result = result + `${beer}, `;
  });

  const lastComma = result.lastIndexOf(",");
  result = result.substring(0, lastComma);
  return result;
}

function calcWaitingTime(order) {
  //Get difference between now and ordertime, in minutes.decimals
  const currentEpoch = Date.now();
  const differenceInMin = ((currentEpoch - order.startTime) / 60000).toFixed(2);

  const convertedTime = getTimeInSeconds(differenceInMin);

  const container = document.querySelector(`#orders [data-id="${order.id}"]`);
  container.querySelector("figcaption").textContent = convertedTime;

  if (differenceInMin > 1) {
    container.classList.add("red");
  } else if (differenceInMin > 0.5) {
    container.classList.add("yellow");
  }
}

export function removeOrders(orders) {
  const container = document.querySelector("#orders ol");
  orders.forEach((order) => {
    container.querySelector(`li[data-id="${order.id}"]`).remove();
  });
}

export function getTimeInSeconds(number) {
  // Convert to string and separate the decimals from minutes
  const timeInString = number.toString();
  const indexOfDot = timeInString.indexOf(".");
  const minute = timeInString.substring(0, indexOfDot);
  const decimalsInString = timeInString.substring(indexOfDot + 1);

  // Convert decimals string to number and calc to seconds
  let seconds = (Number(decimalsInString) * 0.6).toFixed(0);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  const result = minute + ":" + seconds;
  return result;
}
