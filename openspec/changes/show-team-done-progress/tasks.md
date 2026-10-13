## 1. El cálculo del avance

- [x] 1.1 Escribir la función pura que da el porcentaje a partir de `done` y `total`, con el redondeo acotado: 0 % solo si no hay hechas, 100 % solo si están todas, y nunca 0 ni 100 en los casos intermedios (decisión 5 del diseño)
- [x] 1.2 Comprobarla a mano con los casos límite del spec: 0 de 5, 5 de 5, 1 de 300, 299 de 300, 1 de 1 y 3 de 12 (el frontend no tiene runner de tests)

## 2. El componente del indicador

- [x] 2.0 Añadir `Progress` al catálogo con `npx shadcn@latest add progress` (sin editar a mano más allá de corregir lo que el CLI genere mal) y comprobar que no se cuela ninguna dependencia nueva en `package.json`
- [x] 2.1 Crear `components/team-progress.tsx`: texto «X de Y tareas hechas · Z %» (singular cuando el total es 1) y la barra `Progress` con el mismo porcentaje y su `aria-label`, dentro de un contenedor `role="status"`, sin ningún color literal (decisión 6 del diseño)
- [x] 2.2 Hacer que no pinte nada si recibe `null` o un total de 0

## 3. El avance en la pantalla de tareas

- [x] 3.1 Añadir el estado `progress: { done, total } | null` y cargarlo con las dos consultas existentes (`listTasks` por defecto y `listTasks` con `'done'`), una vez por `token` y no por filtro (decisiones 1 y 2)
- [x] 3.2 Dejar `progress` en `null` si cualquiera de las dos consultas falla, sin mensaje de error y sin afectar a la lista ni al resto de la pantalla
- [x] 3.3 Confirmar con una nueva consulta tras cada acción propia, aplicando solo la última respuesta con un contador de versión (decisión 4)
- [x] 3.4 Al crear una tarea, subir el total en uno (solo si `progress` ya existe)
- [x] 3.5 Al cambiar el estado desde una fila, ajustar las hechas según el origen y el destino (sube al pasar a `done`, baja al salir de `done`, nada entre pendiente y en curso) en el mismo instante en que se repinta la fila (decisión 3)
- [x] 3.6 Si el cambio falla, deshacer ese ajuste junto con la reversión de la fila
- [x] 3.7 Pintar `TeamProgress` justo encima del listado, después de los avisos (decisión 7 del diseño)

## 4. Verificación a mano contra el servidor real

- [x] 4.1 Con `make db-up`, `make migrate`, `make seed` y los dos servidores en marcha, entrar con la cuenta de demostración y contrastar «X de Y» con un recuento independiente (acotando por «Hecho» y contando la lista)
- [x] 4.2 «Lo hecho cuenta aunque no esté en la lista» y «El filtro no cambia el avance»: las cifras son idénticas en la vista por defecto y en los tres filtros
- [x] 4.3 «Ninguna hecha todavía» y «Todo hecho»: dejar el espacio sin hechas y luego con todas hechas, y mirar el 0 % y el 100 % (comprobado con la API interceptada, sin tocar los datos de desarrollo)
- [x] 4.4 «Sin tareas no hay indicador» y «La primera tarea lo hace aparecer»: con una base de pruebas vacía no se ve, y al crear la primera sale con 0 de 1 (ídem: respuestas interceptadas)
- [x] 4.5 «Marcar como hecho lo sube al momento», «Volver atrás desde hecho lo baja», «Cambiar entre pendiente y en curso no lo mueve» y «Crear una tarea sube el total»
- [x] 4.6 «Un cambio que falla no deja el indicador mintiendo»: parar el backend, intentar cambiar un estado y comprobar que fila e indicador vuelven a lo anterior
- [x] 4.7 «Sin cifra fiable no se enseña»: bloquear en las herramientas del navegador la consulta `status=done` y comprobar que el indicador no aparece y la lista sigue funcionando
- [x] 4.8 «Las borradas no cuentan»: borrar una tarea por la API y recargar

## 5. Cierre

- [x] 5.1 Actualizar `docs/capabilities/tasks/README.md` (el párrafo que lista los archivos de interfaz de la capability) con el componente nuevo y con el comportamiento del indicador
- [x] 5.2 Pasar `cd frontend && npm run lint && npm run build` (el typecheck vive en `build`) y confirmar que el formateo con Prettier no deja diferencias
- [x] 5.3 Confirmar con `grep` que no entra ningún color literal ni clase de paleta cruda en `src/`, aparte del `text-white` que ya había en `button.tsx`
- [x] 5.4 Confirmar que el diff no toca `backend/`, `.adonisjs/` ni `docs/api/`
- [ ] 5.5 Cerrar la petición con `/commit`
- [ ] 5.6 Al terminar la unidad de trabajo, abrir el PR y pasar el subagente `adversarial-reviewer` sobre él
