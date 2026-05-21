// первый сценарий

const container1 = document.getElementById("container1");
const startLeak1Btn = document.getElementById("startLeak1");
const stopLeak1Btn = document.getElementById("stopLeak1");
let cards1 = [];

function createCard1(i) {
  const card = document.createElement("div");
  card.className = "card";
  card.textContent = `Карточка ${i}`;

  // обработчик на глобальном объекте window
  function handler() {
    card.style.background = "#ffdddd";
  }
  window.addEventListener("scroll", handler);

  return card;
}

startLeak1Btn.addEventListener("click", () => {
  for(let i=0;i<100;i++){
    const card = createCard1(i);
    container1.appendChild(card);
    cards1.push(card);
  }
});

stopLeak1Btn.addEventListener("click", () => {
  cards1.forEach(card => container1.removeChild(card));
  cards1 = [];
});

// второй сценарий

const container2 = document.getElementById("container2");
const startLeak2Btn = document.getElementById("startLeak2");
const stopLeak2Btn = document.getElementById("stopLeak2");
const globalCache = []; // глобальный массив

startLeak2Btn.addEventListener("click", () => {
  for(let i=0;i<100;i++){
    const card = document.createElement("div");
    card.className="card";
    card.textContent=`Карточка ${i}`;
    container2.appendChild(card);
    globalCache.push(card); // сохраняем ссылку глобально
  }
});

stopLeak2Btn.addEventListener("click", () => {
  container2.innerHTML = ""; // удаляем DOM, но глобальный массив нет, иначе произойдет утечка
});

// третий сценарий

const container3 = document.getElementById("container3");
const startLeak3Btn = document.getElementById("startLeak3");
const stopLeak3Btn = document.getElementById("stopLeak3");
const intervals = [];

function createCard3(i){
  const card = document.createElement("div");
  card.className="card";
  card.textContent=`Карточка ${i}`;
  container3.appendChild(card);

  // таймер, который использует DOM-элемент
  const id = setInterval(()=>{
    card.style.color = card.style.color==="red"?"blue":"red";
  },1000);
  intervals.push(id);

  return card;
}

startLeak3Btn.addEventListener("click", ()=>{
  for(let i=0;i<20;i++){
    createCard3(i);
  }
});

stopLeak3Btn.addEventListener("click", ()=>{
  container3.innerHTML = ""; 
  // намеренно не останавливаем таймеры, иначе произойдет утечка через closure
});