// задание 1 версионирование

function VersionManager(initialVersion) {
  let version = initialVersion;

  if (!version || version.trim() === "") {
    version = "0.0.1";
  }

  const parts = version.split(".");

  if (parts.length !== 3) {
    throw new Error("Некорректный формат версии!");
  }

  const major = Number(parts[0]);
  const minor = Number(parts[1]);
  const patch = Number(parts[2]);

  if (
    !Number.isInteger(major) ||
    !Number.isInteger(minor) ||
    !Number.isInteger(patch) ||
    major < 0 ||
    minor < 0 ||
    patch < 0
  ) {
    throw new Error("Некорректный формат версии!");
  }

  this._major = major;
  this._minor = minor;
  this._patch = patch;
  this._history = [];
}

VersionManager.prototype.saveState = function saveState() {
  this._history.push({
    major: this._major,
    minor: this._minor,
    patch: this._patch
  });
};

VersionManager.prototype.major = function increaseMajor() {
  this.saveState();
  this._major += 1;
  this._minor = 0;
  this._patch = 0;

  return this;
};

VersionManager.prototype.minor = function increaseMinor() {
  this.saveState();
  this._minor += 1;
  this._patch = 0;

  return this;
};

VersionManager.prototype.patch = function increasePatch() {
  this.saveState();
  this._patch += 1;

  return this;
};

VersionManager.prototype.rollback = function rollbackVersion() {
  if (this._history.length === 0) {
    throw new Error("Невозможно выполнить откат!");
  }

  const previous = this._history.pop();

  this._major = previous.major;
  this._minor = previous.minor;
  this._patch = previous.patch;

  return this;
};

VersionManager.prototype.release = function releaseVersion() {
  return `${this._major}.${this._minor}.${this._patch}`;
};

let currentVersionManager = null;

const versionInput = document.getElementById("versionInput");
const createBtn = document.getElementById("createVersionBtn");
const versionDisplay = document.getElementById("versionDisplay");
const versionControls = document.getElementById("versionControls");
const versionError = document.getElementById("versionError");

function updateVersionDisplay() {
  if (!currentVersionManager) {
    return;
  }

  versionDisplay.textContent = currentVersionManager.release();
  versionError.textContent = "";
}

function handleCreateVersion() {
  try {
    const inputValue = versionInput.value.trim();

    currentVersionManager = new VersionManager(inputValue);

    updateVersionDisplay();

    versionControls.style.display = "flex";
    versionInput.value = "";
  } catch (error) {
    versionError.textContent = error.message;
    versionDisplay.textContent = "—";
    versionControls.style.display = "none";
  }
}

function handleMajor() {
  try {
    currentVersionManager.major();
    updateVersionDisplay();
  } catch (error) {
    versionError.textContent = error.message;
  }
}

function handleMinor() {
  try {
    currentVersionManager.minor();
    updateVersionDisplay();
  } catch (error) {
    versionError.textContent = error.message;
  }
}

function handlePatch() {
  try {
    currentVersionManager.patch();
    updateVersionDisplay();
  } catch (error) {
    versionError.textContent = error.message;
  }
}

function handleRollback() {
  try {
    currentVersionManager.rollback();
    updateVersionDisplay();
  } catch (error) {
    versionError.textContent = error.message;
  }
}

createBtn.addEventListener("click", handleCreateVersion);
document.getElementById("majorBtn").addEventListener("click", handleMajor);
document.getElementById("minorBtn").addEventListener("click", handleMinor);
document.getElementById("patchBtn").addEventListener("click", handlePatch);
document.getElementById("rollbackBtn").addEventListener("click", handleRollback);

// задание 2 прямоуг и квадрат

class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }

  perimeter() {
    return 2 * (this.width + this.height);
  }
}

class Square extends Rectangle {
  constructor(side) {
    super(side, side);
  }
}

const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");
const shapeResult = document.getElementById("shapeResult");

function createShape() {
  const width = Number(widthInput.value);
  const height = Number(heightInput.value);

  if (
    Number.isNaN(width) ||
    Number.isNaN(height) ||
    width < 0 ||
    height < 0
  ) {
    shapeResult.textContent = "Введите корректные числа";
    return null;
  }

  if (width === height) {
    return new Square(width);
  }

  return new Rectangle(width, height);
}

function handleCalcArea() {
  const shape = createShape();

  if (!shape) {
    return;
  }

  const type = shape instanceof Square
    ? "Квадрат"
    : "Прямоугольник";

  shapeResult.textContent =
    `${type}. Площадь: ${shape.area().toFixed(2)}`;
}

function handleCalcPerimeter() {
  const shape = createShape();

  if (!shape) {
    return;
  }

  const type = shape instanceof Square
    ? "Квадрат"
    : "Прямоугольник";

  shapeResult.textContent =
    `${type}. Периметр: ${shape.perimeter().toFixed(2)}`;
}

document
  .getElementById("calcAreaBtn")
  .addEventListener("click", handleCalcArea);

document
  .getElementById("calcPerimeterBtn")
  .addEventListener("click", handleCalcPerimeter);

// задание 3 темпа

class Temperature {
  static ABSOLUTE_ZERO = -273.16;
  static MAX_TEMPERATURE = 1.41e32;
  constructor(celsius) {
    this.validate(celsius);
    this._celsius = celsius;
  }

  validate(value) {
    if (
      value < Temperature.ABSOLUTE_ZERO ||
      value > Temperature.MAX_TEMPERATURE ||
      Number.isNaN(value)
    ) {
      throw new Error(
        "Температура вне допустимых физических пределов"
      );
    }
  }

  get celsius() {
    return this._celsius;
  }
  set celsius(value) {
    this.validate(value);
    this._celsius = value;
  }

  toKelvin() {
    return Number((this._celsius + 273.15).toFixed(2));
  }
  toFahrenheit() {
    return Number(
      (((this._celsius * 9) / 5) + 32).toFixed(2)
    );
  }
  toString() {
    return `${this.toKelvin().toFixed(2)} K`;
  }

  static checkInstance(value) {
    if (!(value instanceof Temperature)) {
      throw new Error(
        "Аргумент должен быть экземпляром Temperature"
      );
    }
  }
  
  static add(firstTemperature, secondTemperature) {
    Temperature.checkInstance(firstTemperature);
    Temperature.checkInstance(secondTemperature);

    return new Temperature(
        firstTemperature.celsius +
        secondTemperature.celsius
    );
  }

    static subtract(firstTemperature, secondTemperature) {
    Temperature.checkInstance(firstTemperature);
    Temperature.checkInstance(secondTemperature);

    return new Temperature(
        firstTemperature.celsius -
        secondTemperature.celsius
    );
  }
}

const firstTemperature = new Temperature(20);
const secondTemperature = new Temperature(30);

const temp1Input =
  document.getElementById("temp1Input");
const temp2Input =
  document.getElementById("temp2Input");
const temp1Display =
  document.getElementById("temp1Display");
const temp2Display =
  document.getElementById("temp2Display");
const tempResult =
  document.getElementById("tempResult");
const unitRadios =
  document.querySelectorAll(
    'input[name="tempUnit"]'
  );

function getCurrentUnit() {
  for (const radio of unitRadios) {
    if (radio.checked) {
      return radio.value;
    }
  }

  return "celsius";
}

function formatTemperature(
  temperature,
  unit
) {
  if (unit === "kelvin") {
    return `${temperature
      .toKelvin()
      .toFixed(2)} K`;
  }

  if (unit === "fahrenheit") {
    return `${temperature
      .toFahrenheit()
      .toFixed(2)} °F`;
  }

  return `${temperature.celsius.toFixed(2)} °C`;
}

function updateTemperatureDisplays() {
  const unit = getCurrentUnit();

  temp1Display.textContent =
    formatTemperature(
      firstTemperature,
      unit
    );

  temp2Display.textContent =
    formatTemperature(
      secondTemperature,
      unit
    );
}

function showTempError(message) {
  tempResult.textContent =
    `Ошибка: ${message}`;
}

function handleTemp1Change() {
  try {
    const value = Number(
      temp1Input.value
    );

    firstTemperature.celsius = value;

    updateTemperatureDisplays();

    tempResult.textContent = "";
  } catch (error) {
    showTempError(error.message);

    temp1Input.value =
      firstTemperature.celsius;
  }
}

function handleTemp2Change() {
  try {
    const value = Number(
      temp2Input.value
    );

    secondTemperature.celsius = value;

    updateTemperatureDisplays();

    tempResult.textContent = "";
  } catch (error) {
    showTempError(error.message);

    temp2Input.value =
      secondTemperature.celsius;
  }
}

function handleAddTemp() {
  try {
    const result =
      Temperature.add(
        firstTemperature,
        secondTemperature
      );

    const unit = getCurrentUnit();

    tempResult.textContent =
      `Сложение: ${formatTemperature(
        result,
        unit
      )}`;
  } catch (error) {
    showTempError(error.message);
  }
}

function handleSubtractTemp() {
  try {
    const result =
      Temperature.subtract(
        firstTemperature,
        secondTemperature
      );

    const unit = getCurrentUnit();

    tempResult.textContent =
      `Вычитание: ${formatTemperature(
        result,
        unit
      )}`;
  } catch (error) {
    showTempError(error.message);
  }
}

temp1Input.addEventListener(
  "change",
  handleTemp1Change
);

temp2Input.addEventListener(
  "change",
  handleTemp2Change
);

document
  .getElementById("addTempBtn")
  .addEventListener(
    "click",
    handleAddTemp
  );

document
  .getElementById(
    "subtractTempBtn"
  )
  .addEventListener(
    "click",
    handleSubtractTemp
  );

for (const radio of unitRadios) {
  radio.addEventListener(
    "change",
    updateTemperatureDisplays
  );
}

updateTemperatureDisplays();

// задание 4 камень-ножницы-бумага

class Signal {
  constructor(initialValue) {
    this._value = initialValue;
    this._subscribers = new Set();
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
    this.notify();
  }

  subscribe(callback) {
    this._subscribers.add(callback);
  }

  notify() {
    for (const callback of this._subscribers) {
      callback(this._value);
    }
  }
}

const gameState = {
  playerOneWins: new Signal(0),
  playerTwoWins: new Signal(0),
  draws: new Signal(0),
  playerOneMoves: new Signal({
    rock: 0,
    scissors: 0,
    paper: 0
  }),
  playerTwoMoves: new Signal({
    rock: 0,
    scissors: 0,
    paper: 0
  }),
  history: new Signal([])
};

let eventSource = null;

const startWatchButton =
  document.getElementById("startWatchBtn");

const stopWatchButton =
  document.getElementById("stopWatchBtn");

const playerOneWinsElement =
  document.getElementById("player1Wins");

const playerTwoWinsElement =
  document.getElementById("player2Wins");

const drawsElement =
  document.getElementById("draws");

const playerOneMovesElement =
  document.getElementById("player1Moves");

const playerTwoMovesElement =
  document.getElementById("player2Moves");

const historyList =
  document.getElementById("historyList");

function determineWinner(
  firstMove,
  secondMove
) {
  if (firstMove === secondMove) {
    return "draw";
  }

  if (
    (firstMove === "Камень" &&
      secondMove === "Ножницы") ||
    (firstMove === "Ножницы" &&
      secondMove === "Бумага") ||
    (firstMove === "Бумага" &&
      secondMove === "Камень")
  ) {
    return "playerOne";
  }

  return "playerTwo";
}

function getMoveKey(move) {
  if (move === "Камень") {
    return "rock";
  }

  if (move === "Ножницы") {
    return "scissors";
  }

  return "paper";
}

function resetGameState() {
  gameState.playerOneWins.value = 0;
  gameState.playerTwoWins.value = 0;
  gameState.draws.value = 0;

  gameState.playerOneMoves.value = {
    rock: 0,
    scissors: 0,
    paper: 0
  };

  gameState.playerTwoMoves.value = {
    rock: 0,
    scissors: 0,
    paper: 0
  };

  gameState.history.value = [];
}

function renderMoves(
  element,
  moves
) {
  element.innerHTML =
    `Камень: ${moves.rock}<br>` +
    `Ножницы: ${moves.scissors}<br>` +
    `Бумага: ${moves.paper}`;
}

function renderHistory(history) {
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.textContent =
      "Ожидание данных...";
    return;
  }

  for (const item of history) {
    const row =
      document.createElement("div");

    row.className = "history-item";

    row.textContent =
      `${item.time} | ` +
      `${item.playerOne} vs ` +
      `${item.playerTwo} | ` +
      `${item.result}`;

    historyList.append(row);
  }
}

function setupSubscriptions() {
  gameState.playerOneWins.subscribe(
    (value) => {
      playerOneWinsElement.textContent =
        value;
    }
  );

  gameState.playerTwoWins.subscribe(
    (value) => {
      playerTwoWinsElement.textContent =
        value;
    }
  );

  gameState.draws.subscribe(
    (value) => {
      drawsElement.textContent =
        value;
    }
  );

  gameState.playerOneMoves.subscribe(
    (moves) => {
      renderMoves(
        playerOneMovesElement,
        moves
      );
    }
  );

  gameState.playerTwoMoves.subscribe(
    (moves) => {
      renderMoves(
        playerTwoMovesElement,
        moves
      );
    }
  );

  gameState.history.subscribe(
    (history) => {
      renderHistory(history);
    }
  );
}

function handleRoundEvent(event) {
  const data = JSON.parse(event.data);

  const firstMove = data.player1;
  const secondMove = data.player2;

  const winner = determineWinner(
    firstMove,
    secondMove
  );

  if (winner === "playerOne") {
    gameState.playerOneWins.value += 1;
  } else if (winner === "playerTwo") {
    gameState.playerTwoWins.value += 1;
  } else {
    gameState.draws.value += 1;
  }

  const firstStats = {
    ...gameState.playerOneMoves.value
  };

  const secondStats = {
    ...gameState.playerTwoMoves.value
  };

  firstStats[getMoveKey(firstMove)] += 1;
  secondStats[getMoveKey(secondMove)] += 1;

  gameState.playerOneMoves.value =
    firstStats;

  gameState.playerTwoMoves.value =
    secondStats;

  const resultText =
    getResultText(winner);

  const historyItem = {
    time:
      new Date().toLocaleTimeString(),
    playerOne: firstMove,
    playerTwo: secondMove,
    result: resultText
  };

  gameState.history.value = [
    historyItem,
    ...gameState.history.value
  ].slice(0, 50);
}

function getResultText(gameWinner) {
  if (gameWinner === "draw") {
    return "Ничья";
  }

  if (gameWinner === "playerOne") {
    return "Победил игрок 1";
  }

  return "Победил игрок 2";
}

function handleSseError() {
  stopWatching();
}

function startWatching() {
  if (eventSource) {
    eventSource.close();
  }

  resetGameState();

  eventSource = new EventSource(
    "http://95.163.242.125/rps/stream"
  );

  eventSource.addEventListener(
    "round",
    handleRoundEvent
  );

  eventSource.onerror =
    handleSseError;

  startWatchButton.disabled =
    true;

  stopWatchButton.disabled =
    false;
}

function stopWatching() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }

  startWatchButton.disabled =
    false;

  stopWatchButton.disabled =
    true;
}

setupSubscriptions();
resetGameState();

startWatchButton.addEventListener(
  "click",
  startWatching
);

stopWatchButton.addEventListener(
  "click",
  stopWatching
);

