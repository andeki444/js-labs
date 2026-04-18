// eslint-disable-next-line no-unused-vars
function createTamagotchi() {
  let hunger = 100;
  let happiness = 100;
  let energy = 100;

  let queue = [];
  let isBusy = false;
  let decayTimer = null;

  const settings = {
    decaySpeed: 5000,
    decayStep: 5,
    actionTime: 2000
  };

  const callbacks = {
    onUpdate: null,
    onMessage: null,
    onState: null
  };

  function clamp(value) {
    if (value < 0) {
      return 0;
    }

    if (value > 100) {
      return 100;
    }

    return value;
  }

  function getState() {
    if (
      hunger <= 0 ||
      happiness <= 0 ||
      energy <= 0
    ) {
      return "dead";
    }

    if (hunger < 30) {
      return "hungry";
    }

    if (happiness < 30) {
      return "sad";
    }

    if (energy < 30) {
      return "tired";
    }

    return "normal";
  }

  function emit() {
    if (callbacks.onUpdate) {
      callbacks.onUpdate({
        hunger,
        happiness,
        energy,
        queue: queue.length
      });
    }

    if (callbacks.onState) {
      callbacks.onState(getState());
    }
  }

  function showMessage(text, type) {
    if (callbacks.onMessage) {
      callbacks.onMessage(text, type);
    }
  }

  function gameOverCheck() {
    if (getState() === "dead") {
      showMessage(
        "💔 Питомец погиб",
        "error"
      );

      reset();
    }
  }

  function runQueue() {
    if (isBusy || queue.length === 0) {
      return;
    }

    isBusy = true;

    const action = queue.shift();

    action()
      .then(() => {
        showMessage(
          "✅ Действие выполнено",
          "success"
        );
      })
      .catch((error) => {
        showMessage(
          error.message,
          "error"
        );
      })
      .finally(() => {
        isBusy = false;
        emit();
        runQueue();
      });
  }

  function addAction(action) {
    if (queue.length >= 3) {
      showMessage(
        "⚠️ Очередь заполнена",
        "error"
      );

      return;
    }

    queue.push(action);
    emit();
    runQueue();
  }

  function delayedChange(handler) {
    return new Promise((resolve) => {
      setTimeout(() => {
        handler();

        hunger = clamp(hunger);
        happiness = clamp(happiness);
        energy = clamp(energy);

        emit();
        gameOverCheck();

        resolve();
      }, settings.actionTime);
    });
  }

  function feed() {
    addAction(() =>
      delayedChange(() => {
        hunger += 15;
      })
    );
  }

  function play() {
    addAction(() =>
      delayedChange(() => {
        happiness += 20;
        energy -= 10;
      })
    );
  }

  function sleep() {
    addAction(() =>
      delayedChange(() => {
        energy = 100;
      })
    );
  }

  function train() {
    addAction(() =>
      delayedChange(() => {
        hunger += 10;
        happiness += 15;
        energy -= 5;
      })
    );
  }

  function startDecay() {
    decayTimer = setInterval(() => {
      hunger -= settings.decayStep;
      happiness -= settings.decayStep;
      energy -= settings.decayStep;

      hunger = clamp(hunger);
      happiness = clamp(happiness);
      energy = clamp(energy);

      emit();
      gameOverCheck();
    }, settings.decaySpeed);
  }

  function reset() {
    hunger = 100;
    happiness = 100;
    energy = 100;

    queue = [];
    isBusy = false;

    emit();
  }

  function updateSettings(newSettings) {
    settings.decaySpeed =
      newSettings.decaySpeed;

    settings.decayStep =
      newSettings.decayStep;

    settings.actionTime =
      newSettings.actionTime;

    clearInterval(decayTimer);
    startDecay();
  }

  function init(userCallbacks) {
    callbacks.onUpdate =
      userCallbacks.onUpdate;

    callbacks.onMessage =
      userCallbacks.onMessage;

    callbacks.onState =
      userCallbacks.onState;

    emit();
    startDecay();
  }

  return {
    init,
    feed,
    play,
    sleep,
    train,
    reset,
    updateSettings
  };
}