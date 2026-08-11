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

  var MODULES = window.QUANTUM.MODULES;
  var SEED = window.QUANTUM.SEED;
  var FIELD_DEFAULTS = window.QUANTUM.FIELD_DEFAULTS;
  var todayIso = window.QUANTUM.todayIso;

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

  function setupPredictive(input) {
    if (!input) return;
    var field = config.fields.filter(function (f) { return f.key === input.name; })[0];
    if (!field || !field.predictive) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'predictive';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    var list = document.createElement('div');
    list.className = 'predictive-list';
    wrapper.appendChild(list);

    var isProductField = field.key === 'producto';
    var searchKeys = field.search || [field.display];

    function getRecords() {
      return getOptionsFrom(field.predictive);
    }

    function itemLabel(item) {
      var parts = [String(item[field.display] != null ? item[field.display] : item.id)];
      (field.labelKeys || []).forEach(function (k) {
        var v = item[k];
        if (v === undefined || v === null || v === '') return;
        parts.push(k === 'precio' ? '$ ' + Number(v).toLocaleString('es-CO') : String(v));
      });
      return parts.join(' · ');
    }

    function renderItems(items) {
      list.innerHTML = '';
      items.forEach(function (item) {
        var div = document.createElement('div');
        div.className = 'predictive-item';
        div.textContent = itemLabel(item);
        div.addEventListener('mousedown', function (e) {
          e.preventDefault();
          selectItem(item);
        });
        list.appendChild(div);
      });
    }

    function selectItem(item) {
      input.value = String(item[field.display] != null ? item[field.display] : item.id);
      input._selectedProduct = item;
      list.innerHTML = '';
      list.classList.remove('show');
      if (isProductField) updateTotal();
    }

    function updateTotal() {
      if (!input._selectedProduct) return;
      var cantidadEl = form.elements['cantidad'];
      var totalEl = form.elements['total'];
      if (!cantidadEl || !totalEl) return;
      var cant = parseFloat(cantidadEl.value) || 0;
      totalEl.value = Math.round((Number(input._selectedProduct.precio) || 0) * cant);
    }

    input.addEventListener('input', function () {
      var q = normalizeText(input.value).trim();
      input._selectedProduct = null;
      if (isProductField) updateTotal();
      if (!q) {
        list.innerHTML = '';
        list.classList.remove('show');
        return;
      }
      var items = getRecords().filter(function (p) {
        return searchKeys.some(function (k) {
          return normalizeText(p[k]).indexOf(q) !== -1;
        });
      });
      if (items.length) {
        renderItems(items.slice(0, 8));
        list.classList.add('show');
      } else {
        list.innerHTML = '';
        list.classList.remove('show');
      }
    });

    if (isProductField) {
      var cantidadEl = form.elements['cantidad'];
      if (cantidadEl) {
        cantidadEl.addEventListener('input', updateTotal);
      }
    }

    document.addEventListener('click', function (e) {
      if (!e.target.closest || !e.target.closest('.predictive')) {
        list.classList.remove('show');
      }
    });
  }

  function setupPredictiveFields() {
    config.fields.forEach(function (f) {
      if (f.predictive && form.elements[f.key]) {
        setupPredictive(form.elements[f.key]);
      }
    });
  }

  function resetForm() {
    form.reset();
    config.fields.forEach(function (f) {
      if (f.type === 'date') form.elements[f.key].value = todayIso();
      if (f.predictive && form.elements[f.key]) form.elements[f.key]._selectedProduct = null;
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

    var items = getPaginationItems(totalPages, currentPage);
    items.forEach(function (item) {
      if (item === 'ellipsis') {
        var ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '…';
        controls.appendChild(ellipsis);
        return;
      }
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pagination-btn' + (item === currentPage ? ' is-active' : '');
      btn.textContent = item;
      if (item === currentPage) btn.setAttribute('aria-current', 'page');
      btn.addEventListener('click', function () {
        currentPage = item;
        renderTable();
      });
      controls.appendChild(btn);
    });

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

  function getPaginationItems(totalPages, currentPage) {
    var items = [];
    var range = 1;
    if (totalPages <= 5) {
      for (var i = 1; i <= totalPages; i++) items.push(i);
      return items;
    }
    items.push(1);
    if (currentPage - range > 2) items.push('ellipsis');
    for (var i = Math.max(2, currentPage - range); i <= Math.min(totalPages - 1, currentPage + range); i++) items.push(i);
    if (currentPage + range < totalPages - 1) items.push('ellipsis');
    items.push(totalPages);
    return items;
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
      var el = form.elements[f.key];
      el.value = rec[f.key];
      if (f.predictive && rec[f.key]) {
        var match = getOptionsFrom(f.predictive).filter(function (p) {
          return String(p[f.display]) === String(rec[f.key]);
        })[0];
        el._selectedProduct = match || null;
        if (match && f.key === 'producto') {
          var cantidadEl = form.elements['cantidad'];
          var totalEl = form.elements['total'];
          if (cantidadEl && totalEl) {
            totalEl.value = Math.round((Number(match.precio) || 0) * (parseFloat(cantidadEl.value) || 0));
          }
        }
      }
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
  setupPredictiveFields();
  btnCancel = document.getElementById('btnCancel');
  btnCancel.addEventListener('click', resetForm);
  resetForm();
  renderAll();
})();
