// ============================================
// 06_agregaciones.js
// Funciones de Agregación y Reportes
// ============================================

// ============================================
// 1️⃣ Promedio de calificaciones por materia
// ============================================
function promedioPorMateria() {
  return db.inscripciones.aggregate([
    { $match: { nota_final: { $ne: null } } },
    {
      $group: {
        _id: "$materia_id",
        promedio_materia: { $avg: "$nota_final" },
        cantidad_estudiantes: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "materias",
        localField: "_id",
        foreignField: "_id",
        as: "materia"
      }
    },
    { $unwind: "$materia" },
    {
      $project: {
        _id: 0,
        nombre_materia: "$materia.nombre",
        promedio_materia: 1,
        cantidad_estudiantes: 1
      }
    },
    { $sort: { promedio_materia: -1 } }
  ]).toArray();
}

// ============================================
// 2️⃣ Estudiantes en riesgo académico
// ============================================
function estudiantesEnRiesgo() {
  return db.estudiantes.aggregate([
    { $match: { promedio_acumulado: { $lt: 3.0 }, estado: "Activo" } },
    {
      $project: {
        codigo: 1,
        nombre: 1,
        email: 1,
        promedio_acumulado: 1,
        semestre_actual: 1,
        nivel_riesgo: {
          $cond: {
            if: { $lt: ["$promedio_acumulado", 2.5] },
            then: "Alto",
            else: "Medio"
          }
        }
      }
    },
    { $sort: { promedio_acumulado: 1 } }
  ]).toArray();
}

// ============================================
// 3️⃣ Materias más reprobadas
// ============================================
function materiasMasReprobadas() {
  return db.inscripciones.aggregate([
    { $match: { estado: "Reprobado" } },
    {
      $group: {
        _id: "$materia_id",
        total_reprobados: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "materias",
        localField: "_id",
        foreignField: "_id",
        as: "materia"
      }
    },
    { $unwind: "$materia" },
    {
      $project: {
        _id: 0,
        nombre_materia: "$materia.nombre",
        total_reprobados: 1
      }
    },
    { $sort: { total_reprobados: -1 } }
  ]).toArray();
}

// ============================================
// 4️⃣ Carga académica de profesores por período
// ============================================
function cargaProfesoresPorPeriodo(periodo) {
  return db.profesores.aggregate([
    { $unwind: "$materias_asignadas" },
    { $match: { "materias_asignadas.periodo": periodo } },
    {
      $lookup: {
        from: "materias",
        localField: "materias_asignadas.materia_id",
        foreignField: "_id",
        as: "materia"
      }
    },
    { $unwind: "$materia" },
    {
      $group: {
        _id: "$_id",
        nombre_profesor: { $first: "$nombre" },
        total_cursos: { $sum: 1 },
        total_creditos: { $sum: "$materia.creditos" }
      }
    },
    {
      $project: {
        _id: 0,
        nombre_profesor: 1,
        total_cursos: 1,
        total_creditos: 1
      }
    },
    { $sort: { total_cursos: -1 } }
  ]).toArray();
}

// ============================================
// 5️⃣ Estadísticas de graduación por programa
// ============================================
function estadisticasGraduacionPorPrograma() {
  return db.estudiantes.aggregate([
    {
      $group: {
        _id: "$programa.id",
        total_estudiantes: { $sum: 1 },
        graduados: {
          $sum: { $cond: [{ $eq: ["$estado", "Graduado"] }, 1, 0] }
        }
      }
    },
    {
      $lookup: {
        from: "programas",
        localField: "_id",
        foreignField: "_id",
        as: "programa"
      }
    },
    { $unwind: "$programa" },
    {
      $project: {
        _id: 0,
        programa: "$programa.nombre",
        total_estudiantes: 1,
        graduados: 1,
        porcentaje_graduacion: {
          $multiply: [
            { $divide: ["$graduados", "$total_estudiantes"] },
            100
          ]
        }
      }
    },
    { $sort: { porcentaje_graduacion: -1 } }
  ]).toArray();
}

print("✅ Funciones de agregación cargadas correctamente.");
