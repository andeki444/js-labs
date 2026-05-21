const runTestsBtn = document.getElementById("runTestsBtn");
const resultsTableBody = document.querySelector("#resultsTable tbody");
const statusDiv = document.getElementById("status");

function mean(arr) {
  return arr.reduce((a,b)=>a+b,0)/arr.length;
}

function std(arr, avg) {
  const variance = arr.reduce((a,b)=>a + (b-avg)**2,0)/(arr.length-1);
  return Math.sqrt(variance);
}

function ci95(avg, sigma, n) {
  const z = 1.96;
  const margin = z*sigma/Math.sqrt(n);
  return [avg-margin, avg+margin];
}

// методы добавления
function addAppendChild(container, n) {
  for(let i=0;i<n;i++){
    const div = document.createElement("div");
    div.textContent=i;
    container.appendChild(div);
  }
}

function addFragment(container, n) {
  const frag = document.createDocumentFragment();
  for(let i=0;i<n;i++){
    const div = document.createElement("div");
    div.textContent=i;
    frag.appendChild(div);
  }
  container.appendChild(frag);
}

function addInnerHTML(container, n) {
  let html = "";
  for(let i=0;i<n;i++){
    html += `<div>${i}</div>`;
  }
  container.innerHTML = html;
}

function addInsertAdjacentHTML(container, n) {
  for(let i=0;i<n;i++){
    container.insertAdjacentHTML("beforeend", `<div>${i}</div>`);
  }
}

// методы очистки
function clearInnerHTML(container){ container.innerHTML=""; }
function clearRemoveChild(container){ while(container.firstChild) {container.removeChild(container.firstChild);} }
function clearReplaceChildren(container){ container.replaceChildren(); }

function runBenchmark(methodName, methodFunc, iterations, n){
  const results=[];
  const container = document.createElement("div");
  document.body.appendChild(container);

  // прогрев
  for(let i=0;i<5;i++){ container.innerHTML=""; methodFunc(container, n); }

  for(let i=0;i<iterations;i++){
    container.innerHTML="";
    const start = performance.now();
    methodFunc(container, n);
    const end = performance.now();
    results.push(end-start);
  }

  container.remove();

  const avg = mean(results);
  const sigma = std(results, avg);
  const ci = ci95(avg, sigma, iterations);

  return {methodName,n,iterations,avg,sigma,ci};
}

function runClearBenchmark(methodName, methodFunc, iterations, n){
  const results=[];
  const container = document.createElement("div");
  document.body.appendChild(container);

  // прогрев
  for(let i=0;i<5;i++){
    container.innerHTML="";
    for(let j=0;j<n;j++){
      const div = document.createElement("div");
      div.textContent=j;
      container.appendChild(div);
    }
    methodFunc(container);
  }

  for(let i=0;i<iterations;i++){
    container.innerHTML="";
    for(let j=0;j<n;j++){
      const div = document.createElement("div");
      div.textContent=j;
      container.appendChild(div);
    }
    const start = performance.now();
    methodFunc(container);
    const end = performance.now();
    results.push(end-start);
  }

  container.remove();

  const avg = mean(results);
  const sigma = std(results, avg);
  const ci = ci95(avg, sigma, iterations);

  return {methodName,n,iterations,avg,sigma,ci};
}

async function runAllBenchmarks(){
  statusDiv.textContent="Тестирование...";
  resultsTableBody.innerHTML="";

  const addMethods = [
    {name:"appendChild",func:addAppendChild},
    {name:"DocumentFragment",func:addFragment},
    {name:"innerHTML",func:addInnerHTML},
    {name:"insertAdjacentHTML",func:addInsertAdjacentHTML}
  ];

  const clearMethods = [
    {name:"innerHTML",func:clearInnerHTML},
    {name:"removeChild",func:clearRemoveChild},
    {name:"replaceChildren",func:clearReplaceChildren}
  ];

  const sampleSizes=[1000,10000];
  const iterations=30;

  for(const n of sampleSizes){
    for(const m of addMethods){
      const r = runBenchmark(m.name, m.func, iterations, n);
      const row=document.createElement("tr");
      row.innerHTML=`
        <td>${r.methodName} (add)</td>
        <td>${r.n}</td>
        <td>${r.iterations}</td>
        <td>${r.avg.toFixed(3)}</td>
        <td>${r.sigma.toFixed(3)}</td>
        <td>${r.ci[0].toFixed(3)} - ${r.ci[1].toFixed(3)}</td>
      `;
      resultsTableBody.appendChild(row);
      await new Promise(res=>setTimeout(res,50));
    }

    for(const m of clearMethods){
      const r = runClearBenchmark(m.name, m.func, iterations, n);
      const row=document.createElement("tr");
      row.innerHTML=`
        <td>${r.methodName} (clear)</td>
        <td>${r.n}</td>
        <td>${r.iterations}</td>
        <td>${r.avg.toFixed(3)}</td>
        <td>${r.sigma.toFixed(3)}</td>
        <td>${r.ci[0].toFixed(3)} - ${r.ci[1].toFixed(3)}</td>
      `;
      resultsTableBody.appendChild(row);
      await new Promise(res=>setTimeout(res,50));
    }
  }

  statusDiv.textContent="Готово!";
}

runTestsBtn.addEventListener("click", runAllBenchmarks);