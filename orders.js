export function appendOrders(orders) {
  const container = document.querySelector("#orders ul");
  const temp = document.querySelector("#orders_temp");

  orders.forEach((order) => {
    const klon = temp.cloneNode(true).content;

    //TODO: de første 3 er servings - lav noget if-halløj
    //TODO: Find derefter ud af hvem der betjener disse

    klon.querySelector("li").dataset.id = order.id;
    klon.querySelector("h2").textContent = `#${order.id}`;
    const completeOrder = buildOrderString(order.order);
    klon.querySelector("p").textContent = completeOrder;

    container.appendChild(klon);
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
