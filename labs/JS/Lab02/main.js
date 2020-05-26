const rainbow = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "rebeccapurple",
  "violet",
];

const btn = document.querySelector("#button");
const color = document.querySelector("#color");

// Add transition to animation
document.body.style.transition = "all .5s";

btn.addEventListener("click", (e) => {
  const randColorIdx = Math.floor(Math.random() * rainbow.length);
  document.body.style.background = rainbow[randColorIdx];
  color.innerText = rainbow[randColorIdx];
});
