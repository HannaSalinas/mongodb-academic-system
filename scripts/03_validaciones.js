use("sistema_academico");

// ✅ Validación: formato de email, rango de calificaciones, semestres, estados y créditos
db.runCommand({
  collMod: "estudiantes",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo", "nombre", "email", "programa", "semestre_actual", "promedio_acumulado"],
      properties: {
        codigo: {
          bsonType: "string",
          description: "Código único del estudiante"
        },
        nombre: {
          bsonType: "string",
          description: "Nombre completo requerido"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Email institucional válido"
        },
        semestre_actual: {
          bsonType: "int",
          minimum: 1,
          maximum: 12,
          description: "Semestre debe estar entre 1 y 12"
        },
        promedio_acumulado: {
          bsonType: "double",
          minimum: 0.0,
          maximum: 5.0,
          description: "Promedio válido (0.0 a 5.0)"
        },
        estado: {
          enum: ["Activo", "Inactivo", "Graduado", "Retirado"],
          description: "Estado válido del estudiante"
        }
      }
    }
  }
});

db.runCommand({
  collMod: "materias",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo", "nombre", "creditos"],
      properties: {
        codigo: {
          bsonType: "string",
          description: "Código único de la materia"
        },
        creditos: {
          bsonType: "int",
          minimum: 1,
          maximum: 6,
          description: "Número de créditos válidos (1 a 6)"
        }
      }
    }
  }
});

print("✅ Validaciones de esquema aplicadas correctamente a las colecciones.");
