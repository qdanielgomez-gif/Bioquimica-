/**
 * Módulos de datos — Bioquímica Básica · Testosterona
 */
const DRUG_MODULES = {
  testosterona: {
    requiresPhysiologyLock: false,
    pharmaData: {
      drug: {
        title: "Testosterona",
        subtitle: "Síntesis · Obesidad · Músculo · CV · Envejecimiento",
      },
    },
    synthesis: {
      source: {
        full: "Zhang et al. (2023) Mol Reprod Dev · Carbajal-García et al. (2020) Int J Endocrinol.",
        doi: "10.1002/mrd.23705",
      },
      diagram: {
        rows: [
          ["via-mevalonato"],
          ["inicio-esteroidogenesis"],
          ["produccion-androgenos"],
          ["aromatizacion-periferica"],
        ],
        connections: [
          { from: "via-mevalonato", to: "inicio-esteroidogenesis", label: "colesterol" },
          { from: "inicio-esteroidogenesis", to: "produccion-androgenos", label: "pregnenolona" },
          { from: "produccion-androgenos", to: "aromatizacion-periferica", label: "testosterona" },
        ],
      },
      steps: [
        {
          id: "via-mevalonato",
          label: "Vía del Mevalonato",
          sublabel: "Acetil-CoA → Colesterol",
          shape: "pill",
          color: "peach",
          title: "Vía del Mevalonato",
          bullets: [
            "Ruta: Acetil-CoA → HMG-CoA → Mevalonato → Colesterol.",
            "HMG-CoA reductasa (HMGCR): HMG-CoA → Mevalonato.",
          ],
          clinicalTip:
            "Enzima limitante de la vía. Las estatinas inhiben la HMGCR, disminuyendo el colesterol pero pudiendo comprometer la síntesis de testosterona.",
          obesitySignal: "↓ SHBG · ↓ testosterona total",
          obesityBullets: [
            "Obesidad clase I–II (IMC 30–<40): ↓ testosterona total hasta ~50% vs controles; testosterona libre (diálisis de equilibrio) no baja (Grossmann 2018).",
            "Interpretado como ↓ SHBG, no defecto de síntesis: GnRH, clomifeno y hCG muestran respuesta hipofisaria y testicular normal.",
          ],
          obesityTip:
            "Antes de atribuir hipogonadismo solo a obesidad, descarta patología clásica del eje HPT. Estilo de vida es primera línea.",
        },
        {
          id: "inicio-esteroidogenesis",
          label: "Inicio esteroideogénesis",
          sublabel: "Mitocondria",
          shape: "circle",
          color: "mint",
          title: "Inicio de Esteroideogénesis (Mitocondria)",
          bullets: [
            "Ruta: Colesterol → Pregnenolona.",
            "CYP11A1 (P450scc): Colesterol → Pregnenolona.",
          ],
          clinicalTip:
            "Es el principal cuello de botella de la esteroideogénesis y ocurre exclusivamente dentro de la mitocondria celular.",
          obesitySignal: "↓ Eje HPT · Citocinas",
          obesityBullets: [
            "Obesidad clase III (IMC ≥40): ↓ testosterona libre; gonadotropinas iguales o ↓ vs controles; ↓ amplitud de pulsos de LH (Grossmann 2018).",
            "Supresión funcional del eje HPT mediada por citocinas proinflamatorias y señalización alterada de leptina.",
          ],
          obesityTip:
            "En obesidad marcada hay hipogonadismo bioquímico genuino, pero reversible con pérdida de peso (p. ej. cirugía bariátrica).",
        },
        {
          id: "produccion-androgenos",
          label: "Producción andrógenos",
          sublabel: "Retículo endoplásmico",
          shape: "rounded",
          color: "mauve",
          title: "Producción de Andrógenos (Retículo Endoplásmico)",
          bullets: [
            "Ruta: Pregnenolona → DHEA → Androstenediona → Testosterona.",
            "CYP17A1: 17α-OH-pregnenolona → DHEA.",
            "3β-HSD2: DHEA → Androstenediona.",
            "17β-HSD3: Androstenediona → Testosterona.",
          ],
          clinicalTip:
            "La conversión final a testosterona requiere de estas deshidrogenasas ubicadas en el retículo endoplásmico liso.",
          obesitySignal: "↓ LH · Leptina ↓ Leydig",
          obesityBullets: [
            "↓ LH → menos estímulo a células de Leydig (3β-HSD2, 17β-HSD3).",
            "Leptina inhibe secreción basal y estimulada por hCG en Leydig; citocinas también suprimen a nivel testicular (Grossmann 2018).",
          ],
          obesityTip:
            "La leptina se correlaciona inversamente con respuesta testicular al hCG — resistencia central + inhibición periférica.",
        },
        {
          id: "aromatizacion-periferica",
          label: "Aromatización periférica",
          sublabel: "Tejido adiposo",
          shape: "rounded",
          color: "lilac",
          title: "Activación y Aromatización Periférica (Tejido Adiposo)",
          bullets: [
            "Ruta: Testosterona → 5α-DHT / Estradiol.",
            "5α-reductasa: Testosterona → 5α-DHT.",
            "Aromatasa (CYP19A1): Testosterona → Estradiol.",
          ],
          clinicalTip:
            "La 5α-reductasa genera un andrógeno más potente (5α-DHT). La aromatasa se expresa abundantemente en tejido adiposo; a mayor porcentaje de masa grasa, mayor conversión de andrógenos a estrógenos.",
          obesitySignal: "Testosterona → E2 · Feedback HPT",
          obesityBullets: [
            "Tejido adiposo: aromatasa convierte testosterona en estradiol; posible feedback negativo central sobre el eje HPT (papel patogénico aún no resuelto).",
            "Pérdida de peso y cirugía bariátrica reactivan el eje HPT; estilo de vida y optimización de comorbilidades son primera línea (Grossmann 2018).",
          ],
          obesityTip:
            "La relación obesidad–testosterona es bidireccional, pero la obesidad impacta más la testosterona que al revés.",
        },
      ],
      abbreviations: {
        HMGCR: {
          acronym: "HMGCR",
          fullName: "HMG-CoA reductasa",
          what: "Enzima limitante de la vía del mevalonato.",
          reaction: "HMG-CoA + 2 NADPH + 2 H⁺ → Mevalonato + 2 NADP⁺ + CoA",
          role: "Inhibida por estatinas; ↓ colesterol y puede ↓ síntesis de testosterona.",
        },
        "HMG-CoA": {
          acronym: "HMG-CoA",
          fullName: "3-hidroxi-3-metilglutaril coenzima A",
          what: "Intermediario entre acetil-CoA y mevalonato.",
          reaction: "2 Acetil-CoA → Acetoacetyl-CoA → HMG-CoA",
          role: "Sustrato directo de la HMG-CoA reductasa.",
        },
        "Acetil-CoA": {
          acronym: "Acetil-CoA",
          fullName: "Acetil coenzima A",
          what: "Precursor metabólico inicial de la vía del mevalonato.",
          reaction: "Acetil-CoA → HMG-CoA → Mevalonato → Colesterol",
          role: "Punto de partida de la síntesis de colesterol.",
        },
        CYP11A1: {
          acronym: "CYP11A1",
          fullName: "CYP11A1 (P450scc)",
          what: "Citocromo P450 mitocondrial; escisión de la cadena lateral del colesterol.",
          reaction: "Colesterol → Pregnenolona + isocaproaldehído",
          role: "Primer paso de esteroideogénesis; exclusivo de mitocondria.",
        },
        CYP17A1: {
          acronym: "CYP17A1",
          fullName: "P450 17α-hidroxilasa / 17,20-liasa",
          what: "Enzima del retículo liso en la vía androgénica.",
          reaction: "17α-OH-pregnenolona → DHEA + acetato",
          role: "Forma DHEA a partir de pregnenolona hidroxilada.",
        },
        "3β-HSD2": {
          acronym: "3β-HSD2",
          fullName: "3β-hidroxiesteroide deshidrogenasa tipo 2",
          what: "Deshidrogenasa del retículo endoplásmico liso.",
          reaction: "DHEA → Androstenediona",
          role: "Convierte DHEA en androstenediona en la vía androgénica.",
        },
        "17β-HSD3": {
          acronym: "17β-HSD3",
          fullName: "17β-hidroxiesteroide deshidrogenasa tipo 3",
          what: "Deshidrogenasa de células de Leydig.",
          reaction: "Androstenediona → Testosterona",
          role: "Paso final de producción de testosterona en retículo liso.",
        },
        DHEA: {
          acronym: "DHEA",
          fullName: "Dehidroepiandrosterona",
          what: "Andrógeno intermedio en el retículo endoplásmico.",
          reaction: "17α-OH-pregnenolona → DHEA (vía CYP17A1)",
          role: "Precursor de androstenediona y testosterona.",
        },
        "5α-reductasa": {
          acronym: "5α-reductasa",
          fullName: "5α-reductasa (SRD5A)",
          what: "Enzima periférica que activa testosterona a un andrógeno más potente.",
          reaction: "Testosterona → 5α-DHT",
          role: "Activa en piel, próstata y folículo piloso.",
        },
        Aromatasa: {
          acronym: "Aromatasa",
          fullName: "Aromatasa (CYP19A1)",
          what: "Citocromo P450 que convierte andrógenos en estrógenos.",
          reaction: "Testosterona → Estradiol",
          role: "Muy expresada en tejido adiposo; ↑ con mayor masa grasa.",
        },
        CYP19A1: {
          acronym: "CYP19A1",
          fullName: "Aromatasa (CYP19A1)",
          what: "Mismo enzima que aromatasa; aromatización periférica.",
          reaction: "Testosterona → Estradiol",
          role: "Clave en obesidad y SOP: más grasa = más estrógenos.",
        },
        "5α-DHT": {
          acronym: "5α-DHT",
          fullName: "5α-dihidrotestosterona",
          what: "Andrógeno más potente formado por 5α-reductasa.",
          reaction: "Testosterona → 5α-DHT (5α-reductasa)",
          role: "Mayor afinidad por AR que la testosterona.",
        },
        Testosterona: {
          acronym: "Testosterona",
          fullName: "Testosterona",
          what: "Andrógeno principal producido en células de Leydig.",
          reaction: "Androstenediona → Testosterona (17β-HSD3)",
          role: "Sustrato para 5α-DHT y estradiol en tejidos periféricos.",
        },
      },
    },
    obesity: {
      source: {
        full: "Grossmann (2018) Clinical Endocrinology — Hypogonadism and male obesity: Focus on unresolved questions.",
        doi: "10.1111/cen.13723",
      },
      extraAbbreviations: {
        SHBG: {
          acronym: "SHBG",
          fullName: "Globulina fijadora de hormonas sexuales",
          what: "Proteína transportadora que une testosterona y estradiol en sangre.",
          role: "↓ en obesidad → ↓ testosterona total; testosterona libre puede ser normal en obesidad modesta.",
        },
        LH: {
          acronym: "LH",
          fullName: "Hormona luteinizante",
          what: "Gonadotropina hipofisaria que estimula células de Leydig.",
          role: "↓ pulsos y amplitud de LH en obesidad marcada (IMC ≥40).",
        },
        HPT: {
          acronym: "HPT",
          fullName: "Eje hipotálamo-hipófisis-testicular",
          what: "Eje neuroendocrino que regula la producción de testosterona.",
          role: "Suprimido funcionalmente por obesidad; reversible con pérdida de peso.",
        },
        Leptina: {
          acronym: "Leptina",
          fullName: "Leptina",
          what: "Adipocina proporcional a la masa grasa; promueve saciedad fisiológicamente.",
          role: "Obesidad = resistencia central + inhibición testicular → supresión del eje HPT.",
        },
        IMC: {
          acronym: "IMC",
          fullName: "Índice de masa corporal",
          what: "Peso (kg) / talla² (m²). Clase III = IMC ≥40 kg/m².",
          role: "Obesidad marcada requerida para suprimir testosterona libre en varones jóvenes sanos.",
        },
        Leydig: {
          acronym: "Leydig",
          fullName: "Células de Leydig",
          what: "Células testiculares productoras de testosterona.",
          role: "Inhibidas por leptina y citocinas en obesidad.",
        },
        Estradiol: {
          acronym: "Estradiol",
          fullName: "Estradiol (E2)",
          what: "Estrógeno formado por aromatización de testosterona en tejido adiposo.",
          reaction: "Testosterona → Estradiol (aromatasa)",
          role: "Posible feedback negativo sobre el eje HPT; papel patogénico aún en estudio.",
        },
        GnRH: {
          acronym: "GnRH",
          fullName: "Hormona liberadora de gonadotropina",
          what: "Neurohormona hipotalámica que estimula LH y FSH.",
          role: "Secreción inhibida por citocinas y disfunción de señales metabólicas en obesidad.",
        },
        hCG: {
          acronym: "hCG",
          fullName: "Gonadotropina coriónica humana",
          what: "Análogo de LH usado en pruebas de estimulación testicular.",
          role: "Respuesta testicular al hCG inversamente correlacionada con leptina.",
        },
      },
    },
    muscle: {
      source: {
        full: "Dubois et al. (2012) Cell. Mol. Life Sci. — Androgens and skeletal muscle: cellular and molecular action mechanisms underlying the anabolic actions.",
        doi: "10.1007/s00018-011-0883-3",
      },
      diagram: {
        rows: [
          ["union-receptor-ar"],
          ["accion-genomica"],
          ["crosstalk-anabolico"],
          ["hipertrofia-muscular"],
        ],
        connections: [
          { from: "union-receptor-ar", to: "accion-genomica", label: "translocación" },
          { from: "accion-genomica", to: "crosstalk-anabolico", label: "transcripción" },
          { from: "crosstalk-anabolico", to: "hipertrofia-muscular", label: "señalización" },
        ],
      },
      steps: [
        {
          id: "union-receptor-ar",
          label: "Unión al AR",
          sublabel: "Miofibra · Células satélite",
          shape: "pill",
          color: "sky",
          title: "Unión de andrógenos al receptor de andrógenos (AR)",
          bullets: [
            "Ruta: Testosterona / dihidrotestosterona → AR citosólico → dímero → núcleo.",
            "AR + coactivadores → unión a elementos de respuesta androgénica (ARE).",
            "Blancos celulares: células satélite, mionúcleos; también precursores mesenquimales y motoneuronas.",
          ],
          clinicalTip:
            "Músculos perineales (levator ani) expresan más AR que EDL; eso explica diferente respuesta anabólica entre grupos musculares.",
        },
        {
          id: "accion-genomica",
          label: "Acción genómica",
          sublabel: "ARE · MyomiRs · Poliaminas",
          shape: "circle",
          color: "mint",
          title: "Transcripción génica y regulación por AR",
          bullets: [
            "Unión directa a ARE o reclutamiento indirecto vía Mef2, SRF y TCF.",
            "Genes diana: factores mioespecíficos, proteínas estructurales del sarcómero, myomiRs (miR-206, miR-133, miR-221, miR-222).",
            "↑ Odc1 y Amd1 → poliaminas (putrescina, espermidina) → proliferación y diferenciación miógena.",
          ],
          clinicalTip:
            "La acción anabólica no es solo AR clásico: incluye microARNs musculares (myomiRs) que modulan traducción y retroalimentación.",
        },
        {
          id: "crosstalk-anabolico",
          label: "Crosstalk anabólico",
          sublabel: "PI3K/Akt · IGF-I · Mst",
          shape: "rounded",
          color: "mauve",
          title: "Crosstalk con vías de señalización anabólica",
          bullets: [
            "AR interactúa con p85 de PI3K → fosforilación de Akt → mTOR y p70S6K → ↑ síntesis proteica.",
            "Akt inhibe FoxO → ↓ MuRF-1 y MAFbx → ↓ degradación proteica vía proteasoma.",
            "↓ expresión/actividad de miostatina (Mst); ↑ IGF-I local (IGF-IEa); ↑ señal Notch en células satélite.",
          ],
          clinicalTip:
            "Myostatina bloquea proliferación y revierte PI3K/Akt; los andrógenos la reprimen vía AR y vía β-catenina/follistatina.",
        },
        {
          id: "hipertrofia-muscular",
          label: "Hipertrofia muscular",
          sublabel: "Proteínas · Fibra · Satélite",
          shape: "rounded",
          color: "sage",
          title: "Efecto anabólico final en músculo esquelético",
          bullets: [
            "↑ síntesis proteica muscular y reciclaje de aminoácidos intracelulares; tratamiento prolongado ↓ degradación.",
            "Hipertrofia de fibras tipo I y II: ↑ número de mionúcleos, área de sección transversal y células satélite.",
            "Efectos no genómicos rápidos: ↑ Ca²⁺ intracelular, MAPK/ERK, vía c-Src y EGFR en fibra muscular.",
          ],
          clinicalTip:
            "Relevante clínicamente en sarcopenia, caquexia y fragilidad del anciano; masa magra puede mejorar sin cambios claros en fuerza máxima en todos los ensayos.",
        },
      ],
      abbreviations: {
        AR: {
          acronym: "AR",
          fullName: "Receptor de andrógenos",
          what: "Receptor nuclear ligando-inducible; factor de transcripción activado por testosterona y dihidrotestosterona.",
          role: "Mediador principal de acciones genómicas anabólicas en músculo esquelético.",
        },
        ARE: {
          acronym: "ARE",
          fullName: "Elemento de respuesta androgénica",
          what: "Secuencia de ADN donde se une el complejo AR-coactivadores.",
          role: "Regula transcripción de genes mioespecíficos y myomiRs.",
        },
        PI3K: {
          acronym: "PI3K",
          fullName: "Fosfatidilinositol 3-quinasa",
          what: "Enzima activada por AR (subunidad p85) e IGF-I.",
          reaction: "Fosforilación de PIP2 → PIP3 → activación de Akt",
          role: "Vía central del efecto anabólico: síntesis proteica y bloqueo de atrofia.",
        },
        Akt: {
          acronym: "Akt",
          fullName: "Proteína quinasa B (Akt/PKB)",
          what: "Serina/treonina quinasa downstream de PI3K.",
          role: "Activa mTOR/p70S6K (↑ síntesis) e inhibe FoxO (↓ atrofia).",
        },
        mTOR: {
          acronym: "mTOR",
          fullName: "Diana mamífera de rapamicina",
          what: "Quinasa que integra señales nutricionales y de crecimiento.",
          role: "↑ traducción y síntesis proteica muscular tras activación por Akt.",
        },
        "IGF-I": {
          acronym: "IGF-I",
          fullName: "Factor de crecimiento insulin-like I",
          what: "Factor de crecimiento local y sistémico en músculo esquelético.",
          role: "Andrógenos ↑ IGF-IEa muscular; IGF-I activa PI3K/Akt y potencia AR.",
        },
        Mst: {
          acronym: "Mst",
          fullName: "Myostatina",
          what: "Miembro de TGF-β; regulador negativo del crecimiento muscular.",
          role: "Inhibida por andrógenos; bloquea proliferación y vía PI3K/Akt.",
        },
        "MuRF-1": {
          acronym: "MuRF-1",
          fullName: "Muscle Ring Finger 1",
          what: "Ligasa de ubiquitina específica de músculo (atroginas).",
          role: "Inducida por FoxO; promueve degradación proteica — inhibida por Akt.",
        },
        MAFbx: {
          acronym: "MAFbx",
          fullName: "Muscle Atrophy F-box (atrogin-1)",
          what: "Ligasa E3 ubiquitina ligada a atrofia muscular.",
          role: "↑ en atrofia; ↓ cuando Akt inhibe FoxO tras estímulo androgénico.",
        },
        FoxO: {
          acronym: "FoxO",
          fullName: "Forkhead box O",
          what: "Familia de factores de transcripción regulados por Akt.",
          role: "Fosforilación por Akt → salida del núcleo → ↓ transción de atroginas.",
        },
        Mef2: {
          acronym: "Mef2",
          fullName: "Myocyte enhancer factor 2",
          what: "Factor de transcripción MADS-box en músculo.",
          role: "Recluta AR a enhancers musculares (tethering indirecto al ADN).",
        },
        SRF: {
          acronym: "SRF",
          fullName: "Serum response factor",
          what: "Factor de transcripción que une elementos SRE.",
          role: "Reclutamiento indirecto del AR; regulado por myomiRs.",
        },
        Notch: {
          acronym: "Notch",
          fullName: "Vía Notch",
          what: "Señalización celular esencial para células satélite.",
          role: "↑ por testosterona; restaura capacidad regenerativa en músculo envejecido.",
        },
        Follistatina: {
          acronym: "Follistatina",
          fullName: "Follistatina (Fst)",
          what: "Proteína antagonista de myostatina.",
          role: "↑ por señal β-catenina potenciada por andrógenos → ↓ actividad de Mst.",
        },
        DHT: {
          acronym: "DHT",
          fullName: "Dihidrotestosterona",
          what: "Andrógeno más potente formado por 5α-reductasa.",
          role: "Ligando AR clave en estudios de unión génica en mioblastos.",
        },
        Testosterona: {
          acronym: "Testosterona",
          fullName: "Testosterona",
          what: "Principal andrógeno en músculo esquelético humano.",
          role: "Aumenta tamaño y fuerza muscular vía acciones genómicas y no genómicas.",
        },
      },
    },
    cardiovascular: {
      source: {
        full: "Thirumalai & Anawalt (2022) Rev Endocr Metab Disord. — Relationships between endogenous and exogenous testosterone and cardiovascular disease in men.",
        doi: "10.1007/s11154-022-09752-7",
      },
      diagram: {
        rows: [
          ["testosterona-endogena"],
          ["terapia-reemplazo"],
          ["desenlaces-especificos"],
          ["balance-clinico"],
        ],
        connections: [
          { from: "testosterona-endogena", to: "terapia-reemplazo", label: "evidencia" },
          { from: "terapia-reemplazo", to: "desenlaces-especificos", label: "seguimiento" },
          { from: "desenlaces-especificos", to: "balance-clinico", label: "interpretación" },
        ],
      },
      steps: [
        {
          id: "testosterona-endogena",
          label: "Testosterona endógena",
          sublabel: "Cohortes · Metabolitos",
          shape: "pill",
          color: "coral",
          title: "Testosterona endógena y riesgo cardiovascular",
          bullets: [
            "Cohortes prospectivas (5–15 años): sin asociación o relación inversa entre testosterona sérica y eventos CV compuestos, muerte cardiovascular y mortalidad total.",
            "Metabolitos: dihidrotestosterona y estradiol — resultados mixtos; SHBG alto puede asociarse a más eventos CV en algunos estudios.",
            "Causalidad inversa: edad, obesidad y comorbilidades ↓ testosterona y ↑ riesgo CV — la hormona puede ser marcador, no causa.",
          ],
          clinicalTip:
            "La testosterona endógena no es un «tóxico cardiovascular»; tampoco es panacea. Los estudios observacionales generan hipótesis, no prueba causal.",
        },
        {
          id: "terapia-reemplazo",
          label: "Terapia de reemplazo",
          sublabel: "Dosis fisiológicas · RCTs",
          shape: "circle",
          color: "teal",
          title: "Terapia con testosterona y eventos cardiovasculares mayores",
          bullets: [
            "Farmacoepidemiología (bases grandes): mayoría sin asociación con IAM, ACV isquémico o tromboembolia venosa; algunos estudios muestran ↓ mortalidad.",
            "RCTs placebo-controlados (1–3 años): sin ↑ incidencia de eventos CV mayores a dosis de reemplazo; T Trials — 7 vs 7 eventos durante tratamiento.",
            "Limitaciones: pocos participantes, seguimiento corto y adjudicación heterogénea de eventos.",
          ],
          clinicalTip:
            "Evitar dosis suprafisiológicas en varones no hipogonadales. La evidencia actual es tranquilizadora para reemplazo fisiológico en hipogonadismo auténtico.",
        },
        {
          id: "desenlaces-especificos",
          label: "Desenlaces específicos",
          sublabel: "IAM · ACV · TEP · IC · FA",
          shape: "rounded",
          color: "lavender",
          title: "Infarto, stroke, trombosis, insuficiencia cardíaca y arritmia",
          bullets: [
            "Infarto de miocardio y ACV: datos actuales no muestran asociación consistente con testosterona endógena ni con terapia de reemplazo.",
            "Tromboembolia venosa (TEP/TVP): metaanálisis clínicos — terapia de reemplazo no asociada a ↑ TEP; cautela en trombofilia.",
            "Insuficiencia cardíaca y fibrilación auricular: evidencia mixta; efectos grandes poco probables.",
          ],
          clinicalTip:
            "Poblaciones de alto riesgo (IAM reciente, ACV, TEP idiopática recurrente): evidencia insuficiente — evaluar riesgo–beneficio caso a caso.",
        },
        {
          id: "balance-clinico",
          label: "Balance clínico",
          sublabel: "Mecanismos · Decisión",
          shape: "rounded",
          color: "yellow",
          title: "Mecanismos potenciales y recomendación clínica",
          bullets: [
            "Posibles efectos adversos: ↓ HDL, eritrocitosis/viscosidad, retención hidrosalina.",
            "Posibles efectos favorables: ↓ lipoproteína(a), vasodilatación coronaria, mejor función cardíaca, ↓ masa grasa.",
            "Abuso de andrógenos a dosis altas: asociado en reportes a IAM, ACV, HTA y dislipidemia (confusores: tabaco, otras drogas).",
          ],
          clinicalTip:
            "En hipogonadismo auténtico, beneficios suelen superar riesgo CV potencial. Testosterona no es veneno ni cura universal para el corazón (Thirumalai & Anawalt 2022).",
        },
      ],
      abbreviations: {
        IAM: {
          acronym: "IAM",
          fullName: "Infarto agudo de miocardio",
          what: "Necrosis miocárdica por isquemia aguda.",
          role: "Desenlace CV estudiado en cohortes y farmacoepidemiología de testosterona.",
        },
        ACV: {
          acronym: "ACV",
          fullName: "Accidente cerebrovascular",
          what: "Evento isquémico o hemorrágico en el sistema nervioso central.",
          role: "Estudios: sin asociación o relación inversa con testosterona endógena.",
        },
        TEP: {
          acronym: "TEP",
          fullName: "Tromboembolia pulmonar",
          what: "Obstrucción arterial pulmonar por trombo, parte del espectro de TEV.",
          role: "Terapia de reemplazo: metaanálisis no muestran ↑ riesgo en dosis habituales.",
        },
        TEV: {
          acronym: "TEV",
          fullName: "Tromboembolia venosa",
          what: "Incluye trombosis venosa profunda y tromboembolia pulmonar.",
          role: "Controversia FDA 2014; evidencia posterior mayormente tranquilizadora.",
        },
        SHBG: {
          acronym: "SHBG",
          fullName: "Globulina fijadora de hormonas sexuales",
          what: "Transporta testosterona, dihidrotestosterona y estradiol.",
          role: "Concentraciones altas asociadas a más eventos CV en algunos estudios.",
        },
        DHT: {
          acronym: "DHT",
          fullName: "Dihidrotestosterona",
          what: "Metabolito activo de testosterona vía 5α-reductasa.",
          role: "Cohortes: niveles más altos a veces asociados a ↓ mortalidad CV.",
        },
        HDL: {
          acronym: "HDL",
          fullName: "Lipoproteína de alta densidad",
          what: "Colesterol transportado hacia el hígado («colesterol bueno»).",
          role: "Testosterona puede ↓ HDL — mecanismo potencial adverso.",
        },
        IC: {
          acronym: "IC",
          fullName: "Insuficiencia cardíaca",
          what: "Incapacidad del corazón para bombear sangre de forma eficaz.",
          role: "Testosterona baja puede ser marcador de mal pronóstico; rol causal incierto.",
        },
        FA: {
          acronym: "FA",
          fullName: "Fibrilación auricular",
          what: "Arritmia supraventricular común.",
          role: "Estudios prospectivos con resultados mixtos respecto a testosterona.",
        },
        HPT: {
          acronym: "HPT",
          fullName: "Eje hipotálamo-hipófisis-testicular",
          what: "Eje que regula producción de testosterona.",
          role: "Hipogonadismo auténtico requiere trastorno identificado del eje HPT.",
        },
        RCT: {
          acronym: "RCT",
          fullName: "Ensayo controlado aleatorizado",
          what: "Diseño experimental gold standard para confirmar hipótesis.",
          role: "RCTs de testosterona limitados en tamaño y duración para desenlaces CV.",
        },
        Testosterona: {
          acronym: "Testosterona",
          fullName: "Testosterona",
          what: "Andrógeno principal en varones; endógena o exógena (terapia).",
          role: "Efectos CV dependen de concentración, dosis terapéutica y contexto clínico.",
        },
        Estradiol: {
          acronym: "Estradiol",
          fullName: "Estradiol",
          what: "Metabolito estrogénico de testosterona (aromatización).",
          role: "En varones, estudios de cohorte muestran asociaciones mixtas con desenlaces CV.",
        },
      },
    },
    aging: {
      source: {
        full: "Anawalt & Matsumoto (2022) Rev Endocr Metab Disord. — Aging and androgens: Physiology and clinical implications.",
        doi: "10.1007/s11154-022-09765-2",
      },
      diagram: {
        rows: [
          ["eje-hpt-envejecido"],
          ["hipogonadismo-secundario"],
          ["hipogonadismo-primario"],
          ["manejo-clinico-aging"],
        ],
        connections: [
          { from: "eje-hpt-envejecido", to: "hipogonadismo-secundario", label: "↓ GnRH" },
          { from: "hipogonadismo-secundario", to: "hipogonadismo-primario", label: "edad >70" },
          { from: "hipogonadismo-primario", to: "manejo-clinico-aging", label: "decisión" },
        ],
      },
      steps: [
        {
          id: "eje-hpt-envejecido",
          label: "Eje HPT envejecido",
          sublabel: "GnRH · LH · Leydig",
          shape: "pill",
          color: "peach",
          title: "Cambios fisiológicos del eje hipotálamo-hipófisis-testicular",
          bullets: [
            "Desde la 4.ª década: ↓ testosterona total y libre por ↓ flujo de GnRH (33–50% estimado edad 20→80) y menor respuesta de células de Leydig a LH.",
            "LH suele permanecer en rango normal incluso con testosterona baja (~10–20% de ancianos); tras ~70 años ↑ proporción con LH elevada.",
            "Pérdida del ritmo circadiano de testosterona en la 7.ª década; ↓ kisspeptina y cambios en neuronas neurokinina B.",
          ],
          clinicalTip:
            "El envejecimiento afecta hipotálamo y testículos a la vez; no asumir que toda testosterona baja en el anciano es «normal» sin evaluar síntomas y gonadotropinas.",
        },
        {
          id: "hipogonadismo-secundario",
          label: "Hipogonadismo secundario",
          sublabel: "LH normal · Reversible",
          shape: "circle",
          color: "lilac",
          title: "Hipogonadismo bioquímico secundario en el anciano",
          bullets: [
            "Perfil: testosterona baja + LH no elevada (inapropiadamente «normal»); 4–5× más frecuente que el primario entre 40–79 años (EMAS).",
            "Principal factor: obesidad (IMC ≥30 OR >7); también opioides, glucocorticoides y enfermedad sistémica que ↓ GnRH/LH.",
            "Recuperación espontánea en ~43% (EMAS): predictores — IMC <30, edad <60, pérdida de peso y mejor salud general.",
          ],
          clinicalTip:
            "En anciano con IMC ≥30 y sin patología hipofisaria: priorizar ↓ peso y salud metabólica antes de terapia con testosterona.",
        },
        {
          id: "hipogonadismo-primario",
          label: "Hipogonadismo primario",
          sublabel: "LH elevada · >65–70 años",
          shape: "rounded",
          color: "mint",
          title: "Hipogonadismo bioquímico primario y compensado",
          bullets: [
            "Prevalencia 2–7% en hombres ≥70 años: testosterona baja + LH elevada; disfunción progresiva de Leydig, en general irreversible.",
            "Hipogonadismo primario compensado: LH alta con testosterona normal (~9,5% EMAS); peor salud, función sexual y física; evitar TRT hasta caída de testosterona.",
            "Estradiol puede ↑ en la 7.ª década (↓ aromatización periférica); posible retroalimentación negativa sobre GnRH vía kisspeptina.",
          ],
          clinicalTip:
            "Primario persistente: evaluar como en varón joven con hipogonadismo primario. Compensado: tratar comorbilidades, no rutinar testosterona.",
        },
        {
          id: "manejo-clinico-aging",
          label: "Manejo clínico",
          sublabel: "Metabolismo · Dosis · Tipo",
          shape: "rounded",
          color: "slate",
          title: "Implicaciones clínicas del envejecimiento androgénico",
          bullets: [
            "↓ metabolismo de testosterona y ↑ sensibilidad androgénica tisular → dosis de reemplazo más bajas suelen ser eficaces y más seguras.",
            "Tipología útil: primario vs secundario, reversible vs irreversible — evitar el término vago «hipogonadismo tardío» como indicación automática de TRT.",
            "Testosterona libre ↓ más que la total; SHBG ↑ con edad pero obesidad ↓ SHBG — en anciano delgado la caída de libre es más marcada.",
          ],
          clinicalTip:
            "Integrar síntomas, dos muestras matutinas de testosterona + LH/FSH, IMC y comorbilidades. Secundario reversible: estilo de vida; primario: considerar reemplazo (Anawalt & Matsumoto 2022).",
        },
      ],
      abbreviations: {
        GnRH: {
          acronym: "GnRH",
          fullName: "Hormona liberadora de gonadotropinas",
          what: "Neurohormona hipotalámica que estimula LH y FSH.",
          role: "↓ flujo pulsátil con el envejecimiento → ↓ estimulación de Leydig.",
        },
        LH: {
          acronym: "LH",
          fullName: "Hormona luteinizante",
          what: "Gonadotropina hipofisaria que estimula esteroidogénesis testicular.",
          role: "LH normal con testosterona baja = secundario; LH alta = primario.",
        },
        SHBG: {
          acronym: "SHBG",
          fullName: "Globulina fijadora de hormonas sexuales",
          what: "Proteína transportadora de testosterona y estradiol.",
          role: "↑ con edad en varones delgados → ↓ testosterona libre desproporcionada.",
        },
        HPT: {
          acronym: "HPT",
          fullName: "Eje hipotálamo-hipófisis-testicular",
          what: "Eje neuroendocrino que regula producción de testosterona y espermatogénesis.",
          role: "Todo el eje se altera con la edad: hipotálamo, hipófisis y células de Leydig.",
        },
        BMI: {
          acronym: "BMI",
          fullName: "Índice de masa corporal",
          what: "Peso (kg) / talla² (m²); proxy de adiposidad.",
          role: "IMC ≥30 es el principal factor de hipogonadismo secundario en ancianos.",
        },
        Kisspeptina: {
          acronym: "Kisspeptina",
          fullName: "Kisspeptina",
          what: "Péptido hipotalámico estimulador de GnRH.",
          role: "Regulador clave; cambios en neuronas kisspeptina/NKB con envejecimiento.",
        },
        DHT: {
          acronym: "DHT",
          fullName: "Dihidrotestosterona",
          what: "Andrógeno potente por acción de 5α-reductasa.",
          role: "Declina con la edad; metabolismo alterado en ancianos.",
        },
        Estradiol: {
          acronym: "Estradiol",
          fullName: "Estradiol",
          what: "Esteroide estrogénico; en varones proviene de aromatización de testosterona.",
          role: "Puede ↑ en 7.ª década; posible inhibición de GnRH vía kisspeptina.",
        },
        EMAS: {
          acronym: "EMAS",
          fullName: "European Male Ageing Study",
          what: "Estudio europeo longitudinal en varones 40–79 años.",
          role: "Referencia clave para prevalencia de hipogonadismo primario y secundario.",
        },
        Testosterona: {
          acronym: "Testosterona",
          fullName: "Testosterona",
          what: "Andrógeno principal; declina gradualmente desde ~35 años.",
          role: "Evaluar total, libre y contexto clínico; no tratar solo el número.",
        },
      },
    },
  },
};
