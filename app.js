(function () {
  'use strict';

  var BADGES = {
    'Activo': 'ok',
    'Inactivo': 'off',
    'Pendiente': 'warn',
    'En revisión': 'warn',
    'En tránsito': 'warn',
    'Entregado': 'ok',
    'Cancelado': 'off'
  };

  var MODULES = {
    clientes: {
      singular: 'cliente',
      fields: [
        { key: 'nombre', label: 'Nombre', type: 'text', required: true },
        { key: 'email', label: 'Correo electrónico', type: 'email', required: true },
        { key: 'telefono', label: 'Teléfono', type: 'tel' },
        { key: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo', 'Pendiente'] },
        { key: 'fechaRegistro', label: 'Fecha de registro', type: 'date' }
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
        { key: 'stock', label: 'Stock', type: 'number', min: 0 },
        { key: 'fechaRegistro', label: 'Fecha de registro', type: 'date' }
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
        { key: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'En revisión', 'Inactivo'] },
        { key: 'tipoSuministro', label: 'Tipo de suministro', type: 'select', options: ['Tecnología', 'Hardware', 'Software', 'Servicios', 'Logística'] },
        { key: 'fechaRegistro', label: 'Fecha de registro', type: 'date' }
      ],
      resumen: function (data) {
        return [
          { icon: 'PV', p: 'Proveedores registrados', value: data.length.toLocaleString('es-CO'), small: 'Red operacional estable' },
          { icon: 'RV', p: 'En revisión', value: data.filter(function (r) { return r.estado === 'En revisión'; }).length.toLocaleString('es-CO'), small: 'Documentación por validar' }
        ];
      }
    },
    pedidos: {
      singular: 'pedido',
      fields: [
        { key: 'cliente', label: 'Cliente', type: 'select', optionsFrom: 'clientes', display: 'nombre' },
        { key: 'proveedor', label: 'Proveedor', type: 'select', optionsFrom: 'proveedores', display: 'nombre' },
        { key: 'producto', label: 'Producto', type: 'text', required: true },
        { key: 'cantidad', label: 'Cantidad', type: 'number', min: 0 },
        { key: 'total', label: 'Valor total', type: 'number', min: 0, step: '0.01', format: function (v) { return '$ ' + Number(v).toLocaleString('es-CO'); } },
        { key: 'estado', label: 'Estado', type: 'select', options: ['Pendiente', 'En tránsito', 'Entregado', 'Cancelado'] },
        { key: 'fechaRegistro', label: 'Fecha de registro', type: 'date' }
      ],
      resumen: function (data) {
        return [
          { icon: 'PD', p: 'Pedidos registrados', value: data.length.toLocaleString('es-CO'), small: 'Total de pedidos' },
          { icon: 'PT', p: 'En tránsito', value: data.filter(function (r) { return r.estado === 'En tránsito'; }).length.toLocaleString('es-CO'), small: 'Por confirmar entrega' }
        ];
      }
    }
  };

  function pad2(n) {
    return ('0' + n).slice(-2);
  }

  function todayIso() {
    var d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function daysAgoIso(n) {
    var d = new Date();
    d.setDate(d.getDate() - n);
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  var SEED = {
    clientes: [
      { id: 1, nombre: 'María López', email: 'maria.lopez@empresa.com', telefono: '300 123 4567', estado: 'Activo', fechaRegistro: daysAgoIso(0) },
      { id: 2, nombre: 'Juan Pérez', email: 'juan.perez@correo.com', telefono: '311 234 5678', estado: 'Activo', fechaRegistro: daysAgoIso(1) },
      { id: 3, nombre: 'Ana Torres', email: 'ana.torres@negocio.com', telefono: '320 345 6789', estado: 'Pendiente', fechaRegistro: daysAgoIso(1) },
      { id: 4, nombre: 'Carlos Ramírez', email: 'carlos.ramirez@comercio.com', telefono: '301 456 7890', estado: 'Activo', fechaRegistro: daysAgoIso(2) },
      { id: 5, nombre: 'Lucía Gómez', email: 'lucia.gomez@tienda.com', telefono: '315 567 8901', estado: 'Inactivo', fechaRegistro: daysAgoIso(3) },
      { id: 6, nombre: 'Pedro Sánchez', email: 'pedro.sanchez@empresa.com', telefono: '312 678 9012', estado: 'Activo', fechaRegistro: daysAgoIso(4) },
      { id: 7, nombre: 'Valentina Rojas', email: 'valentina.rojas@firma.com', telefono: '313 789 0123', estado: 'Pendiente', fechaRegistro: daysAgoIso(5) },
      { id: 8, nombre: 'Andrés Díaz', email: 'andres.diaz@negocio.com', telefono: '317 890 1234', estado: 'Activo', fechaRegistro: daysAgoIso(6) },
      { id: 9, nombre: 'Camila Castro', email: 'camila.castro@correo.com', telefono: '319 901 2345', estado: 'Activo', fechaRegistro: daysAgoIso(7) },
      { id: 10, nombre: 'Felipe Mora', email: 'felipe.mora@tienda.com', telefono: '316 012 3456', estado: 'Pendiente', fechaRegistro: daysAgoIso(8) }
    ],
    productos: [
      { id: 1, nombre: 'Laptop Pro 15"', categoria: 'Computación', precio: 2450000, stock: 12, fechaRegistro: daysAgoIso(0) },
      { id: 2, nombre: 'Teclado mecánico RGB', categoria: 'Periféricos', precio: 145000, stock: 38, fechaRegistro: daysAgoIso(1) },
      { id: 3, nombre: 'Monitor 27" 4K', categoria: 'Pantallas', precio: 980000, stock: 7, fechaRegistro: daysAgoIso(2) },
      { id: 4, nombre: 'Mouse inalámbrico', categoria: 'Periféricos', precio: 62000, stock: 64, fechaRegistro: daysAgoIso(2) },
      { id: 5, nombre: 'Impresora multifuncional', categoria: 'Impresión', precio: 420000, stock: 9, fechaRegistro: daysAgoIso(3) },
      { id: 6, nombre: 'Audífonos Bluetooth', categoria: 'Audio', precio: 210000, stock: 25, fechaRegistro: daysAgoIso(4) },
      { id: 7, nombre: 'Router WiFi 6', categoria: 'Redes', precio: 350000, stock: 14, fechaRegistro: daysAgoIso(5) },
      { id: 8, nombre: 'Silla ergonómica', categoria: 'Mobiliario', precio: 680000, stock: 4, fechaRegistro: daysAgoIso(6) },
      { id: 9, nombre: 'Tablet 10.5"', categoria: 'Tabletas', precio: 890000, stock: 11, fechaRegistro: daysAgoIso(7) },
      { id: 10, nombre: 'Disco SSD 1TB', categoria: 'Almacenamiento', precio: 310000, stock: 30, fechaRegistro: daysAgoIso(8) }
    ],
    proveedores: [
      { id: 1, nombre: 'TecnoImport', contacto: 'Laura Vélez', telefono: '305 111 2233', estado: 'Activo', tipoSuministro: 'Hardware', fechaRegistro: daysAgoIso(0) },
      { id: 2, nombre: 'Distribuidora Andina', contacto: 'Ricardo Paz', telefono: '310 222 3344', estado: 'En revisión', tipoSuministro: 'Tecnología', fechaRegistro: daysAgoIso(1) },
      { id: 3, nombre: 'Suministros Global', contacto: 'Marta Ruiz', telefono: '322 333 4455', estado: 'Activo', tipoSuministro: 'Logística', fechaRegistro: daysAgoIso(2) },
      { id: 4, nombre: 'RedPoint S.A.S.', contacto: 'Julián Cárdenas', telefono: '318 444 5566', estado: 'Activo', tipoSuministro: 'Hardware', fechaRegistro: daysAgoIso(3) },
      { id: 5, nombre: 'Comercial Norte', contacto: 'Silvia Peña', telefono: '301 555 6677', estado: 'En revisión', tipoSuministro: 'Servicios', fechaRegistro: daysAgoIso(4) },
      { id: 6, nombre: 'Almacenes Digitales', contacto: 'Óscar Luna', telefono: '312 666 7788', estado: 'Inactivo', tipoSuministro: 'Software', fechaRegistro: daysAgoIso(5) },
      { id: 7, nombre: 'Tech Supply', contacto: 'Karen Duarte', telefono: '320 777 8899', estado: 'Activo', tipoSuministro: 'Hardware', fechaRegistro: daysAgoIso(6) },
      { id: 8, nombre: 'Importadora Latina', contacto: 'Andrés Pineda', telefono: '313 888 9900', estado: 'Activo', tipoSuministro: 'Tecnología', fechaRegistro: daysAgoIso(7) },
      { id: 9, nombre: 'Equipos y Suministros', contacto: 'Diana Franco', telefono: '311 999 0011', estado: 'En revisión', tipoSuministro: 'Software', fechaRegistro: daysAgoIso(8) },
      { id: 10, nombre: 'Mercado Tecnológico', contacto: 'Iván Salazar', telefono: '315 000 1122', estado: 'Activo', tipoSuministro: 'Logística', fechaRegistro: daysAgoIso(9) }
    ]
  };

  SEED.pedidos = [
    { id: 1, cliente: SEED.clientes[0].nombre, proveedor: SEED.proveedores[0].nombre, producto: 'Laptop Pro 15"', cantidad: 3, total: 7350000, estado: 'Entregado', fechaRegistro: daysAgoIso(1) },
    { id: 2, cliente: SEED.clientes[1].nombre, proveedor: SEED.proveedores[2].nombre, producto: 'Teclado mecánico RGB', cantidad: 10, total: 1450000, estado: 'En tránsito', fechaRegistro: daysAgoIso(2) },
    { id: 3, cliente: SEED.clientes[3].nombre, proveedor: SEED.proveedores[1].nombre, producto: 'Monitor 27" 4K', cantidad: 2, total: 1960000, estado: 'Pendiente', fechaRegistro: daysAgoIso(3) },
    { id: 4, cliente: SEED.clientes[4].nombre, proveedor: SEED.proveedores[3].nombre, producto: 'Disco SSD 1TB', cantidad: 8, total: 2480000, estado: 'En tránsito', fechaRegistro: daysAgoIso(4) },
    { id: 5, cliente: SEED.clientes[6].nombre, proveedor: SEED.proveedores[5].nombre, producto: 'Audífonos Bluetooth', cantidad: 6, total: 1260000, estado: 'Entregado', fechaRegistro: daysAgoIso(5) },
    { id: 6, cliente: SEED.clientes[2].nombre, proveedor: SEED.proveedores[7].nombre, producto: 'Router WiFi 6', cantidad: 4, total: 1400000, estado: 'Cancelado', fechaRegistro: daysAgoIso(6) },
    { id: 7, cliente: SEED.clientes[8].nombre, proveedor: SEED.proveedores[8].nombre, producto: 'Silla ergonómica', cantidad: 2, total: 1360000, estado: 'Pendiente', fechaRegistro: daysAgoIso(7) },
    { id: 8, cliente: SEED.clientes[5].nombre, proveedor: SEED.proveedores[4].nombre, producto: 'Tablet 10.5"', cantidad: 5, total: 4450000, estado: 'Entregado', fechaRegistro: daysAgoIso(8) },
    { id: 9, cliente: SEED.clientes[9].nombre, proveedor: SEED.proveedores[9].nombre, producto: 'Impresora multifuncional', cantidad: 1, total: 420000, estado: 'En tránsito', fechaRegistro: daysAgoIso(9) },
    { id: 10, cliente: SEED.clientes[7].nombre, proveedor: SEED.proveedores[6].nombre, producto: 'Mouse inalámbrico', cantidad: 20, total: 1240000, estado: 'Entregado', fechaRegistro: daysAgoIso(0) }
  ];

  var FIELD_DEFAULTS = {
    proveedores: { tipoSuministro: 'Tecnología' }
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
  var PAGE_SIZE = 5;
  var currentPage = 1;
  var dateFilter = document.getElementById('dateFilter');
  var searchFilter = document.getElementById('searchFilter');

  function normalizeText(value) {
    return String(value == null ? '' : value).toLowerCase()
      .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
      .replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n');
  }

  function getVisibleRecords() {
    var keyword = searchFilter ? normalizeText(searchFilter.value) : '';
    return records.filter(function (r) {
      if (dateFilter && dateFilter.value && (r.fechaRegistro || '').slice(0, 10) !== dateFilter.value) {
        return false;
      }
      if (keyword) {
        var found = config.fields.some(function (f) {
          return normalizeText(r[f.key]).indexOf(keyword) !== -1;
        });
        if (!found) return false;
      }
      return true;
    });
  }

  function applyFilters() {
    currentPage = 1;
    renderAll();
  }

  var isAdmin = window.QUANTUM_ROLE === 'admin';

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
    var data;
    try {
      var raw = localStorage.getItem(storageKey);
      if (raw) data = JSON.parse(raw);
    } catch (err) {
      data = [];
    }
    if (!data) {
      data = SEED[page].slice();
      localStorage.setItem(storageKey, JSON.stringify(data));
    } else {
      data = data.map(function (r) {
        var copy = Object.assign({}, r);
        if (!copy.fechaRegistro) copy.fechaRegistro = todayIso();
        var defaults = FIELD_DEFAULTS[page];
        if (defaults) {
          Object.keys(defaults).forEach(function (key) {
            if (copy[key] === undefined || copy[key] === null || copy[key] === '') {
              copy[key] = defaults[key];
            }
          });
        }
        return copy;
      });
    }
    return data;
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
        buildSelectOptions(f).forEach(function (op) {
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
      if (f.type === 'date' && !input.value) input.value = todayIso();
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

  function getOptionsFrom(moduleKey) {
    var source = [];
    try {
      var raw = localStorage.getItem('quantum_' + moduleKey);
      if (raw) source = JSON.parse(raw);
    } catch (e) {
      source = [];
    }
    if (!source.length && SEED[moduleKey]) source = SEED[moduleKey];
    return source;
  }

  function buildSelectOptions(f) {
    var options;
    if (f.options) {
      options = f.options;
    } else if (f.optionsFrom) {
      options = getOptionsFrom(f.optionsFrom).map(function (r) {
        return String(r[f.display] != null ? r[f.display] : r.id);
      });
    } else {
      options = [];
    }
    return options.map(function (o) {
      var op = document.createElement('option');
      op.value = o;
      op.textContent = o;
      return op;
    });
  }

  function resetForm() {
    form.reset();
    config.fields.forEach(function (f) {
      if (f.type === 'date') form.elements[f.key].value = todayIso();
    });
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

    var visible = getVisibleRecords();

    if (!visible.length) {
      var empty = document.createElement('tr');
      var emptyTd = document.createElement('td');
      emptyTd.className = 'empty-state';
      emptyTd.colSpan = config.fields.length + 1;
      emptyTd.textContent = dateFilter && dateFilter.value
        ? 'No hay registros para la fecha seleccionada.'
        : (searchFilter && searchFilter.value
          ? 'No hay registros para la búsqueda.'
          : 'No hay registros. Crea el primero con el formulario.');
      empty.appendChild(emptyTd);
      tableBody.appendChild(empty);
      renderPagination();
      return;
    }

    var totalPages = Math.ceil(visible.length / PAGE_SIZE);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    var start = (currentPage - 1) * PAGE_SIZE;
    var pageRecords = visible.slice(start, start + PAGE_SIZE);

    pageRecords.forEach(function (rec) {
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

      var editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn-edit';
      editBtn.textContent = 'Editar';
      editBtn.dataset.action = 'edit';
      editBtn.dataset.id = rec.id;

      var deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn-delete';
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.dataset.action = 'delete';
      deleteBtn.dataset.id = rec.id;

      if (!isAdmin) {
        editBtn.disabled = true;
        editBtn.title = 'Solo administradores';
        deleteBtn.disabled = true;
        deleteBtn.title = 'Solo administradores';
      }

      tdAction.appendChild(editBtn);
      tdAction.appendChild(deleteBtn);
      tr.appendChild(tdAction);
      tableBody.appendChild(tr);
    });

    renderPagination();
  }

  function renderPagination() {
    var pagination = document.getElementById('pagination');
    if (!pagination) return;

    var visible = getVisibleRecords();
    var totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
    pagination.innerHTML = '';

    var start = visible.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
    var end = Math.min(currentPage * PAGE_SIZE, visible.length);

    var info = document.createElement('span');
    info.className = 'pagination-info';
    info.textContent = visible.length
      ? 'Mostrando ' + start + '-' + end + ' de ' + visible.length
      : 'Sin registros';
    pagination.appendChild(info);

    var controls = document.createElement('div');
    controls.className = 'pagination-controls';

    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'pagination-btn';
    prev.textContent = 'Anterior';
    prev.disabled = currentPage <= 1;
    prev.addEventListener('click', function () {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });
    controls.appendChild(prev);

    for (var i = 1; i <= totalPages; i++) {
      (function (pageNum) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pagination-btn' + (pageNum === currentPage ? ' is-active' : '');
        btn.textContent = pageNum;
        if (pageNum === currentPage) btn.setAttribute('aria-current', 'page');
        btn.addEventListener('click', function () {
          currentPage = pageNum;
          renderTable();
        });
        controls.appendChild(btn);
      })(i);
    }

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'pagination-btn';
    next.textContent = 'Siguiente';
    next.disabled = currentPage >= totalPages;
    next.addEventListener('click', function () {
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
      }
    });
    controls.appendChild(next);

    pagination.appendChild(controls);
  }

  function renderAll() {
    renderSummary();
    renderTable();
  }

  function normalizeHeader(value) {
    return String(value).toLowerCase()
      .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
      .replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }

  function mapExcelRow(row) {
    var byHeader = {};
    config.fields.forEach(function (f) {
      byHeader[normalizeHeader(f.key)] = f.key;
      byHeader[normalizeHeader(f.label)] = f.key;
    });

    var mapped = {};
    Object.keys(row).forEach(function (header) {
      var key = byHeader[normalizeHeader(header)];
      if (key && mapped[key] === undefined) mapped[key] = row[header];
    });
    return mapped;
  }

  function importFromFile(file) {
    if (typeof XLSX === 'undefined') {
      toast('No se pudo cargar el lector de Excel');
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        var sheet = wb.Sheets[wb.SheetNames[0]];
        var rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        if (!rows.length) {
          toast('El archivo no contiene datos');
          return;
        }

        var added = 0;
        var skipped = 0;
        rows.forEach(function (row) {
          var mapped = mapExcelRow(row);
          var data = {};
          var valid = true;
          config.fields.forEach(function (f) {
            var value = mapped[f.key];
            if (f.required && (value === undefined || value === null || String(value).trim() === '')) {
              valid = false;
              return;
            }
            data[f.key] = f.type === 'number'
              ? parseFloat(String(value).replace(/[^0-9.\-]/g, '')) || 0
              : String(value).trim();
          });
          if (!valid) {
            skipped++;
            return;
          }
          data.id = uid();
          data.fechaRegistro = data.fechaRegistro || todayIso();
          records.push(data);
          added++;
        });

        if (added) {
          save();
          renderAll();
        }
        toast(added + ' ' + config.singular + (added === 1 ? ' importado' : 's importados') + (skipped ? ' · ' + skipped + ' omitidos' : ''));
      } catch (err) {
        toast('No se pudo leer el archivo');
      }
    };
    reader.onerror = function () {
      toast('No se pudo leer el archivo');
    };
    reader.readAsArrayBuffer(file);
  }

  var uploadBtn = document.getElementById('uploadBtn');
  var uploadInput = document.getElementById('uploadInput');
  if (uploadBtn && uploadInput) {
    uploadBtn.addEventListener('click', function () {
      uploadInput.click();
    });
    uploadInput.addEventListener('change', function () {
      var file = uploadInput.files && uploadInput.files[0];
      if (!file) return;
      importFromFile(file);
      uploadInput.value = '';
    });
  }

  function startEdit(id) {
    if (!isAdmin) {
      toast('No tienes permisos para editar registros');
      return;
    }
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
    if (!isAdmin) {
      toast('No tienes permisos para eliminar registros');
      return;
    }
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
      data.fechaRegistro = data.fechaRegistro || todayIso();
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
    if (!isAdmin) {
      toast('No tienes permisos para modificar registros');
      return;
    }
    var id = btn.dataset.id;
    if (btn.dataset.action === 'edit') startEdit(id);
    if (btn.dataset.action === 'delete') removeRecord(id);
  });

  if (dateFilter) {
    dateFilter.addEventListener('change', applyFilters);
  }
  if (searchFilter) {
    searchFilter.addEventListener('input', applyFilters);
  }

  buildForm();
  btnCancel = document.getElementById('btnCancel');
  btnCancel.addEventListener('click', resetForm);
  resetForm();
  renderAll();
})();
