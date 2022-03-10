let partitions = [];
function loadPage(pageType) {
  initMemSelector(pageType);
}
let memSize = 0, partSize = 0, nPartition = 0, isFixed = false;

function initMemSelector(pageType) {
  /*Creación de elementos graficos para selección de memoria mediante un slider*/
  var memSelector = document.createElement("input");
  var divElement = document.getElementById("memSelector");
  var memInput = document.getElementById("memText");
  isFixed = pageType == "fixed";

  if (isFixed) {
    nPartition = int(getNumericPrompt("Ingrese el número de particiones"));
    var info = document.getElementById("parText");
  }

  memSelector.type = "range";
  memSelector.setAttribute("min", "16");
  memSelector.setAttribute("id", "mem-slider");
  memSelector.setAttribute("max", "256");
  memSelector.setAttribute("step", "16");
  memSelector.setAttribute("value", "16");
  memInput.innerHTML = "Seleccione el tamaño de la memoria principal";
  divElement.appendChild(memSelector);

  /*Inicialización del canvas de elementos graficos dinamicos para la visualización de memoria*/

  var memCanvas = createCanvas(512, 64);
  memCanvas.position(screen.width / 2 - memCanvas.width / 2, 500);

  /*Actualización del elemento grafico una vez se seleccione un valor */

  memSelector.onchange = () => {
    //Calculo de tamaños de particiones y asignación logica de las mismas.
    partitions = [];
    memInput.innerHTML = "Tamaño memoria principal: " + String(memSelector.value) + " MB";
    memSize = memSelector.value;
    if (pageType == "fixed") {
      partSize = int(memSize / nPartition);
      for(let i = 0; i < nPartition; i++){
        partitions.push(new Partition(i*memSize/2, memSize/2));
      }
      info.innerHTML = "Tamaño Partición: " + String(partSize) + " MB";
    } else if(pageType == "non-fixed"){
      let addPartDiv = document.getElementById("info");
      let addPartBtn = document.createElement("input");
      addPartBtn.setAttribute("type","button");
      addPartBtn.setAttribute("value","Agregar Partición");
      addPartBtn.setAttribute("class","button");
      addPartBtn.addEventListener("click", () =>{
        memSelector.disabled = true;
        addPartition();
      });
      addPartDiv.appendChild(addPartBtn);
    } else if(pageType == "dynamic"){
      
    }
    drawMemory();
  };
}
function drawMemory() {
  background(255);
  //Visualización de memoria en grupos de 16Mb
  for (let i = 0; i <= 16; i++) {
    if (i < memSize / 16) {
      fill(255);
      stroke(155);
      rect(i * 32 + 2, 0, 32, 64);
      stroke(255);
      rect((i * 32), 16, 16, 32);
    } else {
      fill(50);
      stroke(50);
      rect(i * 32 + 2, 0, 32, 64);
    }
  }
  stroke(0, 50);
  //Visualización de las particiones como un overlay
  for(let i = 0; i < nPartition; i++){
    if (i % 2 == 0)
      fill(255, 255, 255, 120);
    else
      fill(150, 150, 150, 120);
    rect(partitions[i].x * 2 , 0, partitions[i].size * 2, 64);
  }
}
function getNumericPrompt(message) {
  let input = prompt(message);
  while (!Number.isInteger(float(input)) || float(input) <= 0) {
    input = prompt("El valor que ingresó no es un entero positivo, intente de nuevo: \n" + message);
  }
  return input;
}

function initProcessDiv(processes) {
  let prElements = []
  let i = 0, j = 0;
  processes.forEach(process => {
    //Div que va a contener la información del proceso
    prTextDiv = document.createElement("div");
    prTextDiv.setAttribute("id", "processTextDiv");

    prId = document.createElement("h2");
    let pID = "";
    if (process.pID < 10)
      pID = "00" + String(process.pID);
    else
      pID = "0" + String(process.pID);
    prId.innerHTML = "PID: " + pID;
    prName = document.createElement("h2");
    prName.innerHTML = "Nombre Proceso: " + process.pName;
    prSize = document.createElement("h2");
    prSize.innerHTML = String(process.pSize) + " MB";
    pSize = process.pSize;
    prTextDiv.appendChild(prId);
    prTextDiv.appendChild(prName);
    prTextDiv.appendChild(prSize);

    //Div que contrendra los inputs del proceso
    prInputDiv = document.createElement("div");
    prInputDiv.setAttribute("id", "processInputDiv");

    loadPrButton = document.createElement("input");
    loadPrButton.setAttribute("value", "Cargar");
    loadPrButton.setAttribute("type", "button");
    loadPrButton.setAttribute("class", "loadPrButton");
    loadPrButton.setAttribute("id", "pr_btn" + pID);
    loadPrButton.addEventListener("click", () => {
      /* 
      Subir programa a memoria, asignando la primera particion disponible 
      Empieza revisando la cantidad de particiones disponibles
      */
      //Comprueba si el tamaño de memoria ha sido seleccionado, en ese caso realiza las funciones del boton
      if (memSize != 0) {
        //Desactiva la modificación del tamaño de memoria
        document.getElementById("mem-slider").disabled = true;
        document.getElementById("pr_btn" + pID).disabled = true;
        document.getElementById("pr_btn" + pID).style.backgroundColor = "#e67e22";
        document.getElementById("pr_btn" + pID).setAttribute("value", "Descargar");

        addPartition(process);
      } else {
        alert("El programa no ha sido subido, por favor seleccione un tamaño de memoria primero");
      }
    });

    prInputDiv.appendChild(loadPrButton);

    //Por ultimo el div que contendrá todos los elementos
    prDiv = document.createElement("div");
    prDiv.setAttribute("id", "processDiv");

    //Agregamos los divs de info e input
    prDiv.appendChild(prTextDiv);
    prDiv.appendChild(prInputDiv);
    prElements.push(prDiv);
    if (i == 3) {
      i = 0;
      j++;
    }
    document.getElementById("processes").appendChild(prDiv);
  });
}

function updatePartition() {
  //Dibujar escala de memoria dividida en grupos de 16MB
  for (let i = 0; i <= 16; i++) {
    if (i < memSize / 16) {
      fill(255);
      stroke(155);
      rect(i * 32 + 2, 0, 32, 64);
      stroke(255);
      rect((i * 32), 16, 16, 32);
    } else {
      fill(50);
      stroke(50);
      rect(i * 32 + 2, 0, 32, 64);
    }
  }
  stroke(0, 50);
  //Dibuja por encima de la imagen las particiones intercaladas entre blanca y negra
  drawMemory();
  for (let i = 0; i < nPartition; i++) {
    if (i % 2 == 0)
      fill(255, 255, 255, 120);
    else
      fill(150, 150, 150, 120);
    //rect(partitions[i].x * 2, 0, partitions[i].size*2, 64);
  
    if (partitions[i].process) {
      console.log("Drawing process");
      console.log(partitions[i].process);
      console.log("at " + partitions[i].x);
      fill(39, 174, 96, 150);
      noStroke();
      rect(partitions[i].x*2, 0, partitions[i].process.pSize*2, 64);
      fill(44, 62, 80);
      textSize(32);
      text(partitions[i].process.pName, partitions[i].x*2 + 5, 16, partitions[i].size*2 - 5, 32);
    }
  }
}

function addPartition() {
  let reservedMemSize = 0;
  if (partitions.length > 0)
    partitions.forEach(part => {
      reservedMemSize += part.size;
    });
  let aviableMemory = memSize - reservedMemSize;
  let size = getNumericPrompt("Por favor ingrese el tamaño de la partición (" + aviableMemory + "MB disponibles)");
  if (size <= aviableMemory) {
    toAdd = new Partition(reservedMemSize, int(size));
    partitions.push(toAdd);
    nPartition++;
    updatePartition();
  } else {
    alert("El tamaño de partición es superior al tamaño de memoria disponible, imposible ingresar");
  }
}

function addPartition(process) {
    let reservedMemSize = 0;
    let size = process.pSize;
    if (partitions.length > 0)
      partitions.forEach(part => {
        reservedMemSize += part.size;
      });
    let aviableMemory = memSize - reservedMemSize;
    if (size <= aviableMemory) {
      toAdd = new Partition(reservedMemSize, int(size));
      toAdd.process = process;
      partitions.push(toAdd);
      nPartition++;
      updatePartition();
    } else {
      alert("El tamaño de partición es superior al tamaño de memoria disponible, imposible ingresar");
    }
  }