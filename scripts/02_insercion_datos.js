// ============================================
// SCRIPT: 02_insercion_datos.js
// Descripción: Inserta datos realistas en las colecciones
// del sistema académico 
// ============================================

// ============================================
// 1️⃣ Inserción de Programas Académicos
// ============================================

const programas = [
  { codigo: "ISOFT", nombre: "Ingeniería de Software", creditos_totales: 160 },
  { codigo: "ISIST", nombre: "Ingeniería de Sistemas", creditos_totales: 150 },
  { codigo: "IIND", nombre: "Ingeniería Industrial", creditos_totales: 155 },
  { codigo: "ADMON", nombre: "Administración de Empresas", creditos_totales: 140 },
  { codigo: "CONT", nombre: "Contaduría Pública", creditos_totales: 145 }
];

const resProgramas = db.programas.insertMany(programas);
print("✅ Programas insertados correctamente.");

// ============================================
// 2️⃣ Inserción de Materias
// ============================================

const materias = [
  { codigo: "BD101", nombre: "Bases de Datos I", creditos: 4, programa: { id: resProgramas.insertedIds[0], nombre: "Ingeniería de Software" } },
  { codigo: "PR101", nombre: "Programación I", creditos: 3, programa: { id: resProgramas.insertedIds[0], nombre: "Ingeniería de Software" } },
  { codigo: "PR201", nombre: "Programación II", creditos: 4, prerrequisitos: ["PR101"], programa: { id: resProgramas.insertedIds[0], nombre: "Ingeniería de Software" } },
  { codigo: "BD201", nombre: "Bases de Datos II", creditos: 4, prerrequisitos: ["BD101"], programa: { id: resProgramas.insertedIds[0], nombre: "Ingeniería de Software" } },
  { codigo: "IA101", nombre: "Inteligencia Artificial", creditos: 4, prerrequisitos: ["PR201"], programa: { id: resProgramas.insertedIds[1], nombre: "Ingeniería de Sistemas" } },
  { codigo: "AL101", nombre: "Álgebra Lineal", creditos: 3, programa: { id: resProgramas.insertedIds[1], nombre: "Ingeniería de Sistemas" } },
  { codigo: "CA101", nombre: "Cálculo I", creditos: 4, programa: { id: resProgramas.insertedIds[1], nombre: "Ingeniería de Sistemas" } },
  { codigo: "MI101", nombre: "Microeconomía", creditos: 3, programa: { id: resProgramas.insertedIds[3], nombre: "Administración de Empresas" } },
  { codigo: "MA201", nombre: "Macroeconomía", creditos: 3, programa: { id: resProgramas.insertedIds[3], nombre: "Administración de Empresas" } },
  { codigo: "FI101", nombre: "Fundamentos de Finanzas", creditos: 3, programa: { id: resProgramas.insertedIds[3], nombre: "Administración de Empresas" } },
  { codigo: "CO101", nombre: "Contabilidad Básica", creditos: 4, programa: { id: resProgramas.insertedIds[4], nombre: "Contaduría Pública" } },
  { codigo: "AU201", nombre: "Auditoría I", creditos: 3, programa: { id: resProgramas.insertedIds[4], nombre: "Contaduría Pública" } },
  { codigo: "CO201", nombre: "Contabilidad Intermedia", creditos: 4, prerrequisitos: ["CO101"], programa: { id: resProgramas.insertedIds[4], nombre: "Contaduría Pública" } },
  { codigo: "MA101", nombre: "Matemáticas Básicas", creditos: 3, programa: { id: resProgramas.insertedIds[2], nombre: "Ingeniería Industrial" } },
  { codigo: "OP201", nombre: "Investigación de Operaciones", creditos: 4, prerrequisitos: ["MA101"], programa: { id: resProgramas.insertedIds[2], nombre: "Ingeniería Industrial" } },
  { codigo: "ES101", nombre: "Estadística I", creditos: 3, programa: { id: resProgramas.insertedIds[2], nombre: "Ingeniería Industrial" } },
  { codigo: "ES201", nombre: "Estadística II", creditos: 4, prerrequisitos: ["ES101"], programa: { id: resProgramas.insertedIds[2], nombre: "Ingeniería Industrial" } },
  { codigo: "PR301", nombre: "Programación III", creditos: 4, prerrequisitos: ["PR201"], programa: { id: resProgramas.insertedIds[0], nombre: "Ingeniería de Software" } },
  { codigo: "BD301", nombre: "Big Data", creditos: 4, prerrequisitos: ["BD201"], programa: { id: resProgramas.insertedIds[0], nombre: "Ingeniería de Software" } },
  { codigo: "IA201", nombre: "Machine Learning", creditos: 4, prerrequisitos: ["IA101"], programa: { id: resProgramas.insertedIds[1], nombre: "Ingeniería de Sistemas" } }
];

const resMaterias = db.materias.insertMany(materias);
print("✅ Materias insertadas correctamente.");

// ============================================
// 3️⃣ Inserción de Profesores
// ============================================

const profesores = Array.from({ length: 20 }, (_, i) => ({
  nombre: `Profesor ${i + 1}`,
  email: `profesor${i + 1}@universidad.edu.co`,
  especialidad: ["Bases de Datos", "Programación", "Finanzas", "Contabilidad", "Matemáticas"][i % 5],
  materias_asignadas: [
    { materia_id: resMaterias.insertedIds[i % 10], nombre: materias[i % 10].nombre, periodo: "2024-2" }
  ]
}));

const resProfesores = db.profesores.insertMany(profesores);
print("✅ Profesores insertados correctamente.");

// ============================================
// 4️⃣ Inserción de Estudiantes
// ============================================

const estudiantes = Array.from({ length: 20 }, (_, i) => ({
  codigo: `EST${(i + 1).toString().padStart(3, "0")}`,
  nombre: `Estudiante ${i + 1}`,
  email: `estudiante${i + 1}@universidad.edu.co`,
  fecha_nacimiento: new Date(2002, i % 12, (i + 5) % 28),
  programa: {
    id: resProgramas.insertedIds[i % 5],
    nombre: programas[i % 5].nombre,
    codigo: programas[i % 5].codigo
  },
  semestre_actual: (i % 10) + 1,
  promedio_acumulado: parseFloat((Math.random() * 5).toFixed(2)),
  estado: ["Activo", "Inactivo", "Graduado", "Retirado"][i % 4],
  contacto: {
    telefono: `+57 300 123 45${(i + 10).toString().padStart(2, "0")}`,
    direccion: `Calle ${(i + 10)} # ${(i % 50)}-${(i % 20)}`,
    ciudad: "Medellín"
  }
}));

const resEstudiantes = db.estudiantes.insertMany(estudiantes);
print("✅ Estudiantes insertados correctamente.");

// ============================================
// 5️⃣ Inserción de Inscripciones
// ============================================

const inscripciones = Array.from({ length: 20 }, (_, i) => ({
  estudiante_id: resEstudiantes.insertedIds[i],
  materia_id: resMaterias.insertedIds[i],
  periodo: "2024-2",
  fecha_inscripcion: new Date(),
  estado: ["Inscrito", "Aprobado", "Reprobado"][i % 3],
  nota_final: parseFloat((Math.random() * 5).toFixed(2))
}));

db.inscripciones.insertMany(inscripciones);
print("✅ Inscripciones insertadas correctamente.");

// ============================================
// ✅ Confirmación final
// ============================================

print("🎉 Inserción de datos completada correctamente.");
