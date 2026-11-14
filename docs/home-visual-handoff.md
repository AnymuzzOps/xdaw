# Home: ajuste sobre la referencia final

Se conserva la implementación estática y las rutas relativas compatibles con GitHub Pages /xdaw/.

- Hero original: XDAW centrado, mensaje aprobado, CTA naranja y capa de fondo lista para sustituir por video con object-fit: cover.
- Manifiesto único, compacto y con entrada progresiva al scroll.
- Referencia aplicada a anchos, cards de tres mundos, contraste naranja/magenta/cian, método en módulos, grilla de experiencias, panel de Organizaciones, teaser Academy, Origen y cierre.
- Se mantienen Dance, Exotic y Workout; cinco etapas reales; Kids permanente; eventos y comunidad; Academy externo.

## Diferencias intencionales y pendientes

El contenido real exige cinco módulos metodológicos, Kids y una fila adicional para eventos. Se conservan los textos y destinos reales, por lo que algunos saltos de línea y densidades difieren del mockup. No se usaron fotografías de referencia, stock ni imágenes generadas. Los espacios visuales son composiciones CSS abstractas. La fidelidad fotográfica queda pendiente de assets originales.

La web solicita Barlow Condensed e Inter a Google Fonts como antes. La red del entorno de verificación rechazó Google Fonts, GitHub y el registro npm; se verificó también el funcionamiento con fuentes de respaldo. Conviene incorporar WOFF2 con licencia al proyecto para fijar métricas sin acceso externo. El logotipo del Hero es tipográfico hasta disponer del vector oficial.

## Material necesario

- Logotipo XDAW oficial SVG con versión blanca.
- Video horizontal real para Hero y poster, sin texto incorporado; encuadre con centro despejado y variante móvil.
- Tres fotografías originales verticales Dance, Exotic y Workout (aprox. 4:5), con espacio inferior para texto.
- Clase/comunidad horizontal (aprox. 1.7:1), Kids y encuentro de comunidad (aprox. 1.5:1).
- Activación en una organización horizontal (aprox. 1.4:1).
- Retrato de Klaudio Reies (aprox. 1.2:1), adaptable a blanco y negro.

## Verificación

Build estático, sintaxis JavaScript y diff sin errores. Chromium/Playwright: 1440, 1024, 768, 390 y 320 px sin overflow; tres mundos, cinco etapas, manifiesto único, menú móvil y Escape; contenido visible con reduced motion. Assets de build y bases relativas de Kids y Eventos comprobados. No existe script de tests en package.json.
