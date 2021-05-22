export function mobileMenuSetup() {
  const allBtns = document.querySelectorAll("header button");
  allBtns.forEach((btn) => {
    btn.addEventListener("click", toggleSections);
  });
}

function toggleSections() {
  //Hide all sections
  const allSections = document.querySelectorAll("section");
  allSections.forEach((elm) => {
    elm.classList.remove("open");
  });

  //Gets dataset of the section to open, splits it to array, and adds ".open" to each elm
  const triggerString = this.dataset.trigger;
  const triggerArr = triggerString.split(" ");
  triggerArr.forEach((elmToOpen) => {
    document.querySelector(`#${elmToOpen}`).classList.add("open");
  });

  //removes ".open" on all btns
  const allBtns = document.querySelectorAll("header button");
  allBtns.forEach((btn) => {
    btn.classList.remove("open");
  });

  //adds ".open" to clicked btn
  this.classList.add("open");
}
