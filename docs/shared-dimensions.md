# Sistema dimensional XDAW / XDAW Academy

Ambas webs son independientes: los tokens equivalentes y `src/navigation.js` están copiados en cada repositorio, sin importar archivos de la otra web.

## Auditoría previa

Se revisaron las reglas base, los media queries y los bloques añadidos al final antes de editar.

- **XDAW:** header `fixed` de 80 px redefinido por un bloque final; menú activado originalmente a 800 px y vuelto a activar a 1000 px. El logo se declaraba a 85/100 px y recibía nuevas medidas de 120/112/110/96 px. La navegación mezclaba 10/9/12,5/14 px. Los botones usaban Barlow Condensed a 12–16 px, con alturas de 36/37/42/44/46 px. El listener de scroll añadía una clase sin una regla visual necesaria.
- **Academy:** header `sticky` de 88/76/70 px, seguido por overrides de Home a 72/60 px y offsets superiores negativos. La navegación pasaba entre 10/12/13 px. Los botones mezclaban tamaños de 10–14 px, alturas de 44–50 px y flechas de texto de 23 px. Había dimensiones específicas repetidas para hero, panel y formulario.

Se sustituyeron los bloques del header en su ubicación base y se consolidaron las dimensiones de botones en sus reglas originales. No se añade una nueva capa de overrides al final. Se mantienen los ajustes editoriales y fotográficos ajenos al sistema funcional.

## Dimensiones finales

| Elemento | XDAW | Academy |
| --- | --- | --- |
| Header desktop (borde incluido) | 80 px | 80 px |
| Header móvil/tablet | 68 px | 68 px |
| Posición y scroll | sticky, top 0, altura constante | sticky, top 0, altura constante |
| Navegación desktop | Inter 13 px, peso 600, línea 1,25 | Igual |
| Navegación móvil | Inter 14 px, peso 600; enlace mínimo 44 px | Igual |
| Gap entre enlaces | 20 px; 16 px hasta 1200 px | Igual |
| Canvas de logo desktop/móvil | 36 / 32 px; imagen 3:1, sin deformación | 36 / 32 px; wordmark con proporción propia |
| CTA del header | 46 px, Inter 14 px/600, padding 10×18 px | Igual |
| Botones generales | mínimo 46 px, Inter 14 px/600, padding 10×20 px | Igual |
| Iconos de flecha | SVG 16×16 px, sin encoger | Igual |
| Texto general/secundario | 14 / 12 px | 14 / 12 px |
| Estados funcionales | desplazamiento hover −2 px, transición 180 ms; foco visible de 3 px | Igual |
| Forma/color de botones | cápsula/naranja; variantes existentes conservadas | rectangular/cian; variantes existentes conservadas |
| Header máximo | 1312 px | 1312 px |
| Contenido editorial | 1120 px | 1312 px |
| Breakpoint de navegación | desktop desde 1024 px, menú por debajo | Igual |
| Escala de gutters | 64 / 40 / 32 / 24 px | Igual |

La diferencia de ancho editorial es intencional: ambos proyectos definen `--content-max:1312px` y `--content-reading:1120px`, pero XDAW utiliza la medida de lectura para conservar su composición y Academy utiliza la medida amplia aprobada. El header utiliza la misma medida amplia en ambos.

### Tokens y breakpoints

- Header: `--header-height-desktop`, `--header-height-mobile`, `--header-height`, `--header-gap`, `--header-max`, `--logo-height`, `--logo-height-mobile`.
- Interfaz: `--font-ui`, `--text-nav`, `--text-nav-mobile`, `--text-body`, `--text-secondary`, `--text-button`, `--weight-ui`, `--button-height`, `--button-height-header`, `--icon-size`, `--nav-gap`.
- Espaciados: `--space-1` a `--space-8`: 4, 8, 12, 16, 24, 32, 48 y 64 px.
- Medidas: `--content-max`, `--content-reading`, `--page-gutter`, `--wrap`.
- Breakpoints generales documentados en ambos: 600, 900, 1024 (navegación) y 1200 px. Las composiciones particulares de Academy conservan su transición de 700 px; el hero grande de cada marca conserva sus umbrales propios. No se fuerzan todas las secciones a tener el mismo layout.

Las variables de breakpoint documentan el contrato: CSS no permite utilizarlas directamente en media queries. El corte de navegación se expresa como `(width < 1024px)` en CSS y `(min-width:1024px)` en JavaScript, sin hueco en anchos fraccionales. Deben actualizarse conjuntamente si cambia ese valor.

Gutters de 64 px por encima de 1200; 40 px hasta 1200; 32 px hasta 900; 24 px hasta 600. En 375/430/768/1024/1440 px, el header mide respectivamente 327/382/704/944/1312 px de ancho interior.

Los anchos de botones dependen del contenido. Solo se mantienen los anchos completos de los contextos que ya los requerían, como formulario y CTA móviles. Los titulares conservan Barlow Condensed en XDAW y Anton en Academy; no se aumenta su escala.

## Navegación y offsets

Se eligió `sticky` con altura fija por breakpoint para ambos: participa en el flujo y no necesita listeners que alteren su tamaño. En XDAW se compensa el espacio que antes ocupaba el header superpuesto en las medidas del hero, preservando la posición del contenido y el total del primer bloque.

Las anclas usan `scroll-padding-top: calc(var(--header-height) + 16px)`: 96 px desktop y 84 px móvil. Se retiran los offsets redundantes. El menú se coloca debajo del header con `inset:100% 0 auto`, admite scroll en pantallas bajas y no cambia su altura.

`navigation.js` sincroniza `hidden`, `aria-expanded`, el nombre accesible y el foco. Cierra con Escape (devolviendo foco al botón), clic exterior, selección de enlace, salida de foco y cambio de breakpoint. Los enlaces cerrados quedan fuera de la navegación por teclado. El panel está oculto desde el primer render en móvil; el fallback `(scripting:none)` permite acceder a los enlaces con JavaScript desactivado, sin producir un salto de altura mientras se carga el módulo.

El CTA del header queda oculto en el menú compacto de ambas webs, conservando las acciones de la página. El menú usa un botón de 44×44 px y enlaces de al menos 44 px.

## Verificación

- `npm test`: cinco pruebas de estado de navegación por repositorio para 375, 430, 768, 1024 y 1440 px, incluyendo Escape/foco, clic exterior, enlaces y resize. Utilizan un adaptador DOM mínimo; no son pruebas de un navegador real.
- `npm run build`: build estático de cada sitio, conservando scripts, rutas y configuración de publicación existentes.
- `node --check src/main.js` y `node --check src/navigation.js`.
- Academy mantiene `npm run check` para enlaces, anclas, assets y Pages.
- Comprobaciones estáticas del contrato de tokens, ancho disponible del header y assets construidos en los cinco anchos solicitados.

**Límite de verificación visual:** el servicio compartido de preview permanece detenido después del fallo de relay documentado en las revisiones anteriores. No se completó una revisión visual de ambos sitios ni pruebas de scroll/overflow en navegador. Las pruebas de lógica y medidas estáticas no sustituyen esa verificación. Antes de fusionar o publicar, comparar ambos sitios en los mismos 375, 430, 768, 1024 y 1440 px, incluyendo teclado, zoom 200%, scroll y enlaces de ancla. No se instala ni se sustituye la infraestructura de navegador del entorno.

No se cambian fotografías, textos, colores, arquitectura de contenido ni configuración de GitHub Pages. No hay dependencias nuevas.
