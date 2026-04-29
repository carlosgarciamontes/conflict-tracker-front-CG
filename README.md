# Conflict Tracker - Monitor de Conflictos Geopolíticos 🌍

Este repositorio contiene el código fuente y la documentación del despliegue Fullstack de la aplicación Conflict Tracker, desarrollada con Vue.js (Frontend) y Spring Boot (Backend), con persistencia en PostgreSQL.

## 1. URL Pública del Proyecto
* **Frontend (Vercel):** [https://conflict-tracker-front-cg.vercel.app](https://conflict-tracker-front-cg.vercel.app)
* **Backend API (Render):** `https://conflict-tracker-5cxx.onrender.com/api/v1/conflicts`

---

## 2. Esquema de la Arquitectura

El proyecto sigue una arquitectura cliente-servidor desacoplada:

* **Cliente (Frontend):** SPA desarrollada con **Vue 3** y Vite, usando Pinia para la gestión del estado. Desplegado en la red global de **Vercel**.
* **Servidor (Backend):** API RESTful desarrollada con **Java 24** y **Spring Boot**. Contenerizada con Docker y desplegada en **Render**.
* **Base de Datos:** **PostgreSQL** alojada en la nube de **Supabase**, utilizando un Transaction Pooler para la gestión de conexiones.

```text
[ Vercel ] <--- (Peticiones HTTP/REST) ---> [ Render ] <--- (Conexión JDBC) ---> [ Supabase ]
 (Vue.js)                                 (Spring Boot)                          (PostgreSQL)
```
## 3. Configuración de Variables de Entorno
Para realizar un nuevo despliegue en otro entorno, es necesario configurar las siguientes variables:

En el Backend (Render / Docker)
* DB_URL: Cadena de conexión JDBC hacia la base de datos (Ej: jdbc:postgresql://aws-0-eu-west-1.pooler.supabase.com:6543/postgres).

* DB_USERNAME: Usuario de la base de datos (Ej: postgres.proyecto_id).

* DB_PASSWORD: Contraseña de la base de datos.

* FRONTEND_URL: URL exacta del cliente autorizado para evitar bloqueos por CORS (Ej: https://conflict-tracker-front-cg.vercel.app). Importante: Sin barra (/) al final.

* SERVER_PORT: Puerto de escucha forzado para el contenedor (Valor recomendado en Render: 10000).

En el Frontend (Vercel)
* VITE_API_URL: URL base del backend donde se harán las peticiones fetch (Ej: https://conflict-tracker-5cxx.onrender.com).

## 4. Modificaciones y Resolución de Errores durante el Despliegue
Durante el proceso de paso a producción, surgieron varios retos de integración entre plataformas que requirieron adaptaciones específicas en el código y en la infraestructura.

🛠️ Backend (Spring Boot / Render)
1. Error de conexión con Supabase (IPv4 vs Transaction Pooler)

* Error inicial: NullPointerException y Connection refused en los logs de Spring Boot al arrancar.

* Causa: Supabase ha deprecado las conexiones directas IPv4 en el puerto 5432 para planes gratuitos, rechazando la petición de Render.

* Solución: Se modificó la configuración en Supabase para utilizar un Transaction Pooler (puerto 6543). Se adaptó la variable DB_URL añadiendo el prefijo jdbc: y separando las credenciales (DB_USERNAME y DB_PASSWORD) en variables independientes para que el driver de PostgreSQL las procesara correctamente.

2. Error de puertos en el contenedor Docker

* Error inicial: No open ports detected, continuing to scan... provocando un fallo en el despliegue de Render.

* Causa: Render no detectaba correctamente el puerto expuesto por defecto (8080) de la aplicación Spring Boot dentro del contenedor Docker.

* Solución: Se inyectó la variable de entorno genérica SERVER_PORT=10000 en Render para forzar la escucha en el puerto esperado por la plataforma.

3. Error de CORS (Cross-Origin Resource Sharing)

* Error inicial: blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present.

* Causa: Spring Boot bloqueaba las peticiones entrantes porque el dominio de Vercel no estaba autorizado.

* Solución: Se implementó la anotación @CrossOrigin(origins = "${FRONTEND_URL}") en los controladores y se aseguró que la variable de entorno inyectada en Render coincidiera milimétricamente con la URL generada por Vercel (sin incluir la barra final /).

💻 Frontend (Vue / Vercel)
1. Error de Enrutamiento SPA (Error 404 al recargar)

* Error inicial: Al recargar manualmente una ruta específica en producción, Vercel devolvía un error 404.

* Causa: Al ser una Single Page Application (SPA), Vercel intentaba buscar un archivo físico en el servidor que no existía.

* Solución: Se creó un archivo vercel.json en la raíz del proyecto para redirigir todo el tráfico (rewrites) hacia el index.html, cediendo el control del enrutamiento a Vue Router.
(Nota: [Insertar captura del archivo vercel.json aquí])

2. Peticiones fallidas al Backend local

* Error inicial: ERR_CONNECTION_REFUSED en la consola del navegador.

* Causa: El código de Vue intentaba realizar operaciones fetch contra http://localhost:8080, un entorno inexistente en Vercel.

* Solución: Se refactorizaron las llamadas a la API en Pinia (conflictStore.js) utilizando import.meta.env.VITE_API_URL para inyectar dinámicamente la URL de Render en tiempo de compilación.
(Nota: [Insertar captura del código refactorizado en el Store aquí])

3. Error de interpolación en la petición DELETE

* Error inicial: Petición fallida a /api/v1/conflicts/%{id}.

* Causa: Error de sintaxis en el Template Literal de JavaScript, usando % en lugar del símbolo $.

* Solución: Se corrigió la interpolación a ${id} para asegurar el correcto paso del parámetro en la ruta REST.
