(function () {
  'use strict';

  var STORAGE_KEY = 'quantum_tasks';

  var SEED = [
    { titulo: 'Validar proveedores nuevos', descripcion: 'Revisar documentación y estado comercial.' },
    { titulo: 'Actualizar inventario', descripcion: 'Sincronizar productos con disponibilidad real.' },
    { titulo: 'Seguimiento a clientes clave', descripcion: 'Consultar historiales y solicitudes abiertas.' }
  ];

  var modal = document.getElementById('taskModal');
  var btnNew = document.getElementById('newTaskBtn');
  var form = document.getElementById('taskForm');
  var titleInput = document.getElementById('taskTitle');
  var descInput = document.getElementById('taskDescription');
  var cancelBtn = document.getElementById('taskCancel');
  var taskList = document.getElementById('taskList');

  if (!modal || !btnNew || !form || !taskList) return;

  var tasks = load();

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      return SEED.slice();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
    return SEED.slice();
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(function (t) {
      var li = document.createElement('li');
      var dot = document.createElement('span');
      li.appendChild(dot);

      var div = document.createElement('div');
      var strong = document.createElement('strong');
      strong.textContent = t.titulo;
      div.appendChild(strong);
      if (t.descripcion) {
        var p = document.createElement('p');
        p.textContent = t.descripcion;
        div.appendChild(p);
      }
      li.appendChild(div);
      taskList.appendChild(li);
    });
  }

  function openModal() {
    form.reset();
    modal.classList.add('show');
    titleInput.focus();
  }

  function closeModal() {
    modal.classList.remove('show');
  }

  btnNew.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', function (e) {
    if (e.target.classList && e.target.classList.contains('modal-backdrop')) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var titulo = titleInput.value.trim();
    if (!titulo) return;
    tasks.push({ titulo: titulo, descripcion: descInput.value.trim() });
    save();
    renderTasks();
    closeModal();
  });

  renderTasks();
})();
