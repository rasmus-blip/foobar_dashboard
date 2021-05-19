export function displayBartenders(bartenders) {
  const container = document.querySelector("#personel ul");
  const temp = document.querySelector("#bartenders_temp");

  bartenders.forEach((bartender) => {
    const klon = temp.cloneNode(true).content;

    klon.querySelector("li").dataset.id = bartender.name.toLowerCase();
    klon.querySelector("li").dataset.serving = bartender.servingCustomer;
    klon.querySelector("h2").textContent = bartender.name;

    if (bartender.status === "WORKING") {
      klon.querySelector(".status span").textContent = getDetailText(bartender);
    } else {
      klon.querySelector(".status span").textContent = "Ready";
      klon.querySelector(".status span").classList.add("green");
    }

    container.appendChild(klon);
  });
}

function getDetailText(bartender) {
  if (bartender.statusDetail === "pourBeer") {
    return `Pouring beer on tap #${bartender.usingTap + 1}, for order #${bartender.servingCustomer}`;
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
    return `Replacing keg`;
  }

  if (bartender.statusDetail === "reserveTap") {
    return `Is waiting for a tap to be free`;
  }

  if (bartender.statusDetail === "waiting") {
    return `Is waiting for an order`;
  }
}

export function updateBartenders(bartenders) {
  bartenders.forEach((bartender) => {
    const container = document.querySelector(`#personel [data-id="${bartender.name.toLowerCase()}"]`);

    container.querySelector(".status span").textContent = getDetailText(bartender);
  });
}
