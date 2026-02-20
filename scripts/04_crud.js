// ============================================
// ARCHIVO: 04_crud.js
// Descripción: Funciones CRUD para las colecciones principales
// Base de datos: sistema_academico
// ============================================

use("sistema_academico");

// ============================================
// CREATE
// ============================================

// ➕ Crear un nuevo estudiante
function crearEstudiante(estudiante) {
  return db.estudiantes.insertOne(estudiante);
}

// Ejemplo de inserción de prueba
// crearEstudiante({
//   codigo: "EST099",
//   nombre: "Juan Camilo Torres",
//   email: "juan.torres@universidad.edu.co",
//   semestre_actual: 3,
//   promedio_acumulado: 3.8,
//   estado: "Activo",
//   programa: { id: ObjectId(), nombre: "Ingeniería de Software" }
// });

// ============================================
// READ
// ============================================

// 🔍 Buscar estudiante por código
function buscarEstudiante(codigo) {
  return db.estudiantes.findOne({ codigo: codigo });
}

// 🔍 Listar todos los profesores
function listarProfesores() {
  return db.profesores.find().toArray();
}

// 🔍 Consultar materias por programa
function materiasPorPrograma(nombrePrograma) {
  return db.materias.find({ "programa.nombre": nombrePrograma }).toArray();
}

// ============================================
// UPDATE
// ============================================

// ✏️ Actualizar promedio de un estudiante
function actualizarPromedio(codigo, nuevoPromedio) {
  return db.estudiantes.updateOne(
    { codigo: codigo },
    { $set: { promedio_acumulado: nuevoPromedio } }
  );
}

// 🏛️ Cambiar estado del estudiante
function actualizarEstadoEstudiante(codigo, nuevoEstado) {
  return db.estudiantes.updateOne(
    { codigo: codigo },
    { $set: { estado: nuevoEstado } }
  );
}

// ============================================
// DELETE
// ============================================

// ❌ Eliminar estudiante por código
function eliminarEstudiante(codigo) {
  return db.estudiantes.deleteOne({ codigo: codigo });
}

// ❌ Eliminar materia
function eliminarMateria(codigoMateria) {
  return db.materias.deleteOne({ codigo: codigoMateria });
}

// ============================================
// EJEMPLOS DE USO
// ============================================

// print("Insertar estudiante de ejemplo:");
// printjson(crearEstudiante({
//   codigo: "EST200",
//   nombre: "Laura Valencia",
//   email: "laura.valencia@universidad.edu.co",
//   semestre_actual: 2,
//   promedio_acumulado: 4.1,
//   estado: "Activo",
//   programa: { id: ObjectId(), nombre: "Ingeniería de Software" }
// }));

// print("Buscar estudiante:");
// printjson(buscarEstudiante("EST200"));

// print("Actualizar promedio:");
// printjson(actualizarPromedio("EST200", 4.5));

// print("Eliminar estudiante:");
// printjson(eliminarEstudiante("EST200"));

print("✅ Funciones CRUD creadas y documentadas correctamente.");
