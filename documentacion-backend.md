# Documentación API - Bounded Context: Organization

## Resumen

El contexto **Organization** gestiona las entidades relacionadas con la estructura organizacional del sistema Kiniot:

- **Clínicas** (`Clinic`): Establecimientos de salud/fisioterapia
- **Admins de Clínica** (`ClinicAdmin`): Administradores de clínicas
- **Fisioterapeutas** (`Physiotherapist`): Profesionales de fisioterapia
- **Pacientes** (`Patient`): Individuos que reciben tratamiento

---

## Base URL

```
/api/v1
```

---

## Headers Requeridos

Todas las peticiones (excepto las públicas) requieren:

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
```

---

## 1. Clinics

### `POST /api/v1/clinics`

Registra una nueva clínica en el sistema.

#### Roles Autorizados
- Cualquier usuario autenticado

#### Request Body

```json
{
  "legalName": "string (requerido, max 200 caracteres)",
  "commercialName": "string (requerido, max 150 caracteres)",
  "ruc": "string (requerido, exactamente 11 dígitos)",
  "email": "string (requerido, formato email válido)",
  "countryCode": "string (requerido, formato E.164 ej: +51)",
  "phoneNumber": "string (requerido, formato E.164 ej: 987654321)"
}
```

#### Validaciones

| Campo | Reglas |
|-------|--------|
| `legalName` | Requerido, no vacío, max 200 caracteres |
| `commercialName` | Requerido, no vacío, max 150 caracteres |
| `ruc` | Requerido, exactamente 11 dígitos numéricos, único en el sistema |
| `email` | Requerido, formato email válido, único |
| `countryCode` | Requerido, formato E.164 (ej: `+51`, `+1`) |
| `phoneNumber` | Requerido, formato E.164 (8-15 dígitos sin el country code) |

#### Response (201 Created)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "legalName": "Centro de Fisioterapia San Marcos S.A.C.",
  "commercialName": "Kiniot San Marcos",
  "ruc": "20487654321",
  "email": "contacto@kiniot-sanmarcos.pe",
  "countryCode": "+51",
  "phoneNumber": "987654321",
  "createdAt": "2026-05-13T10:30:00Z",
  "updatedAt": "2026-05-13T10:30:00Z"
}
```

#### Códigos de Error

| HTTP Status | Excepción | Descripción |
|-------------|-----------|-------------|
| 409 | `ClinicAlreadyRegisteredException` | Ya existe una clínica con ese RUC |
| 400 | `ValidationException` | Datos inválidos según las reglas |

---

## 2. Clinic Admins

### `POST /api/v1/clinic-admins`

Registra un nuevo administrador de clínica.

#### Roles Autorizados
- Cualquier usuario autenticado

#### Request Body

```json
{
  "firstName": "string (requerido, max 100 caracteres)",
  "lastName": "string (requerido, max 100 caracteres)",
  "dni": "string (requerido, exactamente 8 dígitos)",
  "birthDate": "string (requerido, formato YYYY-MM-DD)",
  "gender": "string (requerido, MALE | FEMALE | OTHER)",
  "countryCode": "string (requerido, formato E.164)",
  "phoneNumber": "string (requerido, formato E.164)"
}
```

#### Validaciones

| Campo | Reglas |
|-------|--------|
| `firstName` | Requerido, no vacío, max 100 caracteres |
| `lastName` | Requerido, no vacío, max 100 caracteres |
| `dni` | Requerido, exactamente 8 dígitos numéricos (formato DNI peruano) |
| `birthDate` | Requerido, formato YYYY-MM-DD, no puede ser futura, debe ser 18+ años |
| `gender` | Requerido, uno de: `MALE`, `FEMALE`, `OTHER` |
| `countryCode` | Requerido, formato E.164 |
| `phoneNumber` | Requerido, formato E.164 |

#### Response (201 Created)

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "firstName": "María",
  "lastName": "Gonzales",
  "dni": "76543210",
  "birthDate": "1985-03-15",
  "gender": "FEMALE",
  "email": "maria.gonzales@gmail.com",
  "countryCode": "+51",
  "phoneNumber": "987654322",
  "clinicId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Notas
- El email se genera o asigna desde el contexto IAM
- El `clinicId` se determina desde el contexto del usuario autenticado

---

## 3. Physiotherapists

### `POST /api/v1/physiotherapists`

Registra un nuevo fisioterapeuta en la clínica del usuario autenticado.

#### Roles Autorizados
- Cualquier usuario autenticado

#### Request Body

```json
{
  "fullName": "string (requerido, no vacío)",
  "specialty": "string (requerido, enum)",
  "email": "string (requerido, formato email válido)",
  "countryCode": "string (requerido, formato E.164)",
  "phoneNumber": "string (requerido, formato E.164)",
  "licenseNumber": "string (requerido, formato específico)",
  "professionalSummary": "string (opcional, max 1000 caracteres)",
  "photoUrl": "string (opcional, debe ser URL HTTP(S), max 500 caracteres)",
  "yearsOfExperience": "integer (requerido, >= 0)"
}
```

#### Enum: Specialty

| Valor | Descripción |
|-------|-------------|
| `TRAUMATOLOGICAL` | Fisioterapia traumatológica |
| `NEUROLOGICAL` | Fisioterapia neurológica |
| `SPORTS` | Fisioterapia deportiva |
| `GENERAL` | Fisioterapia general |

#### Validaciones

| Campo | Reglas |
|-------|--------|
| `fullName` | Requerido, no vacío |
| `specialty` | Requerido, uno de: `TRAUMATOLOGICAL`, `NEUROLOGICAL`, `SPORTS`, `GENERAL` |
| `email` | Requerido, formato email válido, único por clínica |
| `countryCode` | Requerido, formato E.164 |
| `phoneNumber` | Requerido, formato E.164 |
| `licenseNumber` | Requerido, formato: 4-8 dígitos + 2-4 letras (ej: `12345CPT`, `6789CMP`) |
| `professionalSummary` | Opcional, max 1000 caracteres |
| `photoUrl` | Opcional, si se provee debe ser URL válida HTTP(S), max 500 caracteres |
| `yearsOfExperience` | Requerido, >= 0 |

#### Response (201 Created)

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "userId": "880e8400-e29b-41d4-a716-446655440003",
  "clinicId": "550e8400-e29b-41d4-a716-446655440000",
  "fullName": "Dr. Carlos Mendoza",
  "specialty": "SPORTS",
  "email": "carlos.mendoza@kiniot-sanmarcos.pe",
  "countryCode": "+51",
  "phoneNumber": "987654323",
  "licenseNumber": "54321CPT",
  "professionalSummary": "Especialista en fisioterapia deportiva con 10 años de experiencia en atletas profesionales.",
  "photoUrl": "https://kiniot.pe/photos/carlos-mendoza.jpg",
  "yearsOfExperience": 10,
  "hireDate": "2026-05-13",
  "status": "INACTIVE"
}
```

#### Enum: Status

| Valor | Descripción |
|-------|-------------|
| `INACTIVE` | Nuevo registro, pendiente de activación |
| `ACTIVE` | Activo y atendiendo |
| `SUSPENDED` | Suspendido |

#### Códigos de Error

| HTTP Status | Excepción | Descripción |
|-------------|-----------|-------------|
| 409 | `PhysiotherapistAlreadyRegisteredException` | Email o license ya existen en esta clínica |

---

### `GET /api/v1/physiotherapists`

Obtiene todos los fisioterapeutas de la clínica del usuario autenticado.

#### Roles Autorizados
- Cualquier usuario autenticado

#### Response (200 OK)

```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "userId": "880e8400-e29b-41d4-a716-446655440003",
    "clinicId": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "Dr. Carlos Mendoza",
    "specialty": "SPORTS",
    "email": "carlos.mendoza@kiniot-sanmarcos.pe",
    "countryCode": "+51",
    "phoneNumber": "987654323",
    "licenseNumber": "54321CPT",
    "professionalSummary": "Especialista en fisioterapia deportiva...",
    "photoUrl": "https://kiniot.pe/photos/carlos-mendoza.jpg",
    "yearsOfExperience": 10,
    "hireDate": "2026-05-13",
    "status": "ACTIVE"
  }
]
```

---

### `GET /api/v1/physiotherapists/{id}`

Obtiene un fisioterapeuta específico por su ID.

#### Roles Autorizados
- Cualquier usuario autenticado

#### Path Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | UUID | ID del fisioterapeuta |

#### Response (200 OK)

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "userId": "880e8400-e29b-41d4-a716-446655440003",
  "clinicId": "550e8400-e29b-41d4-a716-446655440000",
  "fullName": "Dr. Carlos Mendoza",
  "specialty": "SPORTS",
  "email": "carlos.mendoza@kiniot-sanmarcos.pe",
  "countryCode": "+51",
  "phoneNumber": "987654323",
  "licenseNumber": "54321CPT",
  "professionalSummary": "Especialista en fisioterapia deportiva...",
  "photoUrl": "https://kiniot.pe/photos/carlos-mendoza.jpg",
  "yearsOfExperience": 10,
  "hireDate": "2026-05-13",
  "status": "ACTIVE"
}
```

---

## 4. Patients

### `POST /api/v1/patients`

Registra un nuevo paciente. Usado por **Clinic Admins**.

#### Roles Autorizados
- `ROLE_CLINIC_ADMIN`

#### Request Body

```json
{
  "firstName": "string (requerido, max 100 caracteres)",
  "lastName": "string (requerido, max 100 caracteres)",
  "dni": "string (requerido, exactamente 8 dígitos)",
  "birthDate": "string (requerido, formato YYYY-MM-DD)",
  "gender": "string (requerido, MALE | FEMALE | OTHER)",
  "email": "string (requerido, formato email válido)",
  "countryCode": "string (requerido, formato E.164)",
  "phoneNumber": "string (requerido, formato E.164)",
  "medicalCondition": "string (opcional, max 500 caracteres)",
  "assignedPhysiotherapistId": "UUID (opcional, debe ser de la misma clínica)"
}
```

#### Validaciones

| Campo | Reglas |
|-------|--------|
| `firstName` | Requerido, no vacío, max 100 caracteres |
| `lastName` | Requerido, no vacío, max 100 caracteres |
| `dni` | Requerido, exactamente 8 dígitos numéricos |
| `birthDate` | Requerido, formato YYYY-MM-DD, no futura, 18+ años |
| `gender` | Requerido, uno de: `MALE`, `FEMALE`, `OTHER` |
| `email` | Requerido, formato email válido |
| `countryCode` | Requerido, formato E.164 |
| `phoneNumber` | Requerido, formato E.164 |
| `medicalCondition` | Opcional, max 500 caracteres |
| `assignedPhysiotherapistId` | Opcional, UUID válido, el fisioterapeuta debe pertenecer a la misma clínica |

#### Response (201 Created)

```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "firstName": "Juan",
  "lastName": "Pérez García",
  "dni": "12345678",
  "birthDate": "1990-08-22",
  "gender": "MALE",
  "email": "juan.perez@gmail.com",
  "countryCode": "+51",
  "phoneNumber": "987654324",
  "medicalCondition": "Lesión en rodilla derecha",
  "assignedPhysiotherapistId": "770e8400-e29b-41d4-a716-446655440002",
  "treatmentPlanId": null,
  "status": "IN_TREATMENT",
  "clinicId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Enum: Status

| Valor | Descripción |
|-------|-------------|
| `UNASSIGNED` | Paciente sin fisioterapeuta asignado |
| `IN_TREATMENT` | En tratamiento activo |
| `COMPLETED` | Tratamiento completado |
| `DISCHARGED` | Dado de alta |
| `INACTIVE` | Inactivo |

---

### `POST /api/v1/patients/by-physiotherapist`

Registra un nuevo paciente. Usado por **Physiotherapists**.

#### Roles Autorizados
- `ROLE_PHYSIOTHERAPIST`

#### Request Body

```json
{
  "firstName": "string (requerido, max 100 caracteres)",
  "lastName": "string (requerido, max 100 caracteres)",
  "dni": "string (requerido, exactamente 8 dígitos)",
  "birthDate": "string (requerido, formato YYYY-MM-DD)",
  "gender": "string (requerido, MALE | FEMALE | OTHER)",
  "email": "string (requerido, formato email válido)",
  "countryCode": "string (requerido, formato E.164)",
  "phoneNumber": "string (requerido, formato E.164)",
  "medicalCondition": "string (opcional, max 500 caracteres)"
}
```

**Diferencia con POST /patients:** No incluye `assignedPhysiotherapistId` ya que se asigna automáticamente al fisioterapeuta que lo registra.

#### Validaciones

Iguales que `POST /api/v1/patients`, excepto:
- `assignedPhysiotherapistId` no está disponible (se usa el contexto del fisioterapeuta autenticado)

#### Response (201 Created)

```json
{
  "id": "990e8400-e29b-41d4-a716-446655440005",
  "firstName": "Ana",
  "lastName": "López Torres",
  "dni": "87654321",
  "birthDate": "1988-12-05",
  "gender": "FEMALE",
  "email": "ana.lopez@gmail.com",
  "countryCode": "+51",
  "phoneNumber": "987654325",
  "medicalCondition": "Dolor lumbar crónico",
  "assignedPhysiotherapistId": "770e8400-e29b-41d4-a716-446655440002",
  "treatmentPlanId": null,
  "status": "IN_TREATMENT",
  "clinicId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### `GET /api/v1/patients`

Obtiene todos los pacientes de la clínica del admin autenticado.

#### Roles Autorizados
- `ROLE_CLINIC_ADMIN`

#### Response (200 OK)

```json
[
  {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "firstName": "Juan",
    "lastName": "Pérez García",
    "dni": "12345678",
    "birthDate": "1990-08-22",
    "gender": "MALE",
    "email": "juan.perez@gmail.com",
    "countryCode": "+51",
    "phoneNumber": "987654324",
    "medicalCondition": "Lesión en rodilla derecha",
    "assignedPhysiotherapistId": "770e8400-e29b-41d4-a716-446655440002",
    "treatmentPlanId": "aa0e8400-e29b-41d4-a716-446655440006",
    "status": "IN_TREATMENT",
    "clinicId": "550e8400-e29b-41d4-a716-446655440000"
  }
]
```

---

### `GET /api/v1/patients/my`

Obtiene los pacientes asignados al fisioterapeuta autenticado.

#### Roles Autorizados
- `ROLE_PHYSIOTHERAPIST`

#### Response (200 OK)

```json
[
  {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "firstName": "Juan",
    "lastName": "Pérez García",
    "dni": "12345678",
    "birthDate": "1990-08-22",
    "gender": "MALE",
    "email": "juan.perez@gmail.com",
    "countryCode": "+51",
    "phoneNumber": "987654324",
    "medicalCondition": "Lesión en rodilla derecha",
    "assignedPhysiotherapistId": "770e8400-e29b-41d4-a716-446655440002",
    "treatmentPlanId": "aa0e8400-e29b-41d4-a716-446655440006",
    "status": "IN_TREATMENT",
    "clinicId": "550e8400-e29b-41d4-a716-446655440000"
  }
]
```

---

### `GET /api/v1/patients/{id}`

Obtiene un paciente específico por su ID.

#### Roles Autorizados
- Cualquier usuario autenticado (limitado a su clínica)

#### Path Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | UUID | ID del paciente |

#### Response (200 OK)

```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "firstName": "Juan",
  "lastName": "Pérez García",
  "dni": "12345678",
  "birthDate": "1990-08-22",
  "gender": "MALE",
  "email": "juan.perez@gmail.com",
  "countryCode": "+51",
  "phoneNumber": "987654324",
  "medicalCondition": "Lesión en rodilla derecha",
  "assignedPhysiotherapistId": "770e8400-e29b-41d4-a716-446655440002",
  "treatmentPlanId": "aa0e8400-e29b-41d4-a716-446655440006",
  "status": "IN_TREATMENT",
  "clinicId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### `GET /api/v1/patients/by-clinic/{clinicId}`

Obtiene todos los pacientes de una clínica específica.

#### Roles Autorizados
- Cualquier usuario autenticado

#### Path Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `clinicId` | UUID | ID de la clínica |

#### Response (200 OK)

```json
[
  {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "firstName": "Juan",
    "lastName": "Pérez García",
    ...
  }
]
```

---

### `GET /api/v1/patients/by-physiotherapist/{physiotherapistId}`

Obtiene todos los pacientes asignados a un fisioterapeuta específico.

#### Roles Autorizados
- Cualquier usuario autenticado

#### Path Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `physiotherapistId` | UUID | ID del fisioterapeuta |

#### Response (200 OK)

```json
[
  {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "firstName": "Juan",
    "lastName": "Pérez García",
    ...
  }
]
```

---

### `PUT /api/v1/patients/{id}/assign`

Asigna un paciente a un fisioterapeuta.

#### Roles Autorizados
- `ROLE_CLINIC_ADMIN`

#### Path Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | UUID | ID del paciente |

#### Request Body

```json
{
  "physiotherapistId": "UUID (requerido)"
}
```

#### Response (204 No Content)

Sin body.

#### Reglas de Negocio

1. El fisioterapeuta debe pertenecer a la **misma clínica** que el paciente
2. El paciente debe estar en estado `UNASSIGNED`
3. Después de la asignación, el paciente pasa a estado `IN_TREATMENT`

#### Códigos de Error

| HTTP Status | Excepción | Descripción |
|-------------|-----------|-------------|
| 400 | `CrossClinicAssignmentException` | Fisioterapeuta de otra clínica |
| 400 | `PatientNotInAssignableStateException` | Paciente no está en estado UNASSIGNED |

---

### `PUT /api/v1/patients/{id}/discharge`

Da de alta (discharge) a un paciente.

#### Roles Autorizados
- `ROLE_PHYSIOTHERAPIST` (solo sus propios pacientes)

#### Path Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | UUID | ID del paciente |

#### Response (204 No Content)

Sin body.

#### Reglas de Negocio

1. Solo el fisioterapeuta **asignado** al paciente puede darlo de alta
2. El paciente debe estar en estado `COMPLETED` o `INACTIVE`
3. Después del alta, el paciente pasa a estado `DISCHARGED`

#### Códigos de Error

| HTTP Status | Excepción | Descripción |
|-------------|-----------|-------------|
| 400 | `UnauthorizedPatientAccessException` | No es el fisioterapeuta asignado |
| 400 | `PatientNotInDischargeableStateException` | Paciente no está en estado COMPLETED o INACTIVE |

---

## Resumen de Endpoints

| Método | Path | Descripción | Roles |
|--------|------|-------------|-------|
| POST | `/api/v1/clinics` | Registrar clínica | Authenticated |
| POST | `/api/v1/clinic-admins` | Registrar admin de clínica | Authenticated |
| POST | `/api/v1/physiotherapists` | Registrar fisioterapeuta | Authenticated |
| GET | `/api/v1/physiotherapists` | Listar fisioterapeutas | Authenticated |
| GET | `/api/v1/physiotherapists/{id}` | Ver fisioterapeuta | Authenticated |
| POST | `/api/v1/patients` | Registrar paciente (admin) | ROLE_CLINIC_ADMIN |
| POST | `/api/v1/patients/by-physiotherapist` | Registrar paciente (fisio) | ROLE_PHYSIOTHERAPIST |
| GET | `/api/v1/patients` | Listar pacientes (admin) | ROLE_CLINIC_ADMIN |
| GET | `/api/v1/patients/my` | Mis pacientes (fisio) | ROLE_PHYSIOTHERAPIST |
| GET | `/api/v1/patients/{id}` | Ver paciente | Authenticated |
| GET | `/api/v1/patients/by-clinic/{clinicId}` | Pacientes por clínica | Authenticated |
| GET | `/api/v1/patients/by-physiotherapist/{physiotherapistId}` | Pacientes por fisio | Authenticated |
| PUT | `/api/v1/patients/{id}/assign` | Asignar paciente | ROLE_CLINIC_ADMIN |
| PUT | `/api/v1/patients/{id}/discharge` | Alta de paciente | ROLE_PHYSIOTHERAPIST |

---

## Formatos de Validación

### Formato E.164 (Teléfonos)

```
+[country code][number]
Ejemplos:
+51987654321  (Perú)
+34612345678  (España)
+14155552671  (USA)
```

- El `+` es requerido
- El `countryCode` incluye el código de país (ej: `51`, `34`, `1`)
- El `phoneNumber` son los dígitos locales (8-15 dígitos)

### Formato DNI (Perú)

```
8 dígitos numéricos
Ejemplos: 12345678, 76543210
```

### Formato RUC (Perú)

```
11 dígitos numéricos
Ejemplos: 20487654321, 20612345678
```

### Formato License Number

```
4-8 dígitos + 2-4 letras
Ejemplos: 12345CPT, 6789CMP, 1234567890ABC
```

### Formato Birth Date

```
YYYY-MM-DD
Ejemplo: 1990-08-22
```

**Regla de edad:** El paciente debe tener mínimo 18 años.

---

## Enums Comunes

### Gender

| Valor | Descripción |
|-------|-------------|
| `MALE` | Masculino |
| `FEMALE` | Femenino |
| `OTHER` | Otro |

### Specialty

| Valor | Descripción |
|-------|-------------|
| `TRAUMATOLOGICAL` | Traumatológica |
| `NEUROLOGICAL` | Neurológica |
| `SPORTS` | Deportiva |
| `GENERAL` | General |

### PatientStatus

| Valor | Descripción |
|-------|-------------|
| `UNASSIGNED` | Sin asignar |
| `IN_TREATMENT` | En tratamiento |
| `COMPLETED` | Completado |
| `DISCHARGED` | Dado de alta |
| `INACTIVE` | Inactivo |

### PhysiotherapistStatus

| Valor | Descripción |
|-------|-------------|
| `INACTIVE` | Inactivo |
| `ACTIVE` | Activo |
| `SUSPENDED` | Suspendido |

---

## Eventos de Dominio

El frontend puede subscribirse a estos eventos (via polling o WebSocket futuro):

| Evento | Trigger |
|--------|---------|
| `ClinicRegisteredEvent` | Nueva clínica registrada |
| `PatientProfileRegisteredEvent` | Nuevo paciente registrado |
| `PatientAssignedToPhysiotherapistEvent` | Paciente asignado a fisioterapeuta |
| `PhysiotherapistProfileRegisteredEvent` | Nuevo fisioterapeuta registrado |
| `PhysiotherapistProfileActivatedEvent` | Fisioterapeuta activado |

---

## Códigos de Error HTTP

| HTTP Status | Escenario |
|-------------|-----------|
| 200 | OK |
| 201 | Creado exitosamente |
| 204 | Sin contenido (operación exitosa sin response body) |
| 400 | Solicitud inválida (validación fallida, regla de negocio violada) |
| 401 | No autenticado |
| 403 | No autorizado (rol incorrecto) |
| 404 | Recurso no encontrado |
| 409 | Conflicto (recurso duplicado) |
| 500 | Error interno del servidor |

---

## Reglas de Negocio Clave

### Asignación Cross-Clinic

**PROHIBIDO.** Un paciente solo puede ser asignado a un fisioterapeuta de la **misma clínica**. Intentar asignar un paciente a un fisioterapeuta de otra clínica resultará en `CrossClinicAssignmentException` (HTTP 400).

### Un Usuario = Un Patient Profile

Cada usuario en el sistema solo puede tener **un** patient profile. Intentar registrar un segundo paciente para el mismo usuario resultará en `PatientAlreadyRegisteredException` (HTTP 409).

### Alta de Pacientes

Solo el fisioterapeuta **asignado** puede dar de alta a un paciente. Intentar dar de alta un paciente asignado a otro fisioterapeuta resultará en `UnauthorizedPatientAccessException` (HTTP 400).

### Estados de Alta

Para dar de alta (`discharge`) un paciente, este debe estar en estado `COMPLETED` o `INACTIVE`. Pacientes en `IN_TREATMENT` o `UNASSIGNED` no pueden ser dados de alta directamente.

---

## Notas para Frontend

### Autenticación

1. Obtener JWT token via `/api/v1/authentication/**`
2. Incluir token en header `Authorization: Bearer <token>`
3. El token expira según configuración del servidor

### Roles del Usuario

El JWT contiene los roles del usuario. Roles relevantes para Organization:
- `ROLE_CLINIC_ADMIN`: Admin de clínica
- `ROLE_PHYSIOTHERAPIST`: Fisioterapeuta

### Contexto de Clínica

La clínica del usuario se determina desde el token JWT. No es necesario enviarla en requests.

### Manejo de Fechas

- Todas las fechas se envían en formato ISO 8601 (UTC)
- BirthDate se envía como `YYYY-MM-DD` en requests
- Response incluye timestamps completos: `2026-05-13T10:30:00Z`

### phoneNumber y countryCode

phoneNumber NO incluye el código de país. countryCode es separado.

```
phoneNumber: "987654321"     // sin +
countryCode: "+51"           // con +
```

### Actualizaciones Futuras

Este documento se actualizará con nuevos endpoints del Planning context (citas, tratamientos, etc.).
