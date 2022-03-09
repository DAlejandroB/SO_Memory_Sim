let processes = []; 
function setup(){
    initProcesses();
    loadPage("dynamic");
}
function initProcesses(){
    for(let i = 0; i < 20; i++){
      processes.push(new Process(i, "pr_" + String(i), int(random(4,512))));
    }
    initProcessDiv(processes);
  }