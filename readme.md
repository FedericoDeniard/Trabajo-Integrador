# Trabajo Integrador

## Desarrollado por:

- Federico Deniard
- Delfina García

# Dependencias:

- Node.js
- npm
- PostgreSQL

# Cómo ejecutar el proyecto:

1. Clonar el repositorio
2. `npm i`
3. Completar el archivo .env en /backend
   - **DATABASE_URL** (required):
   - **PORT** (required):
   - **JWT_SECRET** (optional):
   - **URL_BASE** (optional): (URL base donde se aloja la app)
4. `cd backend && npm run new:rollup:db` (solo la primera vez, crea un modelo de bases de datos con datos de prueba)
5. `cd .. && npm run dev`

## Respuestas backend:

### Todas las rutas responden con el siguiente formato:

### En caso de éxito, la respuesta contiene:

- **success**: boolean (true)
- **data**: any (el resultado de la operación)
- **message**: string (un mensaje descriptivo de la operación)

### En caso de error, la respuesta contiene:

- **success**: boolean (false)
- **data**: null
- **message**: string (un mensaje descriptivo del error)

### Ejemplo exito:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@gmail.com"
  },
  "message": "Usuario creado exitosamente"
}
```

### Ejemplo error:

```json
{
  "success": false,
  "data": null,
  "message": "Error al crear el usuario"
}
```

## Manejo de errores (middleware):

Todas las rutas deben lanzar errores de tipo HttpError en caso de que algo salga mal, el middleware de manejo de errores captura estos errores y los responde con el formato especificado anteriormente.

Parametros de HttpError:

- **statusCode**: number (el codigo de estado del error)
- **message**: string (el mensaje del error)

En caso de que el error no sea de tipo HttpError, el middleware devuelve por defecto un statusCode de **500** y el mensaje del error

En caso de que el statusCode sea **401**, el middleware redirige al usuario a la ruta `/api/admin/login`

## Login de administrador:

### El login de administrador se realiza a través de la ruta `/api/admin/login`

### En caso de éxito:

- Redirige al usuario a la ruta `/api/admin/products`
- Le devuelve una cookie con el token

### En caso de error:

- Lanza un error de tipo HttpError con statusCode **401**

## Autenticación de administrador (middleware):

Todas las rutas que requieren autenticación de administrador tienen un middleware de autenticación que verifica que el usuario tenga un token _(JWT)_ válido

### En caso de éxito:

- Devuelve un nuevo cookie con el token para extender la sesión
- Continua con la ejecución de la ruta

### En caso de error:

- Lanza un error de tipo HttpError con statusCode **401**
