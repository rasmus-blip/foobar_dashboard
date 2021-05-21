export function setLoadAnimDelay() {
  const allCircles = document.querySelectorAll("#loading div");
  let delay = 0;
  allCircles.forEach((elm) => {
    elm.style.setProperty("--anim-delay", `${delay}s`);
    delay += 0.2;
  });
}
