(function () {
  'use strict';

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
        { key: 'cliente', label: 'Cliente', type: 'text', required: true, predictive: 'clientes', display: 'nombre', search: ['nombre', 'email'], labelKeys: ['email'] },
        { key: 'proveedor', label: 'Proveedor', type: 'select', optionsFrom: 'proveedores', display: 'nombre' },
        { key: 'producto', label: 'Producto', type: 'text', required: true, predictive: 'productos', display: 'nombre', search: ['nombre', 'categoria'], labelKeys: ['categoria', 'precio'] },
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

  function loadRecords(moduleKey) {
    var storageKey = 'quantum_' + moduleKey;
    var data;
    try {
      var raw = localStorage.getItem(storageKey);
      if (raw) data = JSON.parse(raw);
    } catch (err) {
      data = [];
    }
    if (!data) {
      data = (SEED[moduleKey] || []).slice();
      localStorage.setItem(storageKey, JSON.stringify(data));
    } else {
      data = data.map(function (r) {
        var copy = Object.assign({}, r);
        if (!copy.fechaRegistro) copy.fechaRegistro = todayIso();
        var defaults = FIELD_DEFAULTS[moduleKey];
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

  window.QUANTUM = {
    MODULES: MODULES,
    SEED: SEED,
    FIELD_DEFAULTS: FIELD_DEFAULTS,
    todayIso: todayIso,
    loadRecords: loadRecords
  };
})();
