document.addEventListener(
  "DOMContentLoaded",
  initApp
);

function initApp() {
  const game = createTamagotchi();

  const petImage =
    document.getElementById("petImage");

  const hunger =
    document.getElementById("hunger");

  const happiness =
    document.getElementById("happiness");

  const energy =
    document.getElementById("energy");

  const queue =
    document.getElementById("queueCount");

  const message =
    document.getElementById("message");

  function updateStats(stats) {
    hunger.textContent =
      Math.floor(stats.hunger);

    happiness.textContent =
      Math.floor(stats.happiness);

    energy.textContent =
      Math.floor(stats.energy);

    queue.textContent =
      stats.queue;
  }

  function showMessage(
    text,
    type
  ) {
    message.textContent = text;
    message.className = type;
  }

  function updatePet(state) {
    const imagePath =
      petImage.dataset[state];

    if (imagePath) {
      petImage.src = imagePath;
    }
  }

  document
    .getElementById("feedBtn")
    .addEventListener(
      "click",
      game.feed
    );

  document
    .getElementById("playBtn")
    .addEventListener(
      "click",
      game.play
    );

  document
    .getElementById("sleepBtn")
    .addEventListener(
      "click",
      game.sleep
    );

  document
    .getElementById("trainBtn")
    .addEventListener(
      "click",
      game.train
    );

  document
    .getElementById("resetGame")
    .addEventListener(
      "click",
      game.reset
    );

  game.init({
    onUpdate: updateStats,
    onMessage: showMessage,
    onState: updatePet
  });

  window.game = game;
}