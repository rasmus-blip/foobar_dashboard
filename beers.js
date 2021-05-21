export function toggleBeerSections() {
  console.log();
  if (this.classList.contains("clicked") === false) {
    // click sound
    document.querySelector("audio").currentTime = 0;
    document.querySelector("audio").volume = 0.6;
    document.querySelector("audio").play();

    if (navigator.vibrate) {
      window.navigator.vibrate(200);
    }

    document.querySelector("#taps_btn").classList.toggle("clicked");
    document.querySelector("#storage_btn").classList.toggle("clicked");
    document.querySelector("#taps").classList.toggle("show");
    document.querySelector("#storage").classList.toggle("show");
  }
}

export function appendTaps(taps) {
  const container = document.querySelector("#taps ol");
  const temp = document.querySelector("#taps_temp");

  taps.forEach((tap) => {
    const klon = temp.cloneNode(true).content;

    klon.querySelector("li").dataset.id = tap.id;
    klon.querySelector(".tap_info p").textContent = tap.beer;

    const barLength = ((tap.level / tap.capacity) * 100).toFixed(0);
    klon
      .querySelector(".beer_bar")
      .style.setProperty("--bar-length", barLength + "%");

    if (barLength >= 50) {
      klon.querySelector(".beer_bar").classList = "beer_bar green";
    } else if (barLength >= 20) {
      klon.querySelector(".beer_bar").classList = "beer_bar yellow";
    } else {
      klon.querySelector(".beer_bar").classList = "beer_bar red";
    }

    klon.querySelector(".tap_id").textContent = `#${tap.id + 1}`;

    container.appendChild(klon);
  });
}

export function updateTaps(taps) {
  taps.forEach((tap) => {
    const container = document.querySelector(`#taps li[data-id="${tap.id}"]`);
    container.querySelector(".tap_info p").textContent = tap.beer;
    const barLength = ((tap.level / tap.capacity) * 100).toFixed(0);
    container
      .querySelector(".beer_bar")
      .style.setProperty("--bar-length", barLength + "%");
    if (barLength > 50) {
      container.querySelector(".beer_bar").classList = "beer_bar green";
    } else if (barLength > 20) {
      container.querySelector(".beer_bar").classList = "beer_bar yellow";
    } else if (barLength > 10) {
      container.querySelector(".beer_bar").classList = "beer_bar red";
    } else {
      container.querySelector(".beer_bar").classList = "beer_bar red pulse";
    }
  });
}

export function appendStorage(beers) {
  const container = document.querySelector("#storage ol");
  const temp = document.querySelector("#storage_temp");

  beers.forEach((beer) => {
    const klon = temp.cloneNode(true).content;

    klon.querySelector("li").dataset.id = beer.name;
    klon.querySelector(".beer_name").textContent = beer.name;
    klon.querySelector(".beer_kegs").textContent = beer.amount;

    setStorageColor(klon.querySelector("li"), beer.amount);

    container.appendChild(klon);
  });
}

export function updateStorage(beers) {
  beers.forEach((beer) => {
    const container = document.querySelector(
      `#storage li[data-id="${beer.name}"]`
    );
    container.querySelector(".beer_kegs").textContent = beer.amount;
    setStorageColor(container, beer.amount);
  });
}

function setStorageColor(container, count) {
  if (count <= 1) {
    container.classList = "red";
  } else if (count <= 3) {
    container.classList = "yellow";
  } else {
    container.classList = "";
  }
}
