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
const inputDay = document.getElementById("input-day");
const inputStart = document.getElementById("input-start");
const inputEnd = document.getElementById("input-end");

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

function setErrorSelect(isError) {
  if (isError) {
    inputProfessor.classList.add("is-invalid");
  } else {
    inputProfessor.classList.remove("is-invalid");
  }
}

function setErrorSelect(isError) {
  if (isError) {
    inputCourse.classList.add("is-invalid");
  } else {
    inputCourse.classList.remove("is-invalid");
  }
}

async function remover(allocation) {
  const result = confirm("Você deseja remover o alocação ?");

  if (result) {
    const isSucess = await remove(allocationsUrl + id)
    if (isSucess) {
      tableBody.removeChild(row);
    }
  }
}

async function adicionar() {
  const day = inputDay.value.trim();
  const start = inputStart.value.trim();
  const end = inputEnd.value.trim();
  const professorId = parseInt(inputProfessor.value.trim());
  const courseId = parseInt(inputCourse.value.trim());

  if (professorId && courseId && day && start && end) 
  {
    const allocation = await post(allocationsUrl, {
      professorId,
      courseId,
      day,
      start,
      end,
    });

    if (allocation) {
      inputDay.value = "";
      inputStart.value = "";
      inputEnd.value = "";
      inputProfessor.value = "0";
      inputCourse.value = "0";

      removeModal();
      createRow(allocation);
      showTable();
    }
  } else if (!professorId) {
    setErrorSelect(true);
  }
    else if (!courseId) {
    setErrorSelect(true);
  }
}

async function atualizar() {
  const day = inputDay.value.trim();
  const start = inputStart.value.trim();
  const end = inputEnd.value.trim();
  const professorId = parseInt(inputProfessor.value.trim());
  const courseId = parseInt(inputCourse.value.trim());

  if (professorId && courseId && day && start && end) {
    const allocation = await post(allocationsUrl, {
      professorId,
      courseId,
      day,
      start,
      end,
    });

    if (allocation) {
      inputDay.value = "";
      inputStart.value = "";
      inputEnd.value = "";
      inputProfessor.value = "0";
      inputCourse.value = "0";

      removeModal();
      createRow(allocation);
      showTable();
    }
  } else if (!professorId) {
    setErrorSelect(true);
  }
    else if (!courseId) {
    setErrorSelect(true);
  }
}

function showTable() {
  table.removeAttribute("hidden");
}

async function abrirModalCriar() {
  actualId = 0;
  document.getElementById("formAllocationLabel").textContent =
    "Adicionar alocação";
    inputDay.value = "";
    inputStart.value = "";
    inputEnd.value = "";
    inputProfessor.value = "0";
    inputCourse.value = "0";
  setErrorSelect(false);
}

async function abrirModalAtualizar(id,professor,curso,day,start,end, row) {
  actualId = id;
  document.getElementById("formAllocationLabel").textContent =
    "Editar Alocação";
    inputDay.value = "";
    inputStart.value = "";
    inputEnd.value = "";
  inputProfessor.value = professor.id;
  inputCourse.value = course.id;
  setErrorSelect(false);
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
 const dayCollumn = document.createElement('td');
 const startCollumn = document.createElement('td');
 const endCollumn = document.createElement('td');

  const imgDelete = document.createElement("img");
  imgDelete.src = "../assets/delete.svg";

  const imgEdit = document.createElement("img");
  imgEdit.src = "../assets/edit.svg";

  const btnDelete = document.createElement("button");
  btnDelete.addEventListener("click", () => remover(id,professor,curso,day,star,end, row));
  btnDelete.classList.add("btn");
  btnDelete.classList.add("button-ghost");
  btnDelete.appendChild(imgDelete);
  btnDelete.title = `Remover ${allocation}`;

  const btnEdit = document.createElement("button");
  btnEdit.setAttribute("data-bs-toggle", "modal");
  btnEdit.setAttribute("data-bs-target", "#form-allocation");
  btnEdit.addEventListener("click", () =>
    abrirModalAtualizar(id,professor,curso,day,start,end)
  );
  btnEdit.classList.add("btn");
  btnEdit.classList.add("button-ghost");
  btnEdit.appendChild(imgEdit);
  btnEdit.title = `Editar ${allocation}`;

  idCollumn.textContent = allocation.id;
  idCollumn.setAttribute("scope", "row");

  professorCollumn.textContent = allocation.professor.name;

  cursoCollumn.textContent = allocation.course.name;

  dayCollumn.textContent = allocation.dayOfWeek;


  acoesCollumn.appendChild(btnDelete);
  acoesCollumn.appendChild(btnEdit);

  row.appendChild(idCollumn);
  row.appendChild(professorCollumn);
  row.appendChild(cursoCollumn);
  row.appendChild(dayCollumn);
  row.appendChild(startCollumn);
  row.appendChild(endCollumn);

  tableBody.appendChild(row);
}


getAllocations();
getProfessors();
getCourses();
