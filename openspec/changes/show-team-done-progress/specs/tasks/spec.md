## ADDED Requirements

### Requirement: Avance del equipo sobre la lista

La interfaz SHALL mostrar, encima del listado de la pantalla de tareas, cuántas de las tareas del equipo están en estado «Hecho» sobre el total de tareas del espacio, como recuento («X de Y») y como porcentaje. El total SHALL ser el de todas las tareas del espacio en los tres estados, sin contar las borradas. El indicador NO SHALL depender del filtro aplicado a la lista: mide el avance del equipo, no el de la vista. SHALL actualizarse al instante con las acciones propias de la pantalla —crear una tarea o cambiar el estado de una fila— sin recargar. NO SHALL mostrarse cuando el espacio no tiene ninguna tarea, ni cuando no se haya podido calcular: en ningún caso SHALL enseñar una cifra inventada.

#### Scenario: Avance a la vista

- **WHEN** una persona con sesión abierta entra en la lista de un espacio con 12 tareas, 3 de ellas hechas
- **THEN** encima del listado ve que 3 de 12 tareas están hechas y que eso es el 25 %

#### Scenario: Lo hecho cuenta aunque no esté en la lista

- **WHEN** entra en la lista sin tocar ningún filtro, en un espacio cuyas hechas la vista por defecto deja fuera
- **THEN** el recuento y el porcentaje incluyen esas tareas hechas, aunque ninguna salga en el listado

#### Scenario: El filtro no cambia el avance

- **WHEN** acota la lista por «Pendiente», por «En curso» y por «Hecho», uno tras otro
- **THEN** el recuento y el porcentaje son los mismos en las tres vistas y en la vista por defecto

#### Scenario: Ninguna hecha todavía

- **WHEN** entra en la lista de un espacio con tareas, ninguna de ellas hecha
- **THEN** el indicador se muestra con 0 hechas sobre el total y un 0 %, en lugar de desaparecer

#### Scenario: Todo hecho

- **WHEN** entra en la lista de un espacio en el que todas las tareas están hechas
- **THEN** el indicador muestra todas hechas sobre el total y un 100 %, y la lista por defecto sigue mostrando el mensaje de que no queda nada pendiente ni en curso

#### Scenario: El redondeo no promete lo que no es

- **WHEN** el porcentaje exacto no es entero y queda entre 0 y 100, como 1 hecha de 300 o 299 de 300
- **THEN** el porcentaje mostrado es un entero que no es 0 mientras haya alguna hecha ni es 100 mientras quede alguna sin hacer

#### Scenario: Las borradas no cuentan

- **WHEN** hay tareas en la papelera
- **THEN** no entran ni en las hechas ni en el total del indicador

#### Scenario: Sin tareas no hay indicador

- **WHEN** entra en la lista de un espacio en el que no se ha creado ninguna tarea
- **THEN** no se muestra el indicador, y sí la explicación de «El espacio sin tareas»

#### Scenario: La primera tarea lo hace aparecer

- **WHEN** se crea la primera tarea desde ese estado
- **THEN** aparece el indicador con 0 hechas sobre 1 y un 0 %

#### Scenario: Marcar como hecho lo sube al momento

- **WHEN** se marca una tarea como «Hecho» desde su fila
- **THEN** el recuento de hechas y el porcentaje suben en el acto, sin recargar, aunque la fila salga de la vista

#### Scenario: Volver atrás desde hecho lo baja

- **WHEN** se cambia a «Pendiente» o «En curso» una tarea que estaba hecha
- **THEN** el recuento de hechas y el porcentaje bajan en el acto, y el total no cambia

#### Scenario: Cambiar entre pendiente y en curso no lo mueve

- **WHEN** se cambia una tarea entre «Pendiente» y «En curso»
- **THEN** el indicador no cambia

#### Scenario: Crear una tarea sube el total

- **WHEN** se crea una tarea, con cualquier filtro puesto
- **THEN** el total sube en uno, las hechas no cambian y el porcentaje baja o se mantiene

#### Scenario: Un cambio que falla no deja el indicador mintiendo

- **WHEN** el servidor rechaza un cambio de estado cuyo efecto ya se había reflejado en el indicador
- **THEN** el indicador vuelve a las cifras anteriores, junto con la fila

#### Scenario: Sin cifra fiable no se enseña

- **WHEN** no se puede obtener el recuento del equipo
- **THEN** el indicador no se muestra, en lugar de enseñar 0 o una cifra a medias, y el resto de la pantalla sigue funcionando
