# 🎓 Sistema Académico - MongoDB

Sistema completo de gestión académica desarrollado con MongoDB, implementando validación de esquemas, operaciones CRUD avanzadas, transacciones y agregaciones complejas.

## 📋 Descripción

Este proyecto implementa un sistema de gestión académica completo utilizando MongoDB como base de datos NoSQL. El sistema maneja estudiantes, profesores, materias, programas académicos e inscripciones con validaciones robustas y operaciones avanzadas.

## ✨ Características Principales

### 🔐 Validación de Esquemas JSON
- Validación automática de datos con JSON Schema
- Tipos de datos estrictos y validaciones personalizadas
- Prevención de datos inconsistentes

### 📊 Operaciones CRUD Completas
- Crear, leer, actualizar y eliminar registros
- Funciones reutilizables y optimizadas
- Manejo de errores y validaciones

### 🔄 Transacciones
- Operaciones atómicas multi-documento
- Garantía de consistencia de datos
- Rollback automático en caso de error

### 📈 Agregaciones Avanzadas
- Pipelines complejos de agregación
- Análisis de datos académicos
- Reportes estadísticos
- Cálculo de promedios y métricas

### 🔔 Change Streams
- Monitoreo de cambios en tiempo real
- Auditoría de modificaciones
- Notificaciones de eventos

## 🗂️ Estructura del Proyecto

```
ProyectoMongoDB/
├── scripts/
│   ├── 01_creacion_colecciones.js    # Creación de colecciones con validación
│   ├── 02_insercion_datos.js         # Datos de ejemplo
│   ├── 03_validaciones.js            # Pruebas de validación
│   ├── 04_crud.js                    # Operaciones CRUD
│   ├── 05_transacciones.js           # Transacciones multi-documento
│   ├── 06_agregaciones.js            # Pipelines de agregación
│   └── 07_changestreams.js           # Monitoreo de cambios
├── documentos/
│   └── Diseño Sistema Academico.pdf  # Documentación del diseño
└── config.example.txt                # Plantilla de conexión (copiar a config.txt)
```

## 📚 Colecciones

### 👨‍🎓 Estudiantes
```javascript
{
  codigo: String,           // Código único
  nombre: String,
  email: String,           // Con validación de formato
  programa: Object,        // Referencia al programa
  semestre_actual: Int,    // 1-12
  promedio_acumulado: Double, // 0.0-5.0
  estado: Enum             // Activo, Inactivo, Graduado, Retirado
}
```

### 👨‍🏫 Profesores
```javascript
{
  nombre: String,
  email: String,
  especialidad: String,
  materias_asignadas: Array
}
```

### 📖 Materias
```javascript
{
  codigo: String,
  nombre: String,
  creditos: Int,           // 1-6
  prerrequisitos: Array,
  programa: Object
}
```

### 🏛️ Programas
```javascript
{
  codigo: String,
  nombre: String,
  creditos_totales: Int,   // 100-200
  requisitos_graduacion: Array
}
```

### 📝 Inscripciones
```javascript
{
  estudiante_id: ObjectId,
  materia_id: ObjectId,
  periodo: String,
  estado: Enum,            // Inscrito, Aprobado, Reprobado, Retirado
  nota_final: Double       // 0.0-5.0
}
```

## 🚀 Instalación y Uso

### Prerrequisitos
- [MongoDB Shell (mongosh)](https://www.mongodb.com/docs/mongodb-shell/install/) 2.x
- Un clúster de MongoDB Atlas (el nivel gratuito M0 es suficiente) o una instancia local de MongoDB 6.0+
- En Atlas: un usuario de base de datos y tu IP agregada en *Network Access*

### Configuración

1. **Clonar el repositorio:**
```bash
git clone https://github.com/HannaSalinas/mongodb-academic-system.git
cd mongodb-academic-system
```

2. **Configurar la conexión:**
Copia la plantilla y reemplaza `<tu_usuario>`, `<tu_contraseña>` y `<tu-cluster>` con los datos de tu clúster. `config.txt` está en `.gitignore`, así que tus credenciales no se suben al repositorio.
```bash
cp config.example.txt config.txt
source config.txt
```

3. **Ejecutar los scripts en orden (01 → 07):**
```bash
mongosh "$MONGODB_URI" --apiVersion 1 --file scripts/01_creacion_colecciones.js  # Crear colecciones
mongosh "$MONGODB_URI" --apiVersion 1 --file scripts/02_insercion_datos.js       # Insertar datos de ejemplo
mongosh "$MONGODB_URI" --apiVersion 1 --file scripts/03_validaciones.js          # Aplicar validaciones de esquema
mongosh "$MONGODB_URI" --apiVersion 1 --file scripts/04_crud.js                  # Operaciones CRUD
mongosh "$MONGODB_URI" --apiVersion 1 --file scripts/05_transacciones.js         # Transacciones
mongosh "$MONGODB_URI" --apiVersion 1 --file scripts/06_agregaciones.js          # Reportes y agregaciones
mongosh "$MONGODB_URI" --apiVersion 1 --file scripts/07_changestreams.js         # Change Streams
```

Para una instancia local, usa `MONGODB_URI="mongodb://localhost:27017/sistema_academico"`. Los resultados se pueden revisar con MongoDB Compass.

## 💡 Ejemplos de Uso

### Crear un estudiante:
```javascript
db.estudiantes.insertOne({
  codigo: "EST001",
  nombre: "María García",
  email: "maria.garcia@universidad.edu.co",
  programa: { 
    id: ObjectId(), 
    nombre: "Ingeniería de Software" 
  },
  semestre_actual: 5,
  promedio_acumulado: 4.2,
  estado: "Activo"
});
```

### Buscar estudiantes en riesgo académico:
```javascript
db.estudiantes.find({
  promedio_acumulado: { $lt: 3.0 },
  estado: "Activo"
}).sort({ promedio_acumulado: 1 });
```

### Calcular promedio por materia (Agregación):
```javascript
db.matriculas.aggregate([
  { $unwind: "$calificaciones" },
  { 
    $group: {
      _id: "$calificaciones.materia_id",
      promedio: { $avg: "$calificaciones.nota" },
      total_estudiantes: { $sum: 1 }
    }
  },
  { $sort: { promedio: -1 } }
]);
```

## 🎯 Funcionalidades Avanzadas

### Transacciones
El sistema implementa transacciones para operaciones críticas como:
- Inscripción de estudiantes (actualiza múltiples colecciones)
- Cambio de estado académico
- Asignación de materias a profesores

### Agregaciones
Incluye pipelines para:
- Reporte de estudiantes en riesgo
- Promedio de calificaciones por materia
- Materias más reprobadas
- Estadísticas por programa
- Análisis de rendimiento académico

### Change Streams
Monitoreo en tiempo real de:
- Nuevas inscripciones
- Cambios en calificaciones
- Actualizaciones de estado

## 📖 Documentación

- `documentos/Diseño Sistema Academico.pdf`: diseño del modelo de datos del sistema.
- La guía de instalación y el manual de uso están en la sección **Instalación y Uso** de este README.

## 🛠️ Tecnologías Utilizadas

- **MongoDB 6.0+**: Base de datos NoSQL
- **MongoDB Shell (mongosh)**: Interfaz de línea de comandos
- **JSON Schema**: Validación de datos
- **Aggregation Framework**: Análisis de datos
- **Change Streams**: Monitoreo en tiempo real

## 👩‍💻 Autora

**Hanna Jineth Contreras Salinas**
- Estudiante de Ingeniería de Software y Datos
- Email: salinashanna123@gmail.com
- GitHub: [@HannaSalinas](https://github.com/HannaSalinas)
- Portfolio: [hannasalinas.github.io](https://hannasalinas.github.io/)

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos.

## 🙏 Agradecimientos

Proyecto académico desarrollado como parte del curso de Bases de Datos NoSQL.

---

**Desarrollado con ❤️ y MongoDB**