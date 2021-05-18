export function appendOrders(orders) {
  const container = document.querySelector("#orders ul");
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

export function updateServings(servings, bartenders) {
  servings.forEach((serving) => {
    //TODO: make this less ninja
    const servedBy = bartenders.filter(compareData)[0].name.toLowerCase();
    console.log(servedBy);
    const container = document.querySelector(
      `#orders li[data-id="${serving.id}"]`
    );

    container.querySelector(".bartender_icon").dataset.servedBy = servedBy;
    //TODO: fetch svg plz, looks like shit...
    container.querySelector(".bartender_icon").classList.remove("hide");
    document.querySelector(
      `#orders li[data-id="${serving.id}"] p`
    ).style.color = "teal";

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

export function updateOrders(orders) {}

export function removeOrders(orders) {
  const container = document.querySelector("#orders ul");
  orders.forEach((order) => {
    container.querySelector(`li[data-id="${order.id}"]`).remove();
  });
}
