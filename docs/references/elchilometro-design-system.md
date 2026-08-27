# Sistema visual de El Chilómetro

> **Estado:** especificación descriptiva del frontend actual. Esta guía registra lo que ya está implementado; no propone un rediseño. La fuente de verdad sigue siendo `app/globals.css` junto con los componentes citados.

## 0. Alcance y principios observados

La Home se compone en `components/Home.tsx`; el marco global (Header y Footer) está en `app/layout.tsx`; el selector de KM, el contador y los iconos viven en componentes propios. El CSS es global, deliberadamente compacto y sin framework de utilidades. La identidad combina una base editorial neutra, rojo de acción, dorado competitivo y una jerarquía tipográfica muy pesada.

Principios que ya expresa el código:

- **El rojo significa acción y marca.** Se reserva para CTA, marca, reglas, focos y acentos.
- **El dorado significa liderazgo/valor.** El #1 tiene un tratamiento completo; el bronce distingue al #3 y un gris metálico al #2.
- **La información se presenta en superficies blancas**, con bordes grises finos y sombras muy contenidas.
- **Los números son protagonistas:** pesos 950, tracking negativo y line-height corto en H1, KM, posiciones y totales.
- **La Home es compacta y competitiva:** hero en dos columnas, ranking estrecho y métricas secundarias de baja altura.

---

## 1. Paleta real

### 1.1 Tokens declarados en `:root`

| Token | Valor exacto | Uso implementado |
|---|---:|---|
| `--bg` | `#fafbfc` | fondo general de `body` |
| `--surface` | `#fff` | cards y panels |
| `--soft` | `#f4f6f8` | fondos suaves, icono genérico, encabezados de tabla |
| `--text` | `#191b20` | texto principal |
| `--muted` | `#626a76` | `.muted`, ayudas y texto secundario genérico |
| `--red` | `#e3262e` | marca, CTA, controles, foco de formularios |
| `--red-dark` | `#b9161e` | hover de CTA primario |
| `--blue` | `#2563eb` | outline accesible de `:focus-visible` |
| `--line` | `#e0e3e8` | divisores y bordes estándar |
| `--shadow` | `0 7px 22px rgba(24,29,38,.055)` | sombra estándar de `.card`/`.panel` |

### 1.2 Valores hardcodeados que forman parte del aspecto actual

No todos los colores están tokenizados. Deben preservarse al reproducir literalmente estos patrones.

**Rojo y familia cálida**

- Eyebrow general: `#c81e27`.
- FOMO: borde `#f1a9ad`, fondo `#fff0f1`, texto `#5f5558`; título en `--red`.
- Regla: fondo `#ffe5e7`, texto `--red`.
- Icono por inicial: fondo `#fff0f1`, texto `#a9161d`, borde `#f1c6c8`.
- Error: `#b4232a`; preview de ejemplo: fondo `#fffafa`, borde `#e65b61`.
- Wizard: importe rojo `#da2d32`.

**Dorado, plata y bronce**

- Punto de líder: `#d7ad2d`.
- Card #1: borde `#d2a231`; gradiente `#fffdf4 → #fff1b8 68% → #f5d75f`; sombra `rgba(126,91,12,.14)`; medallón `#d8ad28`.
- Brillo interno #1: `rgba(255,255,255,.52)` y `rgba(255,255,255,.95)`; corona `rgba(185,130,10,.18)`.
- Badge líder: fondo `#fff7db`, texto `#b48300`.
- CTA de visita: borde `#d4a52d`, texto `#b18000`; hover borde `#b98600`, fondo `#fff9e8`, texto `#946d00`.
- #2: borde `#cbd3dd`, gradiente `#fff → #f1f4f7`; medallón `#e9edf2 → #aeb9c6`, borde `#b8c2cf`, texto `#344052`.
- #3: borde `#d9ad78`, gradiente `#fffdfb → #fbf2e8`; medallón `#f4c27d → #ad651e`, borde `#c98a43`, texto blanco.
- Wizard dorado: `#c59c3c`, `#c9a34d`, `#cba347`, `#c49b3f`; fondos `#fcf8ed`, `#faf6ec`; divisor `#eadbb7`.

**Neutros más usados**

- Header/superficies: `#fff`; botón secundario: borde `#cdd2d9`, texto `#343941`, hover `#f8f9fa`/`#aeb5bf`.
- Hero: lead `#67707d`; texto auxiliar `#89909b`; línea de líder `#dfe3e8`, texto `#606874`, título `#272b31`.
- Selector: bordes `#e1e4e9`, `#e5e7eb`; control `#f7f8fa`; nota `#9aa1ac`.
- Ranking: número `#69717d`; descripción/URL `#4f5865`; cifras `#202329`; etiquetas `#858d98`.
- Vacíos: borde `#d7dce3`, fondo `#fbfcfd`, número `#a4acb7`, texto `#505967`/`#939ba6`.
- Footer/disclaimer: fondo `#11141a`, divisor `#252a33`, texto `#7f8793` y `#8d95a1`, marca blanca.
- Presencia: punto `#20a45b`, halo `#e5f7ed`, pill `#f6f7f9`, borde `#dfe2e7`.

### 1.3 Iconos sociales

- Base social: `#25282d` con blanco.
- Instagram: gradiente `#7b32bf → #df2d78 58% → #f5a32b`, borde `#c93c85`.
- TikTok y X: `#111`.
- YouTube: fondo `#f00`, borde `#e10000`.

**Inconsistencia registrada:** existen varias aproximaciones del mismo concepto (rojos `#e3262e`, `#c81e27`, `#da2d32`; dorados múltiples; decenas de grises) en vez de tokens semánticos. No normalizarlas sin una tarea específica.

---

## 2. Tipografía

### 2.1 Familia y renderizado

`body` usa `Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`, con `line-height: 1.5` y `-webkit-font-smoothing: antialiased`. **Inter no se importa ni se sirve en el código actual**: solo se usa si está instalada; de lo contrario se resuelve la pila del sistema.

Los controles heredan con `button,input,textarea,select { font: inherit }`. Los pesos `850`, `900`, `950` son intencionales, aunque una fuente fallback puede sintetizarlos.

### 2.2 Escala y roles reales

| Rol | Tamaño / altura | Peso | Tracking | Otros |
|---|---|---:|---:|---|
| Marca Header | `1.3rem` | `950` | `-.04em` | móvil `1.08rem` |
| H1 Home | `clamp(2.65rem,4.7vw,4rem)` | `950` | `-.06em` | `line-height:.96`, máx. `670px` |
| H1 Home móvil | `clamp(2.35rem,11vw,3.15rem)` | `950` | `-.06em` | `line-height:.96` |
| H1/H2 de `.section` | `2rem` | `900` | `-.04em` | margen `0` |
| H2 métricas Home | `1.55rem` | hereda `900` | `-.04em` | móvil `1.5rem` |
| Título de ranking | `1.18rem` | `850` | `-.018em` | margen inferior `4px` |
| Lead | `1rem` | normal | normal | color `#67707d`; móvil `.94rem` |
| Texto base | tamaño UA (`16px` normalmente) | normal | normal | `line-height:1.5` |
| Párrafo card ranking | base | normal | normal | `line-height:1.45` |
| Texto secundario ranking | `small` UA (`.833em`) | URL `700` | normal | color `#4f5865` |
| Eyebrow | `.78rem` | `850` | `.12em` | uppercase, rojo |
| Kicker de sección | `.75rem` | `900` | `.04em` | uppercase |
| Número de ranking | `1.7rem` | `950` | `-.055em` | móvil `1.35rem` |
| Número medallón #1 | `2.1rem` | `950` | hereda `-.055em` | móvil `1.85rem` |
| Cifras KM/estadística | `1.55rem` | `950` | `.km`: `-.06em` | `line-height:1` |
| Etiqueta estadística | `.67rem` | `750` | normal | uppercase |
| Badge líder | `.68rem` | `950` | `.06em` | `line-height:1`, móvil `.64rem` |
| Botón base | tamaño heredado | `850` | `.01em` | acciones ranking `.79rem` |
| FOMO | `.84rem` | normal | normal | título `.86rem/850` |
| Texto de regla | `.82rem` | normal | normal | pill `900` |
| Métrica de audiencia | `.88rem` | `800` | normal | `line-height:1`; móvil `.82rem` |
| Título de página legal | `clamp(2.35rem,5.5vw,4.5rem)` | bold UA | `-.055em` | `line-height:1` |
| Wizard H1 | `2rem` | `950` | `-.045em` | `line-height:1.08` |
| Label wizard | `.88rem` | `850` | normal | contador `500` |

La voz visual usa mayúsculas en CTA, marca, badges, eyebrows y etiquetas métricas. No se aplica `text-transform` a botones globalmente: las mayúsculas provienen del contenido.

---

## 3. Layout, espaciado y breakpoints

### 3.1 Contenedor

- `.wrap`: `width:min(1120px, calc(100% - 32px)); margin:auto`, equivalente a máximo `1120px` y `16px` laterales.
- Hasta `760px`: `width:min(100% - 24px,1120px)`, es decir `12px` laterales.
- `.section`: `46px 0`; ranking sobrescribe a `14px 0`; métricas Home usan `14px` arriba/`27px` abajo.
- En móvil `.section`: `28px 0`; ranking `17px 0 12px`; métricas `13px 0 22px`.

### 3.2 Header, hero y secciones

- Header: `68px`, flex horizontal, `space-between`, fondo blanco y borde inferior. Móvil: `62px`.
- Hero: grid `minmax(0,1.55fr) minmax(300px,.78fr)`, gap `28px`, centrado vertical, padding `32px 0 26px`.
- Tablet `761–1024px`: columnas `minmax(0,1.2fr) minmax(280px,.8fr)`.
- Móvil `≤760px`: una columna, gap `18px`, padding `24px 0 20px`.
- Ranking: `.grid` con gap `12px`; cada fila desktop tiene `54px minmax(0,1fr) minmax(250px,310px)`, gap `16px`.
- Tablet: tercera columna fija de `260px`.
- Métricas inferiores: `.two`, dos columnas iguales, gap `14px`; móvil una columna, gap efectivo `12px` por `.home-metrics`.

### 3.3 Breakpoints reales

Solo existen dos rangos explícitos:

1. `@media (max-width:760px)`: adaptación móvil completa.
2. `@media (min-width:761px) and (max-width:1024px)`: ajustes de hero y ranking.

Además, `@media (prefers-reduced-motion:reduce)` elimina animaciones y transiciones y fuerza scroll no suave.

---

## 4. Cards y contenedores

### 4.1 Base

`.card,.panel`: fondo `--surface`, borde `1px solid --line`, radio `17px`, padding `22px`, sombra `--shadow`. En móvil solo `.panel` baja a `18px`; las cards de ranking tienen sus propias reglas.

### 4.2 Ranking normal

- `.rank`: radio `14px`, padding `16px 20px`, sombra `0 4px 15px rgba(24,29,38,.045)`.
- Hover: borde `#cfd4db`, sombra `0 7px 20px rgba(24,29,38,.065)`.
- Jerarquía: número → bloque icono/texto → stats/acciones.
- Bloque listado: icono `52px`, gap `14px`; texto con título, descripción y URL.
- Lado derecho: dos stats en columnas, gap `10px`; celdas de mínimo `68px`, padding `9px`, radio `12px`.

### 4.3 Podio

- **#1 / `.rank-leader`:** mínimo `250px`, padding `26px 28px`, borde dorado `1.5px`, gradiente cálido, brillo, sombra elevada. Número circular `60px`; corona decorativa absoluta `5.6rem`; badge “LÍDER ACTUAL”.
- **#2 / `.rank-second`:** fondo plata, borde y sombra fríos; número en medallón circular de `48px`.
- **#3 / `.rank-third`:** fondo crema/bronce, borde y sombra cálidos; medallón circular de `48px`.
- **#4+ normal:** superficie blanca estándar; los selectores `nth-child(2/3)` también colorean números, aunque las clases específicas dominan el podio.
- **Vacante / `.rank-empty`:** mínimo `72px`, borde dashed, fondo casi blanco, sin sombra; CTA secundario pequeño.

### 4.4 Cards secundarias

- Paneles de Tendencias/Actividad: padding `15px 17px`, radio `15px`, sombra ligera; lista con divisores `--line`.
- Selector: radio `20px`, padding `22px 20px 16px`, sombra más alta `0 12px 28px rgba(24,29,38,.08)`.
- Wizard: ancho `640px`, card con padding `40px`, radio `17px`, borde casi invisible y sombra suave.
- Callouts legales: radio `14px`, padding `18px 20px`, superficie `--soft`; nota amarilla `#fffbed`.

---

## 5. Botones, inputs y controles

### 5.1 Botón primario

`button,.button`:

- mínimo `46px` de alto; borde `1px solid --red`; radio `11px`; padding `.78rem 1.1rem`;
- peso `850`, tracking `.01em`; rojo, texto blanco;
- sombra `0 5px 13px rgba(227,38,46,.18)`;
- transición de `160ms` para color, borde, transform y sombra;
- hover: `--red-dark`, sube `1px`, sombra `0 8px 18px rgba(185,22,30,.22)`;
- active: baja `1px`, sin sombra;
- disabled: opacidad `.6`, cursor bloqueado;
- focus visible global: outline azul `3px`, offset `3px`.

### 5.2 Variantes implementadas

- `.secondary`: blanco, borde `#cdd2d9`, texto `#343941`, sombra mínima; hover gris.
- `.visit-button`: variante dorada outline, sin sombra.
- `.takeover-button`: primaria roja explícita.
- `.selector-cta`: ancho completo, mínimo `48px`, margen superior `14px`.
- `.actions .button`: ancho completo, mínimo `40px`, padding `.58rem .8rem`, `.79rem`; móvil mínimo `42px`.
- Vacante: mínimo `38px`, `.75rem`, blanco/gris, sin sombra.
- Wizard: ancho completo, mínimo `50px`, radio `8px`, `.83rem`; móvil mínimo `48px`.

### 5.3 KmSelector

- Card centrada; control interno grid `46px 1fr 46px`, gap `10px`, padding `12px`, radio `14px`.
- Botones +/-: `42×42px`, radio `9px`, texto `1.4rem`.
- Menos: blanco/neutral con `!important`; más: rojo primario.
- Valor: `2rem`, `line-height:1`, tracking `-.055em`; precio `.75rem`, peso `850`, rojo.
- El decremento no baja de `targetKm`; no hay estado disabled visual para ese límite.

### 5.4 Inputs

- Base: ancho completo, padding `14px`, borde `#cbd0d8`, radio `10px`, inset shadow mínimo.
- Placeholder `#8a9099`; hover `#aeb4bd`; textarea mínimo `100px` y resize vertical.
- Wizard sobrescribe: borde `#d8e0eb`, radio `8px`, padding `13px`; focus rojo con borde y outline de `1px` (además interactúa con `:focus-visible`).
- Checkbox: `20×20px`, `accent-color:--red`.

---

## 6. Detalles visuales distintivos

- **Marca KM:** cuadrado rojo `36×36px`, radio `9px`, texto `.85rem`, dentro de marca muy pesada.
- **Eyebrows:** rojos, uppercase y espaciados; en el wizard se vuelven dorados y sin tracking.
- **FOMO:** mini-alerta rosada de dos líneas con borde rojo suave, radio `11px`, padding `10px 14px`.
- **Regla económica:** badge rectangular pequeño, radio `5px`, rosa/rojo y peso `900`.
- **Presencia:** pill `999px`, punto verde con halo y separador tipográfico `·` entre presencia y visitantes.
- **Líder:** gradiente dorado, medallón, badge con estrella, corona translúcida y cifras en celdas blancas.
- **Divisores:** casi siempre `1px solid --line`; listas prescinden del borde en el último elemento.
- **ListingIcon:** contenedor cuadrado con radio cercano a un cuarto del lado; imagen con `object-fit:contain`; fallback por inicial en rosa; marcas sociales conservan color propio.
- **Footer:** bloque oscuro de alto contraste con texto secundario gris y links que pasan a blanco.
- **Movimiento:** botones y cards solo elevan sombra/borde; no hay animaciones ornamentales. Reduced motion las elimina.

No hay un componente de alerta genérico. Los patrones existentes son `.hero-fomo`, `.error`, `.legal-note` y los bloques dorados del wizard; deben elegirse por contexto, no mezclarse como si fueran una única variante.

---

## 7. Responsive: cambios exactos en móvil (`≤760px`)

### Navegación

- Header baja de `68px` a `62px`; marca de `1.3rem` a `1.08rem`.
- Se ocultan todos los enlaces de navegación salvo `.button`; el CTA queda en `42px` mínimo con padding `.65rem .8rem`.
- Footer apila verticalmente, alinea a la izquierda y usa gap `10px`.

### Hero y selector

- Hero pasa de dos columnas a una; selector queda debajo del copy.
- Gap `18px`; paddings `24px/20px`; H1 fluido móvil; lead `.94rem`.
- La fila de regla se apila y alinea a la izquierda; `.leader-line` desaparece.
- Selector reduce padding a `18px 15px 14px`, radio a `17px`; cifra a `1.8rem`.

### Ranking

- Cada card normal usa dos columnas `42px + contenido`, gap `10px`, padding `13px`.
- El lado de estadísticas/acciones baja a la segunda columna (`grid-column:2`).
- #2/#3: medallón `40px`, fuente `1.2rem`.
- #1 cambia a una única columna, padding `18px 15px`, gap `12px`; número, contenido y acciones ocupan columna 1; pierde altura mínima fija. Corona `3.5rem`; medallón `56px`.
- Iconos bajan `52→44px`, radio `13→11px`, gap `14→10px`.
- Stats: gap `9px`, celdas mínimo `64px`; acciones gap `7px`, botones mínimo `42px`.
- Vacantes: dos columnas `40px + contenido`, padding `12px`; CTA ocupa la segunda columna y todo su ancho.

### Secciones y contenido secundario

- Laterales pasan de `16px` a `12px`.
- Secciones estándar `46→28px` verticales.
- Encabezado de ranking permite wrap; el H2 toma ancho completo y el pill queda debajo.
- Métricas pasan de dos columnas a una; panels `12px 14px`.
- Las listas permiten que el texto derecho haga wrap.
- Disclaimer usa `.78rem`.

### Wizard y páginas interiores

- Página wizard: `28px 12px 42px`; card `24px 18px`, radio `14px`.
- El progreso oculta los nombres, conserva círculos de `27px` y conectores fluidos.
- H1 del wizard: `clamp(1.75rem,8vw,2.15rem)`.
- Resúmenes/previews: padding `16px`; botones conservan ancho completo.
- `.panel` genérico baja a `18px`; callouts legales a `15px`; page title mueve margen a `34px 0 16px`.

**Observación:** no existe breakpoint específico para pantallas extremadamente estrechas; grids de stats del líder siguen en dos columnas.

---

## 8. Componentes reutilizables

### Reutilizar directamente

- **Marco global Header/Footer:** ya se aplica desde `app/layout.tsx`; las páginas nuevas deben vivir dentro de ese layout, no duplicarlo.
- **`LegalPage`:** base correcta para páginas editoriales/informativas con `.wrap.section.legal`, eyebrow, título y CTA.
- **`KmSelector`:** CTA interactivo oficial cuando la intención sea escoger KM para subir.
- **`ListingIcon`:** representación oficial de destino, con fallback de imagen, social o inicial.
- **`PresenceCounter`:** pill oficial de audiencia cuando se necesiten esas métricas reales.
- **`PurchaseWizard`:** conservar completo para el flujo de compra; no extraer estilos ad hoc de él sin atender sus variantes locales.

### Patrones que hoy deben replicarse con clases existentes

- `.wrap`, `.section`, `.card`, `.panel`, `.two`, `.eyebrow`, `.muted`, `.button`, `.secondary`.
- Para rankings, reutilizar la estructura semántica y clases de `Home` (`rank`, `listing-main`, `rank-side`, etc.); hoy no existe `RankingCard` independiente.
- Alertas y badges son patrones CSS específicos, no componentes compartidos.

**Deuda estructural documentada, no corregida:** Header, Footer y cada ranking card están escritos inline en `layout.tsx`/`Home.tsx`. Son visualmente reutilizables, pero no existen como componentes exportables.

---

## 9. Mapa código → diseño

| Patrón | Archivo / componente | Clase(s) | Regla responsable |
|---|---|---|---|
| Tokens y reset | `app/globals.css` | `:root`, `*`, `body` | variables, box sizing, pila tipográfica |
| Contenedor | `app/globals.css` | `.wrap` | `1120px`, márgenes laterales responsive |
| Header/marca/nav | `app/layout.tsx` | `.header`, `.brand`, `.mark`, `.nav` | altura, flex, rojo de marca, ocultación móvil |
| Footer | `app/layout.tsx` | `.footer`, `.footer-brand`, `.footer-links` | fondo oscuro, flex/wrap, stacking móvil |
| Hero | `components/Home.tsx` | `.reference-hero`, `.hero-copy`, `.hero-fomo`, `.lead`, `.hero-rule-row`, `.rule`, `.leader-line` | grid, H1, alerta y regla |
| Selector KM | `components/KmSelector.tsx` | `.selector-card`, `.distance-control`, `.distance-minus`, `.selector-cta`, `.km` | superficie elevada, stepper y CTA |
| Encabezado ranking | `components/Home.tsx` | `.ranking-section`, `.section-kicker`, `.section-head` | espaciado compacto y jerarquía |
| Audiencia | `components/PresenceCounter.tsx` | `.audience-metrics`, `.presence`, `.visitor-total` | pill, punto verde, separador |
| Card ranking | `components/Home.tsx` | `.card.rank`, `.rankno`, `.listing-main`, `.rank-side` | grid tripartito y responsive |
| Podio | `components/Home.tsx` | `.rank-leader`, `.rank-second`, `.rank-third`, `.leader-crown`, `.leader-badge` | gradientes, medallones y sombras |
| Stats/CTA ranking | `components/Home.tsx` | `.leader-stats`, `.actions`, `.visit-button`, `.takeover-button` | celdas, botones dorado/rojo |
| Vacante | `components/Home.tsx` | `.rank-empty`, `.empty-rank-copy` | borde dashed y CTA neutral |
| Iconos destino | `components/ListingIcon.tsx` | `.listing-icon`, `.image`, `.social`, `.initial` y plataforma | tamaño, fallback y colores sociales |
| Métricas Home | `components/Home.tsx` | `.two.home-metrics`, `.metric-list`, `.activity-list` | dos columnas, panels compactos, divisores |
| Disclaimer | `components/Home.tsx` | `.disclaimer` | banda oscura full-bleed mediante shadow/clip-path |
| Botones | enlaces y botones globales | `button`, `.button`, `.secondary` | estados, tamaño y foco |
| Formularios | `PurchaseWizard.tsx` y global | `input`, `textarea`, `select`, `.help`, `.error` | borde, focus, placeholder, error |
| Wizard | `components/PurchaseWizard.tsx` | `.wizard-*`, `.listing-preview`, `.price-highlight`, `.order-summary` | flujo centrado, progreso y bloques dorados |
| Página editorial | `components/LegalPage.tsx` | `.legal`, `.page-title`, `.legal-*`, `.play-*` | ancho `780px`, títulos, callouts |
| Responsive | `app/globals.css` | media queries `760px`, `761–1024px` | stacking y reducción de escala |

---

## 10. Inconsistencias actuales que deben preservarse hasta decidir corregirlas

1. Inter se declara pero no se carga.
2. La paleta usa tokens solo para los colores base; rojos, dorados y grises contextuales están hardcodeados.
3. Los pesos 850/950 no son pesos CSS habituales en todas las fuentes fallback y pueden sintetizarse.
4. El H1 legal no declara peso explícito; depende del bold del navegador, mientras Home/Wizard usan `950`.
5. El botón base tiene radio `11px`, ranking puede usar otros radios y wizard lo fuerza a `8px`.
6. `.rank-leader .rankno` declara `border:0` mientras la base de la card usa borde `1.5px`; es intencionalmente más plano que plata/bronce.
7. El texto “small” del ranking depende del tamaño UA, no de un `font-size` explícito.
8. Header y Footer no son componentes nombrados; viven dentro de `Layout`.
9. No hay primitivas compartidas para Badge o Alert; hay tratamientos independientes.
10. En móvil, el líder se estructura distinto de las cards normales y conserva stats en dos columnas.

---

# Cómo hacer que una página nueva parezca parte de El Chilómetro

1. **Mantener el marco:** crear la ruta bajo `app/` para heredar Header y Footer de `app/layout.tsx`. No duplicar navegación.
2. **Elegir el contenedor oficial:** usar `<main className="wrap section">`. Para contenido de lectura, añadir `.legal`; para un flujo enfocado, seguir el patrón `.wizard-page > .wizard-shell`.
3. **Respetar los márgenes:** ancho máximo `1120px`, `16px` laterales desktop y `12px` móvil. Usar secciones de `46px` verticales (`28px` móvil), salvo bloques densos como ranking.
4. **Usar la tipografía existente:** la pila de `body`; H1 muy pesado, line-height cercano a `1` y tracking negativo; H2 de `2rem/900`; cuerpo con `line-height:1.5`; secundarios en `--muted`.
5. **Introducir la sección con jerarquía conocida:** eyebrow rojo uppercase y espaciado; título con margen cero; copy secundario gris. Reservar mayúsculas para labels y acciones.
6. **Construir superficies con `.card` o `.panel`:** blanco, borde `--line`, radio `17px`, padding `22px`, sombra `--shadow`. No añadir sombras más oscuras sin corresponder a liderazgo.
7. **Reservar el dorado para competencia/valor:** #1, importe o estados completos; no convertirlo en un segundo color CTA general. La acción principal sigue siendo roja.
8. **Usar botones existentes:** `.button` rojo para CTA; `.button.secondary` para retroceder/cancelar; mínimo `46px`, radio `11px`. Reutilizar `.visit-button` solo para visitar destinos.
9. **Usar controles coherentes:** padding `14px`, radio `10px`, borde neutral; labels pesados; ayudas en `.help`; errores en `.error`; conservar focus visible azul global o focus rojo contextual del wizard.
10. **Mantener el ritmo:** grids con gaps de `12–16px`; interior de cards `14–22px`; pequeñas separaciones de `4–10px` para título/metadato; evitar grandes áreas vacías.
11. **Reutilizar iconografía real:** usar `ListingIcon` para destinos; no sustituir logos sociales por un set visual diferente. Para marca, conservar el bloque KM rojo.
12. **Planear móvil desde las reglas reales:** a `760px`, una columna; reducir paneles a `18px`; llevar laterales a `12px`; apilar CTAs a ancho completo cuando formen un flujo; ocultar navegación secundaria y conservar el CTA principal.
13. **Comprobar tablet:** entre `761px` y `1024px`, evitar columnas laterales mayores a `260–280px`; aplicar `minmax(0,1fr)` para prevenir overflow.
14. **Conservar accesibilidad/movimiento:** `:focus-visible` de `3px`, áreas táctiles de al menos `42–48px`, y respeto de `prefers-reduced-motion`.

## Los 10 rasgos visuales más importantes

1. Rojo `#e3262e` para marca y CTA, con hover `#b9161e`.
2. Tipografía sans muy pesada (850–950) y tracking negativo en títulos y cifras.
3. Fondo casi blanco `#fafbfc` y superficies blancas de borde gris fino.
4. Contenedor central de `1120px`, compacto y con laterales reducidos.
5. Cards redondeadas (`14–20px`) con sombras discretas, nunca dramáticas.
6. Liderazgo expresado con dorado, gradiente, medallón, badge y corona.
7. Podio diferenciado: oro, plata y bronce; puestos normales neutros.
8. Botones robustos, levemente elevados y de mayúsculas editoriales.
9. Microdetalles informativos en pills, eyebrows, badges y celdas de cifras.
10. Responsive a `760px`: una columna, menos padding, CTA visible y navegación secundaria oculta.
