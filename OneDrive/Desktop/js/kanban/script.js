const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const addTaskBtn = document.getElementById("addTaskBtn");

const taskTitle = document.getElementById("taskTitle");
const taskDesc = document.getElementById("taskDesc");

let draggedTask = null;

openModal.addEventListener("click", () => {
modal.classList.add("active");
});

modal.addEventListener("click", (e) => {
if(e.target === modal){
modal.classList.remove("active");
}
});

function updateCount(){

document.querySelectorAll(".column").forEach(column=>{

const count =
column.querySelectorAll(".task").length;

column.querySelector(".count").textContent =
count;

});

}

function createTask(title, desc){

const task = document.createElement("div");
task.classList.add("task");
task.draggable = true;

task.innerHTML = `
<h3>${title}</h3>
<p>${desc}</p>
<button class="delete">
Delete
</button>
`;

task.addEventListener("dragstart", () => {
draggedTask = task;
});

task.querySelector(".delete")
.addEventListener("click", ()=>{

task.remove();
updateCount();

});

return task;
}

addTaskBtn.addEventListener("click", ()=>{

if(taskTitle.value.trim()==="") return;

const task = createTask(
taskTitle.value,
taskDesc.value
);

document.getElementById("todo")
.appendChild(task);

taskTitle.value="";
taskDesc.value="";

modal.classList.remove("active");

updateCount();

});

document.querySelectorAll(".column")
.forEach(column=>{

column.addEventListener("dragover",(e)=>{

e.preventDefault();
column.classList.add("drag-over");

});

column.addEventListener("dragleave",()=>{

column.classList.remove("drag-over");

});

column.addEventListener("drop",()=>{

column.classList.remove("drag-over");

if(draggedTask){

column.appendChild(draggedTask);
updateCount();

}

});

});

updateCount();