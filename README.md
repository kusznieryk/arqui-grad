# Arqui ASM - Evaluador de Assembly con IA

Plataforma para estudiantes de Arquitectura de Computadores que permite evaluar soluciones de Assembly usando Google Gemini 2.5 Flash-Lite.

## Características

- 📝 **Ejercicios de Assembly**: Problemas diseñados para estudiantes de Arquitectura de Computadores
- 🤖 **Evaluación con IA**: Retroalimentación instantánea usando Gemini 2.5 Flash-Lite
- 📊 **Seguimiento de Progreso**: Puntajes, errores identificados y sugerencias
- 🔐 **Autenticación**: Sistema de login/registro con NextAuth
- 👨‍💼 **Panel de Admin**: Gestión de ejercicios y re-parsing de datos
- 🚀 **Rate Limiting**: Protección contra spam en evaluaciones

## Tecnologías

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Autenticación**: NextAuth.js con credenciales
- **IA**: Google Generative AI SDK (Gemini 2.5 Flash-Lite)
- **Validación**: Zod schemas

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env` y configura:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="tu-clave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Google Generative AI (para evaluaciones)
GOOGLE_API_KEY="tu-api-key-de-google"
```

### 3. Configurar base de datos

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Poblar con ejercicios de ejemplo
npm run seed
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
arqui-asm/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── exercises/     # CRUD ejercicios
│   │   │   ├── submissions/   # Evaluaciones
│   │   │   └── admin/         # Admin endpoints
│   │   ├── exercises/         # Páginas de ejercicios
│   │   ├── login/            # Página de login
│   │   ├── register/         # Página de registro
│   │   └── admin/            # Panel de administración
│   ├── components/           # Componentes React
│   ├── lib/                  # Utilidades y configuración
│   │   ├── auth.ts           # Configuración NextAuth
│   │   ├── prisma.ts         # Cliente Prisma
│   │   ├── exercises.ts     # Parser de ejercicios
│   │   └── zod.ts            # Esquemas de validación
│   └── services/             # Servicios de negocio
│       └── gradeService.ts   # Servicio de evaluación con IA
├── prisma/
│   └── schema.prisma         # Esquema de base de datos
├── data/
│   └── exercises.txt         # Archivo de ejercicios (formato YAML-like)
└── scripts/
    └── seed-exercises.js     # Script de población de datos
```

## Formato de Ejercicios

Los ejercicios se definen en `data/exercises.txt` con formato YAML-like:

```yaml
---
id: add-two-ints
title: Sumar dos enteros
tags: ["asm", "arithmetic"]
prompt: |
  Escribir un programa en Assembly (x86) que lea dos enteros y escriba su suma...
expected_solution: |
  ; Solución de referencia (se mantiene oculta)
  section .text
  global _start
  ; ...
---
```

## API Endpoints

### Autenticación
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `POST /api/register` - Registro de usuarios

### Ejercicios
- `GET /api/exercises` - Lista de ejercicios
- `GET /api/exercises/[id]` - Detalle de ejercicio

### Evaluaciones
- `POST /api/submissions` - Enviar solución para evaluación

### Admin
- `POST /api/admin/reparse` - Re-parsing de ejercicios

## Evaluación con IA

El sistema usa Gemini 2.5 Flash-Lite para evaluar soluciones de Assembly:

1. **Entrada**: Código del estudiante + solución esperada (oculta)
2. **Procesamiento**: Prompt en inglés con contexto educativo
3. **Salida**: JSON en español con:
   - `es_correcto`: boolean
   - `puntaje`: 0-100
   - `errores`: string[]
   - `sugerencias`: string[]
   - `observaciones`: string

## Despliegue en Producción

### Base de Datos
Cambiar `DATABASE_URL` en `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/arqui_asm"
```

### Variables de Entorno
```env
NEXTAUTH_URL="https://tu-dominio.com"
GOOGLE_API_KEY="tu-api-key-de-google"
NEXTAUTH_SECRET="clave-secreta-fuerte"
```

### Comandos de Despliegue
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Poblar ejercicios
npm run seed

# Construir para producción
npm run build
npm start
```

## Desarrollo

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Servidor de producción
npm run lint         # Linter ESLint
npm run migrate      # Ejecutar migraciones
npm run seed         # Poblar base de datos
```

### Agregar Nuevos Ejercicios

1. Editar `data/exercises.txt` con el formato YAML-like
2. Ejecutar `npm run seed` para actualizar la base de datos
3. O usar el panel de admin: `/admin` → "Reparse exercises file"

## Contribuir

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.