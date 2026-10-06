# 🎓 Sistema Académico en MongoDB

Base de datos NoSQL para la gestión académica de una universidad: estudiantes, profesores, materias, programas e inscripciones, con validación de esquemas, operaciones CRUD, transacciones multi-documento y reportes con el Aggregation Framework.

**Proyecto académico** del curso de Bases de Datos NoSQL (IU Digital de Antioquia). Desarrollado sobre MongoDB Atlas 8.0 y verificado con mongosh 2.x en un replica set local.

## ✨ Qué incluye

| Script | Qué hace | Estado |
|---|---|---|
| `01_creacion_colecciones.js` | Crea 5 colecciones con validación `$jsonSchema` (borra las existentes antes) | ✅ |
| `02_insercion_datos.js` | Inserta datos de ejemplo: 5 programas y 20 documentos en cada una de las demás colecciones | ✅ |
| `03_validaciones.js` | Refuerza las reglas de esquema: formato de email, rangos de notas y semestres, estados válidos | ✅ |
| `04_crud.js` | Funciones de creación, consulta, actualización y eliminación | ✅ |
| `05_transacciones.js` | 4 transacciones multi-documento con *rollback* | ✅ |
| `06_agregaciones.js` | 5 reportes con pipelines de agregación y `$lookup` | ✅ |
| `07_changestreams.js` | Define los pipelines de 5 Change Streams (auditoría, riesgo académico, créditos, cupos, notas) | 🚧 En desarrollo: los pipelines están definidos, falta suscribirse con `watch()` |

### Transacciones (`05_transacciones.js`)
- `inscribirEstudianteEnMaterias(estudianteId, materiasIds)`: inscribe en varias materias de forma atómica.
- `registrarCalificacionesYActualizarPromedio(estudianteId, calificaciones)`: registra notas, marca Aprobado/Reprobado y recalcula el promedio.
- `retirarMateria(estudianteId, materiaId)`: marca la inscripción como Retirado.
- `graduarEstudiante(estudianteId)`: gradúa solo si no quedan materias pendientes; si las hay, hace *rollback*.

### Reportes (`06_agregaciones.js`)
- `promedioPorMateria()`
- `estudiantesEnRiesgo()`: promedio acumulado menor a 3.0 y estado Activo.
- `materiasMasReprobadas()`
- `cargaProfesoresPorPeriodo(periodo)`: cursos y créditos asignados por profesor.
- `estadisticasGraduacionPorPrograma()`

## 🗂️ Estructura del proyecto

```
mongodb-academic-system/
├── scripts/                          # 01 → 07, en orden de ejecución
├── documentos/
│   └── Diseño Sistema Academico.pdf  # Diseño del modelo de datos
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

## 🚀 Instalación y uso

### Prerrequisitos
- [MongoDB Shell (mongosh)](https://www.mongodb.com/docs/mongodb-shell/install/) 2.x
- MongoDB en **replica set**, necesario para las transacciones. Sirve un clúster gratuito M0 de MongoDB Atlas (con un usuario de base de datos y tu IP en *Network Access*) o una instancia local (ver abajo).

### 1. Clonar y configurar la conexión
```bash
git clone https://github.com/HannaSalinas/mongodb-academic-system.git
cd mongodb-academic-system
cp config.example.txt config.txt   # edita <tu_usuario>, <tu_contraseña> y <tu-cluster>
source config.txt
```
`config.txt` está en `.gitignore`, así que tus credenciales no se suben al repositorio.

**Opción local con Docker** (en lugar de Atlas):
```bash
docker run -d --name mongo-academico -p 27017:27017 mongo:7 --replSet rs0
mongosh --quiet --eval 'rs.initiate()'
export MONGODB_URI="mongodb://localhost:27017/sistema_academico?directConnection=true"
```
MongoDB 5.0+ requiere un procesador con AVX; en equipos sin AVX usa la imagen `mongo:4.4`.

### 2. Ejecutar los scripts en orden (01 → 07)
```bash
for f in scripts/0*.js; do mongosh "$MONGODB_URI" --quiet --file "$f"; done
```

### 3. Usar las funciones
Los scripts 04, 05 y 06 definen funciones. Para usarlas, cárgalos en una sesión de mongosh:
```javascript
// mongosh "$MONGODB_URI"
load("scripts/06_agregaciones.js")
estudiantesEnRiesgo()
cargaProfesoresPorPeriodo("2024-2")

load("scripts/05_transacciones.js")
const est = db.estudiantes.findOne({ estado: "Activo" })
const materias = db.materias.find().limit(3).toArray().map(m => m._id)
inscribirEstudianteEnMaterias(est._id, materias)
```

## 💡 Decisiones técnicas

- **Documentos con referencias y datos embebidos.** Estudiantes y materias guardan el `id` y el nombre del programa: las consultas frecuentes no necesitan `$lookup`, y los reportes sí lo usan cuando cruzan colecciones.
- **Validación en la base de datos.** `$jsonSchema` impide datos inconsistentes (notas fuera de 0.0–5.0, estados no válidos, emails mal formados) sin importar desde qué cliente se escriba.
- **Transacciones para operaciones que tocan varias colecciones.** Registrar notas y recalcular el promedio se hace todo o nada.
- **Credenciales fuera del repositorio.** La conexión se lee de `config.txt`, que no se versiona.

## 🛠️ Tecnologías

- **MongoDB** (Atlas 8.0; verificado también en 4.4 local) con JSON Schema, transacciones y Aggregation Framework
- **mongosh** 2.x

## 👩‍💻 Autora

**Hanna Jineth Contreras Salinas**
- Estudiante de Ingeniería de Software y Datos
- Email: salinashanna123@gmail.com
- GitHub: [@HannaSalinas](https://github.com/HannaSalinas)
- Portfolio: [hannasalinas.github.io](https://hannasalinas.github.io/)

## 📄 Licencia

[MIT](LICENSE)
