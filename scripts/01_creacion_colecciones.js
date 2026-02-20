// ============================================
// SCRIPT: 01_creacion_colecciones.js
// Descripción: Crea las colecciones del sistema académico
// con validaciones de esquema y limpieza automática previa
// ============================================

// 🧹 Eliminar todas las colecciones existentes antes de recrear (esto por que ya habia creado)
db.getCollectionNames().forEach(function(name) {
  db[name].drop();
});

print("🧹 Colecciones anteriores eliminadas correctamente.");

// ============================================
// 📚 Colección: estudiantes
// ============================================

db.createCollection("estudiantes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo", "nombre", "email", "programa", "semestre_actual", "promedio_acumulado"],
      properties: {
        codigo: {
          bsonType: "string",
          description: "Código único del estudiante - requerido"
        },
        nombre: {
          bsonType: "string",
          description: "Nombre completo del estudiante"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Correo electrónico válido"
        },
        fecha_nacimiento: {
          bsonType: "date",
          description: "Fecha de nacimiento del estudiante"
        },
        programa: {
          bsonType: "object",
          required: ["id", "nombre"],
          properties: {
            id: { bsonType: "objectId" },
            nombre: { bsonType: "string" },
            codigo: { bsonType: "string" }
          }
        },
        semestre_actual: {
          bsonType: "int",
          minimum: 1,
          maximum: 12,
          description: "Semestre actual (1-12)"
        },
        promedio_acumulado: {
         bsonType: ["double", "decimal"],
         minimum: 0.0,
         maximum: 5.0,
         description: "Promedio válido (0.0 a 5.0)"
        },

        estado: {
          enum: ["Activo", "Inactivo", "Graduado", "Retirado"],
          description: "Estado académico del estudiante"
        },
        contacto: {
          bsonType: "object",
          properties: {
            telefono: { bsonType: "string" },
            direccion: { bsonType: "string" },
            ciudad: { bsonType: "string" }
          }
        }
      }
    }
  }
});

// ============================================
// 👨‍🏫 Colección: profesores
// ============================================

db.createCollection("profesores", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "email", "especialidad"],
      properties: {
        nombre: {
          bsonType: "string",
          description: "Nombre completo del profesor"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Correo electrónico válido"
        },
        especialidad: {
          bsonType: "string",
          description: "Área de especialización del profesor"
        },
        materias_asignadas: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              materia_id: { bsonType: "objectId" },
              nombre: { bsonType: "string" },
              periodo: { bsonType: "string" }
            }
          }
        }
      }
    }
  }
});

// ============================================
// 📖 Colección: materias
// ============================================

db.createCollection("materias", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo", "nombre", "creditos"],
      properties: {
        codigo: {
          bsonType: "string",
          description: "Código único de la materia"
        },
        nombre: {
          bsonType: "string",
          description: "Nombre de la materia"
        },
        creditos: {
          bsonType: "int",
          minimum: 1,
          maximum: 6,
          description: "Número de créditos (1-6)"
        },
        prerrequisitos: {
          bsonType: "array",
          items: { bsonType: "string" },
          description: "Listado de códigos de materias prerrequisito"
        },
        programa: {
          bsonType: "object",
          properties: {
            id: { bsonType: "objectId" },
            nombre: { bsonType: "string" }
          }
        }
      }
    }
  }
});

// ============================================
// 🏛️ Colección: programas
// ============================================

db.createCollection("programas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo", "nombre", "creditos_totales"],
      properties: {
        codigo: { bsonType: "string" },
        nombre: { bsonType: "string" },
        creditos_totales: {
          bsonType: "int",
          minimum: 100,
          maximum: 200
        },
        requisitos_graduacion: {
          bsonType: "array",
          items: { bsonType: "string" }
        }
      }
    }
  }
});

// ============================================
// 📝 Colección: inscripciones
// ============================================

db.createCollection("inscripciones", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["estudiante_id", "materia_id", "periodo", "estado"],
      properties: {
        estudiante_id: { bsonType: "objectId" },
        materia_id: { bsonType: "objectId" },
        periodo: { bsonType: "string" },
        fecha_inscripcion: { bsonType: "date" },
        estado: {
          enum: ["Inscrito", "Aprobado", "Reprobado", "Retirado"]
        },
        nota_final: {
          bsonType: "double",
          minimum: 0.0,
          maximum: 5.0
        }
      }
    }
  }
});

// ============================================
// ✅ Confirmación final
// ============================================

print("✅ Colecciones creadas correctamente:");
printjson(db.getCollectionNames());
