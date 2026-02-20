// ============================================
// ARCHIVO: 05_transacciones.js
// Descripción: Transacciones y validación de información
// Base de datos: sistema_academico
// ============================================

use("sistema_academico");

const session = db.getMongo().startSession();

// ============================================
// 🧩 1️⃣ Inscripción de estudiante en múltiples materias
// ============================================

function inscribirEstudianteEnMaterias(estudianteId, materiasIds) {
  session.startTransaction();
  try {
    const estudiante = db.estudiantes.findOne({ _id: estudianteId });
    if (!estudiante) throw new Error("Estudiante no encontrado.");

    const inscripciones = materiasIds.map(id => ({
      estudiante_id: estudianteId,
      materia_id: id,
      periodo: "2024-2",
      fecha_inscripcion: new Date(),
      estado: "Inscrito",
      nota_final: null
    }));

    session.getDatabase("sistema_academico").inscripciones.insertMany(inscripciones);

    session.commitTransaction();
    print("✅ Transacción completada: Estudiante inscrito en múltiples materias.");
  } catch (error) {
    print("❌ Error en inscripción múltiple. Rollback ejecutado.");
    print(error);
    session.abortTransaction();
  } finally {
    session.endSession();
  }
}

// ============================================
// 🧩 2️⃣ Registro de calificaciones y actualización del promedio
// ============================================

function registrarCalificacionesYActualizarPromedio(estudianteId, calificaciones) {
  const session2 = db.getMongo().startSession();
  session2.startTransaction();
  try {
    let total = 0;
    let count = 0;

    for (const { materia_id, nota } of calificaciones) {
      session2
        .getDatabase("sistema_academico")
        .inscripciones.updateOne(
          { estudiante_id: estudianteId, materia_id },
          { $set: { nota_final: nota, estado: nota >= 3.0 ? "Aprobado" : "Reprobado" } }
        );
      total += nota;
      count++;
    }

    const nuevoPromedio = parseFloat((total / count).toFixed(2));

    session2
      .getDatabase("sistema_academico")
      .estudiantes.updateOne(
        { _id: estudianteId },
        { $set: { promedio_acumulado: nuevoPromedio } }
      );

    session2.commitTransaction();
    print("✅ Transacción completada: Calificaciones registradas y promedio actualizado.");
  } catch (error) {
    print("❌ Error al registrar calificaciones. Rollback ejecutado.");
    print(error);
    session2.abortTransaction();
  } finally {
    session2.endSession();
  }
}

// ============================================
// 🧩 3️⃣ Retiro de materia con actualización de créditos
// ============================================

function retirarMateria(estudianteId, materiaId) {
  const session3 = db.getMongo().startSession();
  session3.startTransaction();
  try {
    const inscripcion = db.inscripciones.findOne({
      estudiante_id: estudianteId,
      materia_id: materiaId
    });
    if (!inscripcion) throw new Error("Inscripción no encontrada.");

    session3
      .getDatabase("sistema_academico")
      .inscripciones.updateOne(
        { _id: inscripcion._id },
        { $set: { estado: "Retirado" } }
      );

    print(`📘 Materia ${materiaId} retirada del estudiante.`);

    session3.commitTransaction();
    print("✅ Transacción completada: Retiro registrado correctamente.");
  } catch (error) {
    print("❌ Error en retiro de materia. Rollback ejecutado.");
    print(error);
    session3.abortTransaction();
  } finally {
    session3.endSession();
  }
}

// ============================================
// 🧩 4️⃣ Graduación de estudiante
// ============================================

function graduarEstudiante(estudianteId) {
  const session4 = db.getMongo().startSession();
  session4.startTransaction();
  try {
    const estudiante = db.estudiantes.findOne({ _id: estudianteId });
    if (!estudiante) throw new Error("Estudiante no encontrado.");

    // Verificar que haya aprobado todas sus materias
    const materiasPendientes = db.inscripciones
      .find({ estudiante_id: estudianteId, estado: { $ne: "Aprobado" } })
      .toArray();

    if (materiasPendientes.length > 0) {
      throw new Error("El estudiante tiene materias pendientes por aprobar.");
    }

    session4
      .getDatabase("sistema_academico")
      .estudiantes.updateOne(
        { _id: estudianteId },
        { $set: { estado: "Graduado" } }
      );

    print("🎓 Estudiante graduado exitosamente.");
    session4.commitTransaction();
  } catch (error) {
    print("❌ Error al graduar estudiante. Rollback ejecutado.");
    print(error);
    session4.abortTransaction();
  } finally {
    session4.endSession();
  }
}

// ============================================
// 📋 EJEMPLOS DE USO
// ============================================

// const estudianteEjemplo = db.estudiantes.findOne();
// const materiasEjemplo = db.materias.find().limit(3).toArray().map(m => m._id);

// inscribirEstudianteEnMaterias(estudianteEjemplo._id, materiasEjemplo);
// registrarCalificacionesYActualizarPromedio(estudianteEjemplo._id, [
//   { materia_id: materiasEjemplo[0], nota: 4.0 },
//   { materia_id: materiasEjemplo[1], nota: 3.5 },
//   { materia_id: materiasEjemplo[2], nota: 4.2 }
// ]);
// retirarMateria(estudianteEjemplo._id, materiasEjemplo[1]);
// graduarEstudiante(estudianteEjemplo._id);

print("✅ Script de transacciones creado correctamente.");
