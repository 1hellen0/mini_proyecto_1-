(function () {
  'use strict';

  var BADGES = {
    'Activo': 'ok',
    'Inactivo': 'off',
    'Pendiente': 'warn',
    'En revisión': 'warn'
  };

  var MODULES = {
    clientes: {
      singular: 'cliente',
      fields: [
        { key: 'nombre', label: 'Nombre', type: 'text', required: true },
        { key: 'email', label: 'Correo electrónico', type: 'email', required: true },
        { key: 'telefono', label: 'Teléfono', type: 'tel' },
        { key: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo', 'Pendiente'] }
      ],
      resumen: function (data) {
        return [
          { icon: 'AC', p: 'Clientes registrados', value: data.length.toLocaleString('es-CO'), small: 'Total en el sistema' },
          { icon: 'OK', p: 'Clientes activos', value: data.filter(function (r) { return r.estado === 'Activo'; }).length.toLocaleString('es-CO'), small: 'Gestión comercial actualizada' }
        ];
      }
    },
    productos: {
      singular: 'producto',
      fields: [
        { key: 'nombre', label: 'Nombre', type: 'text', required: true },
        { key: 'categoria', label: 'Categoría', type: 'text' },
        { key: 'precio', label: 'Precio', type: 'number', min: 0, step: '0.01', format: function (v) { return '$ ' + Number(v).toLocaleString('es-CO'); } },
        { key: 'stock', label: 'Stock', type: 'number', min: 0 }
      ],
      resumen: function (data) {
        return [
          { icon: 'PR', p: 'Productos registrados', value: data.length.toLocaleString('es-CO'), small: 'Inventario centralizado' },
          { icon: 'SC', p: 'Stock crítico', value: data.filter(function (r) { return Number(r.stock) < 10; }).length.toLocaleString('es-CO'), small: 'Prioridad de abastecimiento' }
        ];
      }
    },
    proveedores: {
      singular: 'proveedor',
      fields: [
        { key: 'nombre', label: 'Nombre', type: 'text', required: true },
        { key: 'contacto', label: 'Contacto', type: 'text' },
        { key: 'telefono', label: 'Teléfono', type: 'tel' },
        { key: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'En revisión', 'Inactivo'] }
      ],
      resumen: function (data) {
        return [
          { icon: 'PV', p: 'Proveedores registrados', value: data.length.toLocaleString('es-CO'), small: 'Red operacional estable' },
          { icon: 'RV', p: 'En revisión', value: data.filter(function (r) { return r.estado === 'En revisión'; }).length.toLocaleString('es-CO'), small: 'Documentación por validar' }
        ];
      }
    }
  };

  var SEED = {
    clientes: [
      { id: 1, nombre: 'María López', email: 'maria.lopez@empresa.com', telefono: '300 123 4567', estado: 'Activo' },
      { id: 2, nombre: 'Juan Pérez', email: 'juan.perez@correo.com', telefono: '311 234 5678', estado: 'Activo' },
      { id: 3, nombre: 'Ana Torres', email: 'ana.torres@negocio.com', telefono: '320 345 6789', estado: 'Pendiente' },
      { id: 4, nombre: 'Carlos Ramírez', email: 'carlos.ramirez@comercio.com', telefono: '301 456 7890', estado: 'Activo' },
      { id: 5, nombre: 'Lucía Gómez', email: 'lucia.gomez@tienda.com', telefono: '315 567 8901', estado: 'Inactivo' },
      { id: 6, nombre: 'Pedro Sánchez', email: 'pedro.sanchez@empresa.com', telefono: '312 678 9012', estado: 'Activo' },
      { id: 7, nombre: 'Valentina Rojas', email: 'valentina.rojas@firma.com', telefono: '313 789 0123', estado: 'Pendiente' },
      { id: 8, nombre: 'Andrés Díaz', email: 'andres.diaz@negocio.com', telefono: '317 890 1234', estado: 'Activo' },
      { id: 9, nombre: 'Camila Castro', email: 'camila.castro@correo.com', telefono: '319 901 2345', estado: 'Activo' },
      { id: 10, nombre: 'Felipe Mora', email: 'felipe.mora@tienda.com', telefono: '316 012 3456', estado: 'Pendiente' }
    ],
    productos: [
      { id: 1, nombre: 'Laptop Pro 15"', categoria: 'Computación', precio: 2450000, stock: 12 },
      { id: 2, nombre: 'Teclado mecánico RGB', categoria: 'Periféricos', precio: 145000, stock: 38 },
      { id: 3, nombre: 'Monitor 27" 4K', categoria: 'Pantallas', precio: 980000, stock: 7 },
      { id: 4, nombre: 'Mouse inalámbrico', categoria: 'Periféricos', precio: 62000, stock: 64 },
      { id: 5, nombre: 'Impresora multifuncional', categoria: 'Impresión', precio: 420000, stock: 9 },
      { id: 6, nombre: 'Audífonos Bluetooth', categoria: 'Audio', precio: 210000, stock: 25 },
      { id: 7, nombre: 'Router WiFi 6', categoria: 'Redes', precio: 350000, stock: 14 },
      { id: 8, nombre: 'Silla ergonómica', categoria: 'Mobiliario', precio: 680000, stock: 4 },
      { id: 9, nombre: 'Tablet 10.5"', categoria: 'Tabletas', precio: 890000, stock: 11 },
      { id: 10, nombre: 'Disco SSD 1TB', categoria: 'Almacenamiento', precio: 310000, stock: 30 }
    ],
    proveedores: [
      { id: 1, nombre: 'TecnoImport', contacto: 'Laura Vélez', telefono: '305 111 2233', estado: 'Activo' },
      { id: 2, nombre: 'Distribuidora Andina', contacto: 'Ricardo Paz', telefono: '310 222 3344', estado: 'En revisión' },
      { id: 3, nombre: 'Suministros Global', contacto: 'Marta Ruiz', telefono: '322 333 4455', estado: 'Activo' },
      { id: 4, nombre: 'RedPoint S.A.S.', contacto: 'Julián Cárdenas', telefono: '318 444 5566', estado: 'Activo' },
      { id: 5, nombre: 'Comercial Norte', contacto: 'Silvia Peña', telefono: '301 555 6677', estado: 'En revisión' },
      { id: 6, nombre: 'Almacenes Digitales', contacto: 'Óscar Luna', telefono: '312 666 7788', estado: 'Inactivo' },
      { id: 7, nombre: 'Tech Supply', contacto: 'Karen Duarte', telefono: '320 777 8899', estado: 'Activo' },
      { id: 8, nombre: 'Importadora Latina', contacto: 'Andrés Pineda', telefono: '313 888 9900', estado: 'Activo' },
      { id: 9, nombre: 'Equipos y Suministros', contacto: 'Diana Franco', telefono: '311 999 0011', estado: 'En revisión' },
      { id: 10, nombre: 'Mercado Tecnológico', contacto: 'Iván Salazar', telefono: '315 000 1122', estado: 'Activo' }
    ]
  };

  var page = document.body.dataset.module;
  if (!page || !MODULES[page]) return;

  var config = MODULES[page];
  var storageKey = 'quantum_' + page;
  var form = document.getElementById('recordForm');
  var formTitle = document.getElementById('formTitle');
  var btnCancel;
  var tableHead = document.getElementById('tableHead');
  var tableBody = document.getElementById('tableBody');
  var summaryGrid = document.getElementById('summaryGrid');

  var records = load();
  var editingId = null;

  document.querySelectorAll('.sidebar-menu a').forEach(function (link) {
    if (link.getAttribute('href') === page + '.html') link.classList.add('active');
  });

  var toastEl = document.createElement('div');
  toastEl.className = 'toast';
  document.body.appendChild(toastEl);
  var toastTimer;

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('show');
    }, 2600);
  }

  var modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML =
    '<div class="modal-backdrop"></div>' +
    '<div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modalTitle">' +
      '<h3 id="modalTitle">Confirmar acción</h3>' +
      '<p id="modalMessage"></p>' +
      '<div class="modal-actions">' +
        '<button type="button" id="modalCancel" class="btn-ghost">Cancelar</button>' +
        '<button type="button" id="modalOk" class="btn-danger">Eliminar</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);

  var modalMessage = document.getElementById('modalMessage');
  var modalOk = document.getElementById('modalOk');
  var modalCancel = document.getElementById('modalCancel');
  var modalConfirm;

  function openModal(message, onConfirm) {
    modalMessage.textContent = message;
    modalConfirm = onConfirm;
    modal.classList.add('show');
    modalCancel.focus();
  }

  function closeModal() {
    modal.classList.remove('show');
    modalConfirm = null;
  }

  modalCancel.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target.classList && e.target.classList.contains('modal-backdrop')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  modalOk.addEventListener('click', function () {
    var fn = modalConfirm;
    closeModal();
    if (fn) fn();
  });

  function load() {
    try {
      var raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch (err) {
      return [];
    }
    localStorage.setItem(storageKey, JSON.stringify(SEED[page]));
    return SEED[page].slice();
  }

  function save() {
    localStorage.setItem(storageKey, JSON.stringify(records));
  }

  function uid() {
    var max = 0;
    records.forEach(function (r) {
      if (Number(r.id) > max) max = Number(r.id);
    });
    return max + 1;
  }

  function buildForm() {
    config.fields.forEach(function (f) {
      var label = document.createElement('label');
      label.className = 'form-field';
      var span = document.createElement('span');
      span.textContent = f.label + (f.required ? ' *' : '');
      label.appendChild(span);

      var input;
      if (f.type === 'select') {
        input = document.createElement('select');
        f.options.forEach(function (o) {
          var op = document.createElement('option');
          op.value = o;
          op.textContent = o;
          input.appendChild(op);
        });
      } else {
        input = document.createElement('input');
        input.type = f.type;
        if (f.required) input.required = true;
        if (f.min !== undefined) input.min = f.min;
        if (f.step) input.step = f.step;
      }
      input.name = f.key;
      label.appendChild(input);
      form.appendChild(label);
    });

    var actions = document.createElement('div');
    actions.className = 'form-actions';
    actions.innerHTML =
      '<button type="submit" class="primary-action">Guardar</button>' +
      '<button type="button" id="btnCancel" class="btn-ghost is-hidden">Cancelar</button>';
    form.appendChild(actions);
  }

  function resetForm() {
    form.reset();
    editingId = null;
    formTitle.textContent = 'Nuevo ' + config.singular;
    btnCancel.classList.add('is-hidden');
  }

  function renderSummary() {
    summaryGrid.innerHTML = '';
    config.resumen(records).forEach(function (c) {
      var card = document.createElement('article');
      card.className = 'summary-card';

      var icon = document.createElement('span');
      icon.className = 'card-icon';
      icon.textContent = c.icon;

      var p = document.createElement('p');
      p.textContent = c.p;

      var h3 = document.createElement('h3');
      h3.textContent = c.value;

      var small = document.createElement('small');
      small.textContent = c.small;

      card.appendChild(icon);
      card.appendChild(p);
      card.appendChild(h3);
      card.appendChild(small);
      summaryGrid.appendChild(card);
    });
  }

  function renderTable() {
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    var headRow = document.createElement('tr');
    config.fields.forEach(function (f) {
      var th = document.createElement('th');
      th.textContent = f.label;
      headRow.appendChild(th);
    });
    var thAction = document.createElement('th');
    thAction.textContent = 'Acciones';
    headRow.appendChild(thAction);
    tableHead.appendChild(headRow);

    if (!records.length) {
      var empty = document.createElement('tr');
      var emptyTd = document.createElement('td');
      emptyTd.className = 'empty-state';
      emptyTd.colSpan = config.fields.length + 1;
      emptyTd.textContent = 'No hay registros. Crea el primero con el formulario.';
      empty.appendChild(emptyTd);
      tableBody.appendChild(empty);
      return;
    }

    records.forEach(function (rec) {
      var tr = document.createElement('tr');
      config.fields.forEach(function (f) {
        var td = document.createElement('td');
        var v = rec[f.key];
        if (f.type === 'select') {
          var badge = document.createElement('span');
          badge.className = 'badge ' + (BADGES[v] || 'neutral');
          badge.textContent = v;
          td.appendChild(badge);
        } else if (f.format) {
          td.textContent = f.format(v);
        } else {
          td.textContent = v;
        }
        tr.appendChild(td);
      });

      var tdAction = document.createElement('td');
      tdAction.className = 'row-actions';
      tdAction.innerHTML =
        '<button type="button" class="btn-edit" data-action="edit" data-id="' + rec.id + '">Editar</button>' +
        '<button type="button" class="btn-delete" data-action="delete" data-id="' + rec.id + '">Eliminar</button>';
      tr.appendChild(tdAction);
      tableBody.appendChild(tr);
    });
  }

  function renderAll() {
    renderSummary();
    renderTable();
  }

  function startEdit(id) {
    var rec = records.filter(function (r) { return Number(r.id) === Number(id); })[0];
    if (!rec) return;
    editingId = Number(id);
    config.fields.forEach(function (f) {
      form.elements[f.key].value = rec[f.key];
    });
    formTitle.textContent = 'Editar ' + config.singular;
    btnCancel.classList.remove('is-hidden');
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function removeRecord(id) {
    openModal('¿Eliminar este ' + config.singular + '?', function () {
      records = records.filter(function (r) { return Number(r.id) !== Number(id); });
      save();
      renderAll();
      toast(config.singular.charAt(0).toUpperCase() + config.singular.slice(1) + ' eliminado');
      if (editingId === Number(id)) resetForm();
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {};
    config.fields.forEach(function (f) {
      var el = form.elements[f.key];
      data[f.key] = f.type === 'number' ? parseFloat(el.value) || 0 : el.value.trim();
    });

    if (editingId !== null) {
      records = records.map(function (r) {
        return Number(r.id) === editingId ? Object.assign({}, r, data) : r;
      });
      toast('Registro actualizado');
    } else {
      data.id = uid();
      records.push(data);
      toast('Registro creado');
    }
    save();
    renderAll();
    resetForm();
  });

  tableBody.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-action]');
    if (!btn) return;
    var id = btn.dataset.id;
    if (btn.dataset.action === 'edit') startEdit(id);
    if (btn.dataset.action === 'delete') removeRecord(id);
  });

  buildForm();
  btnCancel = document.getElementById('btnCancel');
  btnCancel.addEventListener('click', resetForm);
  resetForm();
  renderAll();
})();
