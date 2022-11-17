const departmentsUrl = 'http://localhost:8080/departments';

const table = document.getElementById('table');
const tableBody = document.getElementById('table-body');

async function getdepartments() {
  const response = await fetch(departmentsUrl);
  if (response.ok) {
    const departments = await response.json();

    if (departments.length > 0) {
      table.removeAttribute('hidden');
      departments.forEach((department) => {
        createRow(department);
      })
    }
    
  }
}

function createRow({id, name}) {
  const row = document.createElement('tr');
  const idCollumn = document.createElement('th');
  const nameCollumn = document.createElement('td');

  idCollumn.textContent = id;
  idCollumn.setAttribute("scope", "row");

  nameCollumn.textContent = name;

  row.appendChild(idCollumn);
  row.appendChild(nameCollumn);

  tableBody.appendChild(row);
}


getdepartments();
