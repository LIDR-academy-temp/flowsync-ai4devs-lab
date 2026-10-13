## ADDED Requirements

### Requirement: Resumen de tareas por estado

El sistema SHALL devolver en `GET /api/v1/tasks/summary` cuántas tareas hay en cada uno de los tres estados y cuántas hay en total, contando todas las tareas del espacio que no estén en la papelera. La respuesta SHALL ser la misma para cualquier cuenta con sesión, SHALL reflejar el estado real en el momento de pedirla y SHALL ser una operación de solo lectura. El resumen NO SHALL devolver tareas, solo números, y por tanto NO SHALL ser una forma de obtener las hechas mezcladas con el resto.

#### Scenario: Recuento por estado

- **WHEN** se solicita `GET /api/v1/tasks/summary` con un token válido, en un espacio con 2 tareas pendientes, 1 en curso y 3 hechas
- **THEN** la respuesta es `200` con `{"data": {"pending": 2, "inProgress": 1, "done": 3, "total": 6}}`

#### Scenario: Espacio sin tareas

- **WHEN** se solicita el resumen en un espacio sin ninguna tarea
- **THEN** la respuesta es `200` con los cuatro valores a `0`, y no un error ni una respuesta vacía

#### Scenario: La papelera no cuenta

- **WHEN** hay una tarea hecha que se ha mandado a la papelera y se solicita el resumen
- **THEN** esa tarea no se suma ni a `done` ni a `total`

#### Scenario: El filtro de la lista no influye

- **WHEN** se solicita el resumen con cualquier parámetro `status` en la dirección
- **THEN** el resumen es el mismo que sin él: cuenta siempre todo el espacio

#### Scenario: Cuenta lo que cambia

- **WHEN** se cambia una tarea de «En curso» a «Hecho» y se vuelve a solicitar el resumen
- **THEN** `inProgress` baja en uno, `done` sube en uno y `total` no cambia

#### Scenario: Pedir el resumen no cambia nada

- **WHEN** se solicita el resumen tantas veces como se quiera
- **THEN** ninguna tarea cambia de estado, de responsable ni de fecha como consecuencia de haberlo mirado

#### Scenario: Resumen sin haber entrado

- **WHEN** se solicita `GET /api/v1/tasks/summary` sin cabecera `Authorization` válida
- **THEN** la respuesta es `401` y no se devuelve ningún recuento

### Requirement: Indicador de progreso sobre la lista

La interfaz SHALL mostrar, encima del listado de la pantalla de la lista, cuántas tareas del equipo están hechas sobre el total y qué porcentaje suponen, con la forma «3 de 12 hechas · 25 %». El cálculo SHALL hacerse sobre todas las tareas del espacio que no estén en la papelera, con independencia de la vista o del filtro aplicados, y NO SHALL hacerse sobre las filas que la lista muestra en ese momento. El porcentaje SHALL ser un número entero redondeado hacia abajo, de modo que solo se lea «100 %» cuando todas las tareas estén hechas.

#### Scenario: Indicador en la vista por defecto

- **WHEN** una persona con sesión abierta entra en la lista de un espacio con 12 tareas, 3 de ellas hechas, y la vista por defecto tiene filas
- **THEN** encima del listado lee «3 de 12 hechas · 25 %», aunque ninguna de las tres hechas aparezca en la lista

#### Scenario: El filtro no cambia el cálculo

- **WHEN** en ese mismo espacio se acota la lista por «Pendiente» y esa vista tiene filas
- **THEN** el indicador sigue leyendo «3 de 12 hechas · 25 %»

#### Scenario: Acotando por lo hecho

- **WHEN** se acota la lista por «Hecho» y esa vista tiene filas
- **THEN** el indicador sigue contando sobre el total del espacio y no sobre las filas visibles, de modo que no lee «100 %» salvo que todas las tareas estén hechas

#### Scenario: El porcentaje no redondea hacia arriba

- **WHEN** hay 299 tareas hechas de 300
- **THEN** el indicador lee «299 de 300 hechas · 99 %», y no «100 %»

#### Scenario: Ninguna hecha todavía

- **WHEN** el espacio tiene tareas pero ninguna está hecha y la vista tiene filas
- **THEN** el indicador se muestra y lee «0 de N hechas · 0 %»

#### Scenario: Un solo elemento en el total

- **WHEN** el espacio tiene una única tarea
- **THEN** el indicador concuerda con ese total y lee «0 de 1 hecha · 0 %», o «1 de 1 hecha · 100 %» si está hecha, y no «1 hechas»

### Requirement: El indicador no aparece sin filas a la vista

La interfaz NO SHALL mostrar el indicador de progreso cuando la lista no tiene ninguna fila a la vista. Esto incluye mientras la lista carga, el espacio sin tareas, un filtro válido sin resultados, la vista por defecto cuando no queda nada abierto, un filtro que no existe y un fallo al cargar la lista. En esos casos NO SHALL quedar ni el hueco del indicador ni un texto de relleno como «0 de 0».

#### Scenario: Espacio sin tareas

- **WHEN** se entra en la lista de un espacio sin ninguna tarea
- **THEN** no se ve el indicador y sí el mensaje propio del espacio vacío

#### Scenario: Filtro válido sin resultados

- **WHEN** se acota por «En curso» y no hay ninguna tarea en ese estado, aunque el espacio tenga otras
- **THEN** no se ve el indicador

#### Scenario: No queda nada abierto

- **WHEN** se mira la vista por defecto en un espacio donde todas las tareas están hechas, de modo que la lista no tiene filas
- **THEN** no se ve el indicador, y sí el mensaje de que no queda nada pendiente ni en curso con el número de tareas terminadas

#### Scenario: Filtro inventado

- **WHEN** se llega a la lista pidiendo un estado que no existe
- **THEN** no se ve el indicador

#### Scenario: Mientras carga

- **WHEN** la lista aún está cargando
- **THEN** no se ve el indicador, y solo aparece cuando ya están las filas a la vista

#### Scenario: Aparece al haber filas

- **WHEN** en un espacio sin tareas se crea la primera
- **THEN** el indicador aparece y lee «0 de 1 hecha · 0 %»

### Requirement: El indicador se mantiene al día sin recargar

La interfaz SHALL actualizar el indicador en el acto cuando una acción hecha desde la propia pantalla cambie el recuento: crear una tarea y cambiar su estado desde la fila. Si la petición de cambio de estado falla y la fila vuelve a su estado real, el indicador SHALL volver con ella. Si el resumen no se ha podido obtener, el indicador NO SHALL mostrarse y la lista SHALL seguir funcionando con normalidad; ese fallo NO SHALL presentarse como un error de la pantalla.

#### Scenario: Marcar una tarea como hecha

- **WHEN** con el indicador leyendo «3 de 12 hechas · 25 %» se marca una tarea abierta como «Hecho» desde su fila
- **THEN** el indicador pasa en el acto a «4 de 12 hechas · 33 %», aunque la fila salga de la vista

#### Scenario: Reabrir una tarea hecha

- **WHEN** con el indicador leyendo «4 de 12 hechas · 33 %» se pasa una tarea hecha a «En curso» desde la lista acotada por «Hecho»
- **THEN** el indicador pasa a «3 de 12 hechas · 25 %»

#### Scenario: Crear una tarea

- **WHEN** con el indicador leyendo «3 de 12 hechas · 25 %» se crea una tarea nueva
- **THEN** el indicador pasa a «3 de 13 hechas · 23 %», porque toda tarea nace pendiente

#### Scenario: El cambio de estado falla

- **WHEN** se marca una tarea como «Hecho» y la petición falla
- **THEN** la fila vuelve a su estado real y el indicador vuelve a su valor anterior

#### Scenario: El resumen no llega

- **WHEN** la lista carga bien pero la petición del resumen falla
- **THEN** la lista se ve con normalidad, no se muestra el indicador y no aparece ningún aviso de error por ello
