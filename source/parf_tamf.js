processes = [];

function setup() {
  /*
  • Los tamaños de memoria deben variar desde 16 hasta 256 MB en múltiplos de 16
  • Los tamaños de los procesos pueden estructurarse de forma pseudoaleatoria desde 4 hasta 512 MB expresados como valores enteros siempre
  • Los tamaños de las particiones de la memoria deberían ser variables ingresadas desde el exterior del programa.
  • En este momento la tecnología de los equipos de cómputo no cuenta con memoria de intercambio. */
  initProcesses();
  loadPage("fixed");
}

function initProcesses(){
  for(let i = 0; i < 20; i++){
    processes.push(new Process(i, "pr_" + String(i), int(random(4,512))));
  }
  initProcessDiv(processes);
}