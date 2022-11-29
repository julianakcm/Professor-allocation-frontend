const departmentsUrl = 'http://localhost:8080/departments/';

const table = document.getElementById('table');
const tableBody = document.getElementById('table-body');

const inputName = document.getElementById('input-name');
const btnSalvar = document.getElementById('btn-salvar');
const addbtn = document.getElementById('addbtn');

let actualId = 0;

async function getDepartments() {
  const response = await fetch(departmentsUrl);
  if (response.ok) {
    const departments = await response.json();

    if (departments.length > 0) {
      table.removeAttribute('hidden');
      departments.forEach((department) => {
        createRow(department);
      })


      showTable();
    }
    }
    
  }

function showTable() {
  table.removeAttribute('hidden');
}

async function remover(id, name, row) {
  const result = confirm('Você deseja remover o departamento :'  + name);

  if (result) {
    const response = await fetch(departmentsUrl + id, {
      method: 'DELETE',
    });
    if (response.ok) {
      tableBody.removeChild(row);
    }
  }
}

async function salvar() {
  if (actualId) {
    atualizar();
  } else {
    adicionar();
  }
}

async function adicionar() {
  const name = inputName.value.trim();

  if (name) {
    const response = await fetch(departmentsUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        name
      })
    });
    if (response.ok) {
      const department = await response.json();
      inputName.value = "";
      removeModal();
      createRow(department);
      showTable();
    }
  } else {
    alert('O nome do departamento precisa ter 3 ou mais caracteres!')
  }
}

async function atualizar() {
  const name = inputName.value.trim();

  if (name) {
    const response = await fetch(departmentsUrl + actualId, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        name
      })
    });
    if (response.ok) {
      inputName.value = "";
      removeModal();

      tableBody.innerHTML = "";
      getDepartments();
    }
  }
}

function abrirModalCriar() {
  actualId = 0;
  document.getElementById('formCouseLabel').textContent = 'Adicionar departamento';
  inputName.value = "";
}

function abrirModalAtualizar(departmentId, name) {
  actualId = departmentId;
  document.getElementById('formCouseLabel').textContent = 'Editar departamento';
  inputName.value = name;
}

function removeModal() {
  const modalElement = document.getElementById("form-department");
  const modalBootstrap = bootstrap.Modal.getInstance(modalElement);

  modalBootstrap.hide();
}

btnSalvar.addEventListener('click', salvar);
addbtn.addEventListener('click', abrirModalCriar);

function createRow({id, name}) {
  const row = document.createElement('tr');
  const idCollumn = document.createElement('th');
  const nameCollumn = document.createElement('td');
  const acoesCollumn = document.createElement('td');

  const imgDelete = document.createElement('img');
  imgDelete.src = '../assets/delete.svg';

  const imgEdit = document.createElement('img');
  imgEdit.src = '../assets/edit.svg';

  const btnDelete = document.createElement('button');
  btnDelete.addEventListener('click', () => remover(id, name, row));
  btnDelete.classList.add('btn');
  btnDelete.classList.add('button-ghost');
  btnDelete.appendChild(imgDelete);
  btnDelete.title = `Remover ${name}`;

  const btnEdit = document.createElement('button');
  btnEdit.setAttribute('data-bs-toggle', 'modal');
  btnEdit.setAttribute('data-bs-target', '#form-department');
  btnEdit.addEventListener('click', () => abrirModalAtualizar(id, name));
  btnEdit.classList.add('btn');
  btnEdit.classList.add('button-ghost');
  btnEdit.appendChild(imgEdit);
  btnEdit.title = `Editar ${name}`;

  idCollumn.textContent = id;
  idCollumn.setAttribute("scope", "row");

  nameCollumn.textContent = name;

  acoesCollumn.appendChild(btnDelete);
  acoesCollumn.appendChild(btnEdit);

  row.appendChild(idCollumn);
  row.appendChild(nameCollumn);
  row.appendChild(acoesCollumn);

  tableBody.appendChild(row);
}

getDepartments();
