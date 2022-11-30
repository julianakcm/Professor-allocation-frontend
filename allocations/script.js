const allocationsUrl = 'http://localhost:8080/allocations/';
const professorsUrl = "http://localhost:8080/professors/";
const coursesUrl = "http://localhost:8080/courses/";

let professors = [];
let courses = [];

const table = document.getElementById('table');
const tableBody = document.getElementById('table-body');

// Form
const inputProfessor = document.getElementById("input-professor");
const inputCourse = document.getElementById("input-course");
const inputDia = document.getElementById("input-dia");
const inputHorarioInicio = document.getElementById("input-horario-inicio");
const inputHorarioFim = document.getElementById("input-horario-fim");
const btnSalvar = document.getElementById("btn-salvar");
const addbtn = document.getElementById("addbtn");


let actualId = 0;

function createOption(professor) {
  const option = document.createElement("option");
  option.value = professor.id;
  option.textContent = professor.name;

  inputProfessor.appendChild(option);
}

async function getProfessors() {
  if (professors?.length === 0) {

    professors = await get(professorsUrl);

    if (professors?.length > 0) {
      professors.forEach((professors) => {
        createOption(professors);
      });
    }
  }
}

function createOption2(course) {
  const option = document.createElement("option");
  option.value = course.id;
  option.textContent = course.name;

  inputCourse.appendChild(option);
}

async function getCourses() {
  if (courses?.length === 0) {
    courses = await get(coursesUrl);

    if (courses?.length > 0) {
      courses.forEach((courses) => {
        createOption2(courses);
      });
    }
  }
}


async function getAllocations() {

  const allocations = await get(allocationsUrl);

  if (allocations?.length > 0) {
    allocations.forEach((allocation) => {
      createRow(allocation);
    });

    showTable();
  }
}

async function salvar() {
  if (actualId) {
    atualizar();
  } else {
    adicionar();
  }
}

function setErrorSelectProfessor(isError) {
  if (isError) {
    inputProfessor.classList.add("is-invalid");
  } else {
    inputProfessor.classList.remove("is-invalid");
  }
}

function setErrorSelectCourse(isError) {
  if (isError) {
    inputCourse.classList.add("is-invalid");
  } else {
    inputCourse.classList.remove("is-invalid");
  }
}


async function remover(allocation, row) {
 
  const result = confirm("Você deseja remover o alocação ?");
 
  if (result) {
    const response = await fetch(allocationsUrl + allocation.id, {
      method: 'DELETE',
    });
    if (response.status == 204) {
      tableBody.removeChild(row);
    }
  }
}

async function adicionar() {
  const day = inputDia.value.trim();
  const start = inputHorarioInicio.value.trim();
  const end = inputHorarioFim.value.trim();
  const professorId = parseInt(inputProfessor.value.trim());
  const courseId = parseInt(inputCourse.value.trim());
  if (professorId && courseId && day && start && end) {
    const allocation = await post(allocationsUrl, {
      professorId: professorId,
      courseId: courseId,
      day: day,
      start: start + "-0000",
      end: end + "-0000"
    });

    if (allocation) {
      inputDia.value = "";
      inputHorarioInicio.value = "";
      inputHorarioFim.value = "";
      inputProfessor.value = "0";
      inputCourse.value = "0";

      removeModal();
      createRow(allocation);
      showTable();
    }
   
  }else {
  
    }if (!professorId) {
      setErrorSelectProfessor(true);
    }
    
     if (!courseId) {
      setErrorSelectCourse(true);
    }
    }
  
  
  

async function atualizar() {
  const day = inputDia.value.trim();
  const start = inputHorarioInicio.value.trim();
  const end = inputHorarioFim.value.trim();
  const professorId = parseInt(inputProfessor.value.trim());
  const courseId = parseInt(inputCourse.value.trim());
  if (professorId && courseId && day && start && end) {
    const allocation = await put(allocationsUrl, {
      professorId: professorId,
      courseId: courseId,
      day: day,
      start: start + "-0000",
      end: end + "-0000"
    });

    if (allocation) {
      inputDia.value = "";
      inputHorarioInicio.value = "";
      inputHorarioFim.value = "";
      inputProfessor.value = "professorId";
      inputCourse.value = "courseId";

      removeModal();
      createRow(allocation);
      showTable();
    }
    
  }
   
  else {

  if (!professorId) {
    setErrorSelectProfessor(true);
  }
  
   if (!courseId) {
    setErrorSelectCourse(true);
  }

}
}

function showTable() {
  table.removeAttribute("hidden");
}

async function abrirModalCriar() {
  actualId = 0;
  document.getElementById("formAllocationLabel").textContent =
    "Adicionar alocação";
    inputDia.value = "";
    inputHorarioInicio.value = "";
    inputHorarioFim.value = "";
    inputProfessor.value = "0";
    inputCourse.value = "0";
  setErrorSelectProfessor(false);
  setErrorSelectCourse(false);
  
}

async function abrirModalAtualizar(allocation) {
  actualId = allocation.id;
  document.getElementById("formAllocationLabel").textContent ="Editar Alocação";
  inputDia.value = allocation.day;
  inputHorarioInicio.value = allocation.start.split('+')[0];
  inputHorarioFim.value = allocation.end.split('+')[0];
  inputProfessor.value = allocation.professor.id;
  inputCourse.value = allocation.course.id;
  setErrorSelectProfessor(false);
  setErrorSelectCourse(false);
}

function removeModal() {
  const modalElement = document.getElementById("form-allocation");
 
 const modalBootstrap = bootstrap.Modal.getInstance(modalElement);

  modalBootstrap.hide();
}

btnSalvar.addEventListener("click", salvar);
addbtn.addEventListener("click", abrirModalCriar);

function createRow(allocation) {
  const row = document.createElement('tr');
  const idCollumn = document.createElement('th');
  const professorCollumn = document.createElement('td');
  const cursoCollumn = document.createElement('td');
  const diaCollumn = document.createElement('td');
  const horarioCollumn = document.createElement('td');
  const acoesCollumn = document.createElement("td");

  const imgDelete = document.createElement("img");
  imgDelete.src = "../assets/delete.svg";

  const imgEdit = document.createElement("img");
  imgEdit.src = "../assets/edit.svg";

  const btnDelete = document.createElement("button");
  btnDelete.addEventListener("click", () => remover(allocation, row));
  btnDelete.classList.add("btn");
  btnDelete.classList.add("button-ghost");
  btnDelete.appendChild(imgDelete); 
  btnDelete.title = `Remover ${allocation}`;

  const btnEdit = document.createElement("button");
  btnEdit.setAttribute("data-bs-toggle", "modal");
  btnEdit.setAttribute("data-bs-target", "#form-allocation");
  btnEdit.addEventListener("click", () =>
    abrirModalAtualizar(allocation));
  btnEdit.classList.add("btn");
  btnEdit.classList.add("button-ghost");
  btnEdit.appendChild(imgEdit);
  btnEdit.title = `Editar ${allocation.id}`;

  idCollumn.textContent = allocation.id;
  idCollumn.setAttribute("scope", "row");

  professorCollumn.textContent = allocation.professor.name;

  cursoCollumn.textContent = allocation.course.name;

  diaCollumn.textContent = getDayNameInPortuguese(allocation.day);
  const horario = `${removeTimezone(allocation.start)} - ${removeTimezone(allocation.end)}`;
  horarioCollumn.textContent = horario;

  acoesCollumn.appendChild(btnDelete);
  acoesCollumn.appendChild(btnEdit);


  row.appendChild(idCollumn);
  row.appendChild(professorCollumn);
  row.appendChild(cursoCollumn);
  row.appendChild(diaCollumn);
  row.appendChild(horarioCollumn);
  row.appendChild(acoesCollumn);

  tableBody.appendChild(row);

  showTable();
}

function removeTimezone(hour){
  return hour.replace("+0000", "");
}

function getDayNameInPortuguese(dayEnum){
  if (dayEnum == "MONDAY"){
    return "Segunda-Feira"
  } else if (dayEnum == "TUESDAY"){
    return "Terça-feira";
  }else if (dayEnum == "WEDNESDAY"){
    return "Quarta-feira";
  }else if (dayEnum == "THURSDAY"){
    return "Quinta-feira";
  }else if (dayEnum == "FRIDAY"){
    return "Sexta-feira";
  }else if (dayEnum == "SATURDAY"){
    return "Sábado";
  }else if (dayEnum == "SUNDAY"){
    return "Domingo";
  }
}

getAllocations();
getProfessors();
getCourses();
