# Bioquímica Básica — Testosterona

Plataforma interactiva de estudio (misma estructura que **Farma Básica**), orientada a **bioquímica clínica y nutrición** con el tema **Testosterona**.

## Contenido

- **Mecanismo de acción** — Diagrama interactivo (producción HPG → transporte → AR → tejidos → beneficio/patología)
- **Alteraciones nutricionales** — Músculo, grasa/aromatización, metabolismo glucídico, cardiovascular
- **Efectos clínicos** — Hipogonadismo, SOP/hiperandrogenismo, anabolizantes
- **Candado fisiológico** — Eliminado: acceso directo al contenido (alumnos de bioquímica)
- **Modo Arquitecto** — Ordenar las piezas del mecanismo
- **Credibilidad** — Casos clínicos con puntuación
- **Registro + PDF** — Métricas para el profesor

## Referencias

- Naamneh Elzenaty et al. (2022), Best Practice & Research Clinical Endocrinology & Metabolism
- Carbajal-García et al. (2020), Int J Endocrinol

## Cómo abrirlo

### Opción 1 — Solo interfaz (sin servidor)

```bash
cd bioquimica-basica
python3 -m http.server 8080
```

Abre `http://localhost:8080`

### Opción 2 — Con servidor de métricas (como Farma Básica)

```bash
cd bioquimica-basica/server
npm install
npm start
```

Abre la URL que indique el servidor (sirve también los archivos estáticos).

## Proyecto relacionado

- `../accion-testosterona-web/` — App React con diagramas SVG avanzados y layout anti-colisión (versión tutorial paso a paso).

## Panel del profesor

- Atajo: **Shift + P**
- Clave por defecto: `bioquim-prof`
