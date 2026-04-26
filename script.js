const GAS_URL = "https://script.google.com/macros/s/AKfycbxrjVvPkjC83NB1krzh_F8oeGk_JQNZJFtlY9-ycBZTN0aUFZXKJcbPEsgx9RWv0j7W/exec";
const MODULO_CORRECTO = 'Soldadura en Atmósfera Protegida (SAP)';
const MAX_QUESTIONS = 10;
const TIME_LIMIT = 25;

const metalMat = new THREE.MeshStandardMaterial({ 
  color: 0xf1f5f9,        // Gris muy claro (plata mate / dibujo)
  metalness: 0.05, 
  roughness: 0.9, 
  side: THREE.DoubleSide
});
const edgeMat = new THREE.LineBasicMaterial({ color: 0x0f172a }); // Negro casi puro, trazado fuerte

function drawProfile(points, x, y) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for(let i=1; i<points.length; i++) shape.lineTo(points[i][0], points[i][1]);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 250, bevelEnabled: false });
  const mesh = new THREE.Mesh(geo, metalMat);
  mesh.position.set(x, y, -125);
  mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));
  return mesh;
}

const bordsData = {
  "i": {
    name: "Bordes rectos",
    badge: "Tipo I",
    params: ["Sin bisel", "Espesor < 3mm", "Económica"],
    desc: "Chaflán con bordes rectos o sin preparación de bordes.",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>Bordes rectos [Square groove weld]:</b> Unión a tope sin preparación especial en los bordes. Es la geometría más económica al eliminar el biselado mecanizado.<br><br><b>Aplicación crítica:</b> Limitada a chapas de espesor fino (generalmente < 3 mm). En espesores mayores, la falta de apertura [Root opening] impide que el arco alcance la zona inferior, causando una falta de penetración total [Incomplete joint penetration].`,
    questions: [
      { text: "¿Cuál es el espesor máximo recomendado para una unión tipo I?", options: ["Alrededor de 3 mm", "Alrededor de 15 mm", "Cualquier espesor", "Superior a 50 mm"], correct: "Alrededor de 3 mm", hint: "Más de 3mm suele requerir biselar para que la fusión llegue al fondo." },
      { text: "¿A qué ángulo se cortan los bordes en una preparación tipo I?", options: ["90° (Corte recto)", "45° (Bisel simple)", "60° (V de ranura)", "30° (Bisel agudo)"], correct: "90° (Corte recto)", hint: "No hay chaflán, los bordes quedan perpendiculares a la chapa." }
    ],
    build: (group) => {
      group.add(drawProfile([ [-80,0], [0,0], [0,10], [-80,10] ], -1, -5));
      group.add(drawProfile([ [0,0], [80,0], [80,10], [0,10], [0,0] ], 1, -5));
    }
  },
  "y": {
    name: "Bisel simple (Y)",
    badge: "Tipo Y",
    params: ["Una cara biselada", "Una cara recta", "Acceso asimétrico"],
    desc: "Chaflán en V simple o en Y (solo una pieza biselada).",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>Bisel simple [Single-bevel groove weld]:</b> Preparación asimétrica donde solo una de las piezas es mecanizada con un ángulo de bisel [Bevel angle], mientras la otra permanece recta a 90°.<br><br><b>Aplicación técnica:</b> Se utiliza frecuentemente en uniones en T o cuando el acceso a una de las piezas está restringido. Presenta una cara de la raíz [Root face] y una separación [Root gap] para facilitar la penetración.`,
    questions: [
      { text: "¿Qué caracteriza al Chaflán en Y o Bisel Simple?", options: ["Solo una de las piezas está biselada", "Ambas piezas se mantienen rectas", "Ambas piezas presentan biselado", "Las piezas están curvadas en frío"], correct: "Solo una de las piezas está biselada", hint: "En la Y, una cara 'guía' y la otra es el 'recipiente' del arco." },
      { text: "¿Cuál es el nombre alternativo del Chaflán en Y?", options: ["Bisel Simple", "Bisel Doble", "Borde Recto", "Canto Matado"], correct: "Bisel Simple", hint: "Se llama así porque solo se mecaniza un lado de la junta." }
    ],
    build: (group) => {
      group.add(drawProfile([ [-80,0], [0,0], [0,10], [-80,10] ], -1, -5));
      group.add(drawProfile([ [0,0], [80,0], [80,10], [6,10], [0,2], [0,0] ], 1, -5));
    }
  },
  "v": {
    name: "V simple",
    badge: "Tipo V",
    params: ["Ambas biseladas", "Ángulo 60-70°", "Piezas simétricas"],
    desc: "Chaflán en V simple (ambas piezas biseladas por una cara).",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>V simple [Single-V groove weld]:</b> Estándar universal de preparación simétrica por un solo lado. Ambas piezas se biselan formando un ángulo de ranura total [Groove angle] típicamente de 60°. <br><br><b>Talón de raíz [Root face]:</b> Se deja un pequeño borde sin achaflanar en la parte inferior para evitar que la primera pasada desfonde la junta por exceso de calor.`,
    questions: [
      { text: "¿Cuál es el ángulo de ranura total típico en una junta en V?", options: ["Entre 60° y 70°", "Entre 10° y 20°", "Casi 180 grados", "Exactamente 90°"], correct: "Entre 60° y 70°", hint: "Es el ángulo necesario para que el electrodo 'quepa' y funda las paredes." },
      { text: "¿Para qué sirve el 'talón de raíz' en una junta en V?", options: ["Evitar que el arco desfonde la junta", "Aumentar el peso final del conjunto", "Disipar el calor de la antorcha", "Mejorar el acabado estético final"], correct: "Evitar que el arco desfonde la junta", hint: "El talón da masa para que la primera pasada no haga un agujero." }
    ],
    build: (group) => {
      group.add(drawProfile([ [-80,0], [0,0], [0,2], [-6,10], [-80,10] ], -1, -5));
      group.add(drawProfile([ [0,0], [80,0], [80,10], [6,10], [0,2], [0,0] ], 1, -5));
    }
  },
  "x": {
    name: "V doble (X)",
    badge: "Tipo X",
    params: ["Doble bisel", "Ahorro material", "Espesores > 15mm"],
    desc: "Chaflán en V doble o en X (ambas piezas biseladas por dos caras).",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>V doble [Double-V groove weld]:</b> Preparación bilateral para grandes espesores que exige acceso por ambos lados de la estructura.<br><br><b>Ventaja estructural:</b> Reduce el volumen de metal de aportación [Filler metal] necesario y minimiza drásticamente la distorsión angular [Angular distortion] al equilibrar las tensiones térmicas soldando por ambas caras alternativamente.`,
    questions: [
      { text: "¿Qué ventaja tiene el bisel en X sobre el de V simple en grandes espesores?", options: ["Reduce el volumen de aporte y la distorsión", "Simplifica el proceso de amolado posterior", "Permite mayor velocidad por un solo lado", "Elimina la necesidad de gas de respaldo"], correct: "Reduce el volumen de aporte y la distorsión", hint: "Al soldar por ambos lados, las tensiones se equilibran." },
      { text: "¿Cuál es la principal restricción para usar una junta en X?", options: ["Requiere acceso por ambos lados de la junta", "Solo es aplicable en chapas de aluminio", "Está prohibida por la normativa vigente", "Impide el uso de electrodos revestidos"], correct: "Requiere acceso por ambos lados de la junta", hint: "Al ser doble bisel, hay que soldar por arriba y por abajo." }
    ],
    build: (group) => {
      group.add(drawProfile([ [-80,0], [-4,0], [0,4.5], [0,5.5], [-4,10], [-80,10] ], -1, -5));
      group.add(drawProfile([ [4,0], [80,0], [80,10], [4,10], [0,5.5], [0,4.5], [4,0] ], 1, -5));
    }
  },
  "j": {
    name: "J simple",
    badge: "Tipo J",
    params: ["Bisel curvo", "Una cara recta", "Mecanizado especial"],
    desc: "Chaflán en J simple (una pieza curva, la otra recta).",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>J simple [Single-J groove weld]:</b> Variante asimétrica avanzada donde la pieza mecanizada presenta un fondo redondeado [Root radius] en lugar de un vértice afilado.<br><br><b>Mecanizado:</b> Su coste de preparación es elevado, pero asegura una excelente penetración en la raíz en grandes espesores donde el espacio está restringido y no se puede abrir una V.`,
    questions: [
      { text: "¿Cómo es el fondo de la ranura en un bisel tipo J?", options: ["Curvado (Radio de raíz)", "Totalmente recto (Plano)", "En ángulo de 90 grados", "Abierto (Sin fondo real)"], correct: "Curvado (Radio de raíz)", hint: "La curva facilita que la raíz se funda sin atrapar escoria." },
      { text: "¿En qué se diferencia una J de una Y?", options: ["La J tiene fondo curvo mecanizado", "La Y tiene un coste más elevado", "La J se aplica de forma doble", "No existe diferencia técnica real"], correct: "La J tiene fondo curvo mecanizado", hint: "El mecanizado curvo (J) es más complejo que el recto (Y)." }
    ],
    build: (group) => {
      group.add(drawProfile([ [-80,0], [0,0], [0,10], [-80,10] ], -1, -5));
      const s = new THREE.Shape();
      s.moveTo(80,0); s.lineTo(2,0); s.lineTo(2,2); s.quadraticCurveTo(8,2, 10,10); s.lineTo(80,10);
      const p = new THREE.Mesh(new THREE.ExtrudeGeometry(s, {depth:250, bevelEnabled:false}), metalMat);
      p.position.set(1, -5, -125); p.add(new THREE.LineSegments(new THREE.EdgesGeometry(p.geometry), edgeMat));
      group.add(p);
    }
  },
  "u": {
    name: "U simple",
    badge: "Tipo U",
    params: ["Doble curva", "Máxima eficiencia", "Espesor crítico"],
    desc: "Chaflán en U simple (ambas piezas con bisel curvo).",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>U simple [Single-U groove weld]:</b> Geometría curva simétrica diseñada específicamente para espesores muy pesados.<br><br><b>Eficiencia de aportación:</b> Su principal ventaja es el ahorro masivo de metal de aportación respecto a una V en espesores altos, ya que las paredes curvas evitan que la parte superior de la ranura se abra excesivamente.`,
    questions: [
      { text: "¿Por qué se prefiere el bisel en U en espesores superiores a 30 mm?", options: ["Por el ahorro masivo de metal de aportación", "Por el acabado estético superior del cordón", "Porque no requiere mano de obra experta", "Porque el enfriamiento es mucho más veloz"], correct: "Por el ahorro masivo de metal de aportación", hint: "Ahorra peso de soldadura al no abrirse tanto en la parte superior." },
      { text: "¿Qué proceso previo suele requerir una preparación en U?", options: ["Mecanizado (Torneado o fresado)", "Corte térmico (Oxicorte manual)", "Desbaste mediante amolado rápido", "Forjado o martillado del borde"], correct: "Mecanizado (Torneado o fresado)", hint: "La forma curva precisa de máquinas herramientas de precisión." }
    ],
    build: (group) => {
      const s1 = new THREE.Shape();
      s1.moveTo(-80,0); s1.lineTo(-2,0); s1.lineTo(-2,2); s1.quadraticCurveTo(-8,2, -10,10); s1.lineTo(-80,10);
      const p1 = new THREE.Mesh(new THREE.ExtrudeGeometry(s1, {depth:250, bevelEnabled:false}), metalMat);
      p1.position.set(-1, -5, -125); p1.add(new THREE.LineSegments(new THREE.EdgesGeometry(p1.geometry), edgeMat));
      group.add(p1);
      const s2 = new THREE.Shape();
      s2.moveTo(80,0); s2.lineTo(2,0); s2.lineTo(2,2); s2.quadraticCurveTo(8,2, 10,10); s2.lineTo(80,10);
      const p2 = new THREE.Mesh(new THREE.ExtrudeGeometry(s2, {depth:250, bevelEnabled:false}), metalMat);
      p2.position.set(1, -5, -125); p2.add(new THREE.LineSegments(new THREE.EdgesGeometry(p2.geometry), edgeMat));
      group.add(p2);
    }
  },
  "k": {
    name: "Bisel doble (K)",
    badge: "Tipo K",
    params: ["Doble bisel", "Una cara recta", "Cargas extremas"],
    desc: "Chaflán en V simple o en K (una pieza doble biselada, la otra recta).",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>Bisel doble [Double-bevel groove weld]:</b> Preparación asimétrica bilateral. Una pieza se mecaniza por arriba y por abajo, mientras la pieza base permanece intacta a 90°.<br><br><b>Uso principal:</b> Es la junta reina en uniones en T de alto compromiso estructural sometidas a cargas dinámicas extremas [Dynamic loads] que requieren penetración completa [CJP].`,
    questions: [
      { text: "¿A cuántas piezas se les aplica el bisel en una junta en K?", options: ["A una sola de las piezas", "A ambas piezas de unión", "A ninguna de las piezas", "A tres piezas diferentes"], correct: "A una sola de las piezas", hint: "La otra pieza (la base) permanece recta (90º)." },
      { text: "¿En qué tipo de unión es más frecuente ver la preparación en K?", options: ["En uniones en T (Ángulo)", "En uniones a tope (Plano)", "En uniones solapadas (Traslape)", "En uniones de borde (Cantos)"], correct: "En uniones en T (Ángulo)", hint: "Se usa para que la pieza vertical penetre totalmente en la horizontal." }
    ],
    build: (group) => {
      group.add(drawProfile([ [-80,0], [0,0], [0,10], [-80,10] ], -1, -5));
      group.add(drawProfile([ [4,0], [80,0], [80,10], [4,10], [0,5.5], [0,4.5], [4,0] ], 1, -5));
    }
  },
  "jd": {
    name: "J doble",
    badge: "Tipo J Doble",
    params: ["Doble bisel curvo", "Una cara recta", "Grandes espesores"],
    desc: "Chaflán en J doble (una pieza recta, la otra con doble curva en J).",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>J doble [Double-J groove weld]:</b> Geometría avanzada que combina un lado recto y otro con doble curva bilateral.<br><br><b>Equilibrio de tensiones:</b> Obligatoria cuando un componente de muy alto espesor solo puede mecanizarse por una cara, pero las especificaciones de fatiga [Fatigue life] exigen soldadura bilateral para minimizar tensiones residuales [Residual stresses].`,
    questions: [
      { text: "¿Cuándo es obligatorio usar una preparación en J doble en lugar de J simple?", options: ["Cuando el espesor exige soldar por ambas caras", "Cuando se suelda con láser", "En espesores menores a 5mm", "Cuando la unión es de aluminio fino"], correct: "Cuando el espesor exige soldar por ambas caras", hint: "La doble J permite rellenar por arriba y por abajo." },
      { text: "¿Qué perfil tiene la pieza no biselada en una unión J doble?", options: ["Totalmente recto a 90°", "Biselado a 45°", "Curvado en forma de U", "Punteado y achaflanado"], correct: "Totalmente recto a 90°", hint: "La letra J implica que una pieza es curva y la otra sirve de pared recta." }
    ],
    build: (group) => {
      group.add(drawProfile([ [-80,0], [0,0], [0,10], [-80,10] ], -1, -5));
      const s = new THREE.Shape();
      s.moveTo(80,0); s.lineTo(10,0); s.quadraticCurveTo(8, 4.5, 2, 4.5); s.lineTo(2,5.5); s.quadraticCurveTo(8, 5.5, 10, 10); s.lineTo(80,10);
      const p = new THREE.Mesh(new THREE.ExtrudeGeometry(s, {depth:250, bevelEnabled:false}), metalMat);
      p.position.set(1, -5, -125); p.add(new THREE.LineSegments(new THREE.EdgesGeometry(p.geometry), edgeMat));
      group.add(p);
    }
  },
  "ud": {
    name: "U doble",
    badge: "Tipo U Doble",
    params: ["Doble bisel curvo bilateral", "Máximo ahorro", "Espesores muy pesados"],
    desc: "Chaflán en U doble (ambas piezas con bisel curvo por las dos caras).",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>U doble [Double-U groove weld]:</b> La máxima expresión de ahorro de material en soldaduras de penetración completa para bloques extremadamente masivos (> 40 mm).<br><br><b>Sinergia térmica:</b> Une las ventajas del mínimo volumen de ranura curvo con la compensación de contracciones al poder alternar pasadas de raíz [Root pass] por ambas caras de la junta.`,
    questions: [
      { text: "¿Cuál es la principal ventaja de la U doble frente a la V doble (X)?", options: ["Ahorra aún más metal de aportación", "Es más fácil y barata de mecanizar", "No requiere dar la vuelta a la pieza", "Se puede hacer con oxicorte manual"], correct: "Ahorra aún más metal de aportación", hint: "Al tener paredes curvas, la ranura no se abre tanto en la superficie como la V doble." },
      { text: "¿En qué tipo de estructuras se emplea la U doble?", options: ["Espesores muy pesados", "Chapa fina de carrocería", "Tubos de escape de motocicletas", "Mobiliario metálico ligero"], correct: "Espesores muy pesados", hint: "El coste de su mecanizado solo compensa en componentes críticos muy gruesos." }
    ],
    build: (group) => {
      const s1 = new THREE.Shape();
      s1.moveTo(-80,0); s1.lineTo(-10,0); s1.quadraticCurveTo(-8, 4.5, -2, 4.5); s1.lineTo(-2,5.5); s1.quadraticCurveTo(-8, 5.5, -10, 10); s1.lineTo(-80,10);
      const p1 = new THREE.Mesh(new THREE.ExtrudeGeometry(s1, {depth:250, bevelEnabled:false}), metalMat);
      p1.position.set(-1, -5, -125); p1.add(new THREE.LineSegments(new THREE.EdgesGeometry(p1.geometry), edgeMat));
      group.add(p1);
      const s2 = new THREE.Shape();
      s2.moveTo(80,0); s2.lineTo(10,0); s2.quadraticCurveTo(8, 4.5, 2, 4.5); s2.lineTo(2,5.5); s2.quadraticCurveTo(8, 5.5, 10, 10); s2.lineTo(80,10);
      const p2 = new THREE.Mesh(new THREE.ExtrudeGeometry(s2, {depth:250, bevelEnabled:false}), metalMat);
      p2.position.set(1, -5, -125); p2.add(new THREE.LineSegments(new THREE.EdgesGeometry(p2.geometry), edgeMat));
      group.add(p2);
    }
  },
  "c1": {
    name: "Canto rebordeado simple",
    badge: "Reborde Unilateral",
    params: ["Chapa fina", "Borde doblado", "Sin material de aporte"],
    desc: "Canto rebordeado o bordes levantados en una sola pieza.",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS A3.0 (términos y definiciones estándar de soldadura).<br><br><b>Canto rebordeado simple [Single-flange weld]:</b> Conformado en frío donde una de las chapas finas se dobla 90° para crear una pestaña vertical paralela a la otra pieza plana.<br><br><b>Soldadura autógena:</b> La propia pestaña hace las veces de material base y de aporte, fundiéndose durante el proceso GTAW (TIG) sin requerir varilla externa.`,
    questions: [
      { text: "¿Para qué sirve el doblez en un canto rebordeado?", options: ["Proporciona el material base que se fundirá en la unión", "Actúa como disipador de calor", "Evita que la chapa se oxide", "Sirve de guía para cortar la chapa"], correct: "Proporciona el material base que se fundirá en la unión", hint: "Al fundir el doblez, este hace las veces de metal de aportación." },
      { text: "¿En qué rango de espesores se suele utilizar el borde rebordeado?", options: ["En chapas muy finas (< 3 mm)", "En chapas gruesas (> 20 mm)", "En perfiles estructurales pesados", "Únicamente en fundición de hierro"], correct: "En chapas muy finas (< 3 mm)", hint: "Doblar la chapa 90º solo es práctico en materiales delgados." }
    ],
    build: (group) => {
      const s1 = new THREE.Shape();
      s1.moveTo(-80, 0); s1.lineTo(-10, 0); s1.absarc(-10, 10, 10, Math.PI * 1.5, Math.PI * 2, false); s1.lineTo(-4, 10); s1.absarc(-10, 10, 6, Math.PI * 2, Math.PI * 1.5, true); s1.lineTo(-80, 4);
      const p1 = new THREE.Mesh(new THREE.ExtrudeGeometry(s1, {depth:250, bevelEnabled:false}), metalMat);
      p1.position.set(-1, -5, -125); p1.add(new THREE.LineSegments(new THREE.EdgesGeometry(p1.geometry), edgeMat));
      p1.scale.set(1.5, 1, 1);
      group.add(p1);
      
      const s2 = new THREE.Shape();
      s2.moveTo(0,0); s2.lineTo(80,0); s2.lineTo(80,4); s2.lineTo(0,4);
      const p2 = new THREE.Mesh(new THREE.ExtrudeGeometry(s2, {depth:250, bevelEnabled:false}), metalMat);
      p2.position.set(1, -5, -125); p2.add(new THREE.LineSegments(new THREE.EdgesGeometry(p2.geometry), edgeMat));
      p2.scale.set(1.5, 1, 1);
      group.add(p2);
    }
  },
  "c2": {
    name: "Canto rebordeado doble",
    badge: "Reborde Bilateral",
    params: ["Chapa fina", "Doble pestaña", "Unión autógena"],
    desc: "Canto rebordeado o bordes levantados en ambas piezas.",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS A3.0 (términos y definiciones estándar de soldadura).<br><br><b>Canto rebordeado doble [Double-flange weld]:</b> Variante simétrica donde ambas piezas de chapa fina sufren un plegado de 90° y se alinean cara a cara.<br><br><b>Sellado industrial:</b> Es la solución perfecta para el sellado estanco y automatizado de depósitos delgados, permitiendo velocidades de avance muy rápidas mediante la fusión conjunta de las dos pestañas [Flanges].`,
    questions: [
      { text: "¿Qué proceso de soldadura se beneficia especialmente de los bordes levantados bilaterales?", options: ["TIG sin material de aporte (autógena)", "Arco sumergido (SAW)", "Electrodo revestido grueso (SMAW)", "Fricción agitada (FSW)"], correct: "TIG sin material de aporte (autógena)", hint: "El TIG puede simplemente fundir ambas pestañas juntas de forma limpia." },
      { text: "¿Qué forma geométrica crean los bordes levantados al juntarse?", options: ["Dos pestañas verticales paralelas", "Una ranura en forma de V profunda", "Un solape de 5 centímetros", "Un ángulo de 45 grados divergente"], correct: "Dos pestañas verticales paralelas", hint: "Al doblar ambas a 90º y juntarlas, quedan lado a lado apuntando hacia arriba." }
    ],
    build: (group) => {
      const s1 = new THREE.Shape();
      s1.moveTo(-80, 0); s1.lineTo(-10, 0); s1.absarc(-10, 10, 10, Math.PI * 1.5, Math.PI * 2, false); s1.lineTo(-4, 10); s1.absarc(-10, 10, 6, Math.PI * 2, Math.PI * 1.5, true); s1.lineTo(-80, 4);
      const p1 = new THREE.Mesh(new THREE.ExtrudeGeometry(s1, {depth:250, bevelEnabled:false}), metalMat);
      p1.position.set(-1, -5, -125); p1.add(new THREE.LineSegments(new THREE.EdgesGeometry(p1.geometry), edgeMat));
      p1.scale.set(1.5, 1, 1);
      group.add(p1);
      const s2 = new THREE.Shape();
      s2.moveTo(80, 0); s2.lineTo(10, 0); s2.absarc(10, 10, 10, Math.PI * 1.5, Math.PI, true); s2.lineTo(4, 10); s2.absarc(10, 10, 6, Math.PI, Math.PI * 1.5, false); s2.lineTo(80, 4);
      const p2 = new THREE.Mesh(new THREE.ExtrudeGeometry(s2, {depth:250, bevelEnabled:false}), metalMat);
      p2.position.set(1, -5, -125); p2.add(new THREE.LineSegments(new THREE.EdgesGeometry(p2.geometry), edgeMat));
      p2.scale.set(1.5, 1, 1);
      group.add(p2);
    }
  }
};

class App3D {
  constructor(canvasId) {
    this.container = document.getElementById(canvasId);
    this.scene = new THREE.Scene();
    this.viewWidth = 180; // Ancho fijo para garantizar el zoom máximo sin cortar
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.OrthographicCamera(this.viewWidth / -2, this.viewWidth / 2, (this.viewWidth / aspect) / 2, (this.viewWidth / aspect) / -2, 1, 1000);
    this.camera.position.set(0, 0, 250); // Centrada perfectamente al frente

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.autoRotate = false;

    // Iluminación Profesional (3 Puntos)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(100, 150, 100);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffedd5, 0.5); // ligeramente cálida para integrar con el fondo
    fillLight.position.set(-100, 50, 100);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(0, 80, -100);
    this.scene.add(rimLight);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.modelGroup = new THREE.Group();
    this.scene.add(this.modelGroup);

    // === BOTONES DE VISTA RÁPIDA (F) ===
    this.container.style.position = 'relative';
    const viewBar = document.createElement('div');
    viewBar.style.cssText = 'position:absolute; bottom:12px; right:12px; display:flex; gap:6px; z-index:10;';
    
    const views = [
      { label: '⬆ Superior', pos: [0.001, 280, 0], up: [0, 0, -1] },
      { label: '⬛ Frontal',  pos: [0, 0, 280], up: [0, 1, 0] },
      { label: '➡ Lateral',  pos: [280, 0, 0], up: [0, 1, 0] },
    ];

    views.forEach(v => {
      const btn = document.createElement('button');
      btn.textContent = v.label;
      btn.style.cssText = [
        'background:rgba(20,40,90,0.72)', 'color:#e8edf8',
        'border:1px solid rgba(160,195,255,0.28)', 'border-radius:6px',
        'padding:5px 10px', 'font-size:0.71rem',
        "font-family:'Source Sans 3',sans-serif",
        'cursor:pointer', 'backdrop-filter:blur(8px)',
        'font-weight:600', 'letter-spacing:0.02em',
        'transition:background 0.18s,transform 0.12s'
      ].join(';');
      btn.onmouseenter = () => { btn.style.background = 'rgba(30,58,110,0.95)'; btn.style.transform = 'translateY(-1px)'; };
      btn.onmouseleave = () => { btn.style.background = 'rgba(20,40,90,0.72)'; btn.style.transform = 'translateY(0)'; };
      btn.onclick = () => this.setView(v.pos, v.up);
      viewBar.appendChild(btn);
    });
    this.container.appendChild(viewBar);

    window.addEventListener('resize', () => {
      if(!this.container) return;
      const aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.left = -this.viewWidth / 2;
      this.camera.right = this.viewWidth / 2;
      this.camera.top = (this.viewWidth / aspect) / 2;
      this.camera.bottom = -(this.viewWidth / aspect) / 2;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    });

    this.controls.addEventListener('start', () => { this.controls.autoRotate = false; });
    this.animate();
  }

  setView(targetPos, up) {
    this.controls.autoRotate = false;
    this.controls.target.set(0, 0, 0);
    if (up) this.camera.up.set(up[0], up[1], up[2]);
    const startPos = this.camera.position.clone();
    const endPos = new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2]);
    let t = 0;
    const duration = 55;
    const tick = () => {
      t++;
      const a = t / duration;
      const eased = a < 0.5 ? 2 * a * a : -1 + (4 - 2 * a) * a;
      this.camera.position.lerpVectors(startPos, endPos, eased);
      this.controls.update();
      if (t < duration) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  loadModel(type) {
    while(this.modelGroup.children.length > 0){ this.modelGroup.remove(this.modelGroup.children[0]); }
    if (bordsData[type]) bordsData[type].build(this.modelGroup);
    
    // Aumentar el espesor de las piezas 1.5x
    this.modelGroup.scale.set(1, 1.5, 1);
    
    // Cámara posicionada al frente exacto (ortogonal) y cerca
    this.camera.position.set(0, 0, 250);
    this.camera.up.set(0, 1, 0);
    this.controls.target.set(0, 0, 125); // Apuntar al frente de la pieza exactamente en el centro
    this.controls.update();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// INICIALIZACIÓN
const studyApp = new App3D('studyCanvas');
let examApp = null;
let activeType = 'i';

function updateInfoView(type) {
  const data = bordsData[type];
  if(!data) return;
  document.getElementById('infoTitle').textContent = data.name;
  document.getElementById('infoBadge').textContent = data.badge;
  document.getElementById('infoDesc').textContent = data.desc;
  document.getElementById('infoTheory').innerHTML = data.teoria;
  const paramsDiv = document.getElementById('infoParams');
  paramsDiv.innerHTML = '';
  data.params.forEach(p => {
    const s = document.createElement('span'); s.className = 'param-tag'; s.textContent = p;
    paramsDiv.appendChild(s);
  });
  studyApp.loadModel(type);
  studyApp.controls.autoRotate = false; 
}


updateInfoView(activeType);

// Registro de uniones visitadas por el alumno ('i' se muestra por defecto)
const visitedJoints = new Set(['i']);

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    activeType = e.target.dataset.type;
    visitedJoints.add(activeType);    // marcar como visto
    updateInfoView(activeType);
    hidePendingWarning();             // ocultar aviso si ya ha visto las que faltaban
  });
});

// CURSOS
const modulesData = {
  "1º GM Soldadura": ["Mecanizado", "Soldadura en Atmósfera Natural"],
  "2º GM Soldadura": ["Montaje", "Trazado", "Soldadura en Atmósfera Protegida (SAP)"],
  "1º GS Construcciones Metálicas": ["Procesos de Corte y Preparación", "Grafismo y Representación en Fab. Mecánica"],
  "2º GS Construcciones Metálicas": ["Diseño de Estructuras Metálicas", "Procesos de Unión y Montaje"]
};

function updateModules() {
  const course = document.getElementById('studentCourse').value;
  const modSelect = document.getElementById('studentModule');
  if (course && modulesData[course]) {
    modSelect.innerHTML = '<option value="" disabled selected>Selecciona tu módulo...</option>';
    modSelect.disabled = false;
    modulesData[course].forEach(mod => {
      const opt = document.createElement('option'); opt.value = opt.textContent = mod;
      modSelect.appendChild(opt);
    });
  } else {
    modSelect.innerHTML = '<option value="" disabled selected>Selecciona primero un curso…</option>';
    modSelect.disabled = true;
  }
}

document.getElementById('studentCourse').addEventListener('change', () => {
  updateModules();
  hideModuleWarning();
});

// Chequeo inicial por si el navegador autocompleta
updateModules();

// =============================================
// VALIDACIÓN DE MÓDULO — ESTÁNDAR v2.6
// =============================================
function showModuleWarning() {
  let card = document.getElementById('moduleWarning');
  if (!card) {
    card = document.createElement('div');
    card.id = 'moduleWarning';
    card.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:0.9rem;">
        <span style="font-size:1.6rem;line-height:1;flex-shrink:0;">⚠️</span>
        <div>
          <p style="font-weight:700;font-size:0.95rem;color:#7a3800;margin-bottom:0.25rem;">Módulo incorrecto para esta actividad</p>
          <p style="font-size:0.87rem;color:#9a4a10;line-height:1.5;">
            Este ejercicio pertenece al módulo <strong>${MODULO_CORRECTO}</strong>.
            Por favor, asegúrate de elegir tu módulo correcto.
          </p>
        </div>
        <button onclick="hideModuleWarning()" title="Cerrar" style="margin-left:auto;background:none;border:none;cursor:pointer;font-size:1.1rem;color:#9a4a10;">✕</button>
      </div>
    `;
    Object.assign(card.style, {
      display: 'none', background: '#fff4e6', border: '1.5px solid #f4a040', borderLeft: '5px solid #d97706',
      borderRadius: '8px', padding: '1rem 1.1rem', marginBottom: '1.25rem', marginTop: '0.5rem', boxShadow: '0 4px 18px rgba(217,119,6,0.13)',
    });
    document.getElementById('warningsContainer').appendChild(card);
  }
  card.style.display = 'block';
}

function hideModuleWarning() {
  const card = document.getElementById('moduleWarning');
  if (card) card.style.display = 'none';
}

document.getElementById('studentModule').addEventListener('change', (e) => {
  if (e.target.value && e.target.value !== MODULO_CORRECTO) showModuleWarning();
  else hideModuleWarning();
});

const dateInput = document.getElementById('examDate');
const dLocal = new Date(new Date().getTime() - (new Date().getTimezoneOffset()*60000)).toISOString().split('T')[0];
dateInput.value = dLocal;
dateInput.addEventListener('change', (e) => {
  document.getElementById('dateWarning').style.display = (e.target.value !== dLocal) ? 'block' : 'none';
});

// EXAMEN
let examQuestions = [];
let currentQIdx = 0;
let scoreRaw = 0;
let timer = null;
let timeLeft = TIME_LIMIT;

document.getElementById('btnStartExam').addEventListener('click', () => {
  const isOk = ['studentName','studentCourse','studentModule','examDate'].every(id => {
    const v = document.getElementById(id).value;
    document.getElementById(id).style.borderColor = !v ? 'red' : '#cbd5e1';
    return v;
  });
  
  if(!isOk) {
    const btn = document.getElementById('btnStartExam');
    btn.textContent = "❌ Rellena todos tus datos arriba";
    setTimeout(() => btn.textContent = "Comenzar Prueba", 3000);
    return;
  }

  // Validación de estudio obligatorio
  const allTypes = Object.keys(bordsData);
  const pending = allTypes.filter(t => !visitedJoints.has(t));
  if (pending.length > 0) {
    showPendingWarning(pending.map(t => bordsData[t].name));
    return;
  }

  hidePendingWarning();
  const studyP = document.getElementById('studyPanel');
  if(studyP) studyP.remove();
  
  document.getElementById('examPanel').style.display = 'block';

  setTimeout(() => {
    if (!examApp) examApp = new App3D('examCanvas');

    // Distribución ponderada: Más importancia a preparaciones comunes
    const distribucion = { i: 2, v: 2, x: 2, y: 1, k: 1 };
    let selected = [];
    let usedTypes = new Set();
    
    Object.entries(distribucion).forEach(([tipo, cantidad]) => {
      const qPool = bordsData[tipo].questions
        .map(q => ({ ...q, type: tipo }))
        .sort(() => Math.random() - 0.5);
      selected.push(...qPool.slice(0, cantidad));
      usedTypes.add(tipo);
    });

    // Las 2 preguntas restantes se eligen al azar entre las preparaciones especiales (U, J, dobles y cantos)
    let specialPool = [];
    allTypes.filter(t => !usedTypes.has(t)).forEach(tipo => {
      specialPool.push(...bordsData[tipo].questions.map(q => ({ ...q, type: tipo })));
    });
    
    specialPool.sort(() => Math.random() - 0.5);
    selected.push(...specialPool.slice(0, MAX_QUESTIONS - selected.length));

    examQuestions = selected.sort(() => Math.random() - 0.5);
    document.getElementById('totalQuestions').textContent = MAX_QUESTIONS;
    loadNextQuestion();
  }, 50);
});

// --- Aviso de estudio pendiente ---
function showPendingWarning(names) {
  let card = document.getElementById('pendingWarning');
  if (!card) {
    card = document.createElement('div');
    card.id = 'pendingWarning';
    Object.assign(card.style, {
      background: '#fef2f2', border: '1.5px solid #fca5a5', borderLeft: '5px solid #b33000',
      borderRadius: '8px', padding: '1rem 1.1rem', marginTop: '1rem', boxShadow: '0 4px 18px rgba(179,48,0,0.12)',
    });
    document.querySelector('.start-exam-container').appendChild(card);
  }
  card.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:0.9rem;">
      <span style="font-size:1.6rem;">🚫</span>
      <div style="flex:1">
        <p style="font-weight:700;color:#7a1a00;">Estudio incompleto</p>
        <p style="font-size:0.87rem;color:#9a2a10;margin-bottom:0.4rem;">Debes revisar estos tipos antes de evaluar:</p>
        <ul style="font-size:0.87rem;color:#7a1a00;list-style:none;padding:0;">
          ${names.map(n => `<li>📌 <strong>${n}</strong></li>`).join('')}
        </ul>
      </div>
      <button onclick="hidePendingWarning()" style="background:none;border:none;cursor:pointer;color:#9a2a10;">✕</button>
    </div>
  `;
  card.style.display = 'block';
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hidePendingWarning() {
  const card = document.getElementById('pendingWarning');
  if (card) card.style.display = 'none';
}

function loadNextQuestion() {
  const q = examQuestions[currentQIdx];
  if(examApp) examApp.loadModel(q.type);
  
  document.getElementById('currentQuestionNum').textContent = currentQIdx + 1;
  document.getElementById('examQuestion').textContent = q.text;
  document.getElementById('progressBar').style.width = ((currentQIdx/MAX_QUESTIONS)*100)+'%';
  
  const opts = document.getElementById('examOptions');
  opts.innerHTML = '';
  document.getElementById('answerFeedback').style.display = 'none';
  document.getElementById('btnNextQuestion').style.display = 'none';

  let shuffOpts = [...q.options].sort(()=>Math.random()-0.5);
  shuffOpts.forEach(o => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = o;
    btn.onclick = () => selectAnswer(btn, o, q.correct, q.hint);
    opts.appendChild(btn);
  });

  timeLeft = TIME_LIMIT;
  document.getElementById('examTimer').textContent = timeLeft;
  clearInterval(timer);
  timer = setInterval(()=>{
    timeLeft--;
    document.getElementById('examTimer').textContent = timeLeft;
    if(timeLeft<=0) selectAnswer(null, null, q.correct, q.hint, true);
  }, 1000);
}

function selectAnswer(btn, selected, correct, hint, timeout=false) {
  clearInterval(timer);
  const btns = document.querySelectorAll('.option-btn');
  btns.forEach(b => b.disabled = true);

  const fb = document.getElementById('answerFeedback');
  fb.style.display = 'block';

  if (timeout) {
      fb.className = 'answer-feedback wrong';
      fb.innerHTML = `<b>⏰ Tiempo agotado.</b><br>${hint}`;
      btns.forEach(b => { if(b.textContent===correct) b.classList.add('correct'); });
  } else {
      if(selected === correct) {
        btn.classList.add('correct');
        fb.className = 'answer-feedback correct';
        fb.innerHTML = `<b>✅ Correcto!</b><br>${hint}`;
        scoreRaw++;
      } else {
        btn.classList.add('wrong');
        fb.className = 'answer-feedback wrong';
        fb.innerHTML = `<b>❌ Incorrecto.</b><br>${hint}`;
        btns.forEach(b => { if(b.textContent===correct) b.classList.add('correct'); });
      }
  }
  document.getElementById('btnNextQuestion').style.display = 'block';
}

document.getElementById('btnNextQuestion').addEventListener('click', () => {
  if(currentQIdx < MAX_QUESTIONS) loadNextQuestion();
  else finishVal();
});

function finishVal() {
  document.querySelector('.exam-grid').style.display = 'none';
  document.querySelector('.panel-header').style.display = 'none';
  document.getElementById('evaluationPanel').style.display = 'block';
  
  const finalScore = scoreRaw; // 10 preguntas = nota directa
  
  const arc = document.getElementById('scoreArc');
  const maxDash = 327;
  const dashVal = maxDash - (maxDash * (finalScore/10));
  setTimeout(()=> {
    arc.style.strokeDasharray = `${maxDash - dashVal} 327`;
    if(finalScore<5) arc.style.stroke = '#ef4444'; 
  }, 100);

  document.getElementById('scoreCircle').textContent = finalScore;
  document.getElementById('modalTitle').textContent = finalScore>=5 ? "¡Prueba Superada!" : "Necesitas Mejorar";
  document.getElementById('modalSummary').textContent = `Has respondido correctamente ${scoreRaw} de ${MAX_QUESTIONS} preguntas.`;
  document.getElementById('evaluationPanel').scrollIntoView();
}

document.getElementById('btnEnviarDrive').addEventListener('click', async () => {
    const btn = document.getElementById('btnEnviarDrive');
    const status = document.getElementById('enviarDriveStatus');
    
    // Obtenemos los datos tal cual están en los inputs
    const nombreAlumno = document.getElementById('studentName').value;
    const cleanNameForFile = (nombreAlumno || 'alumno').trim().replace(/\s+/g, '_');
    const pdfFilename = `PrepBordes_${cleanNameForFile}.pdf`;
    
    btn.disabled = true; 
    btn.textContent = 'Generando certificado...';
    status.style.display = 'block'; 
    status.textContent = 'Procesando...';

    try {
        // 1. GENERAR PDF
        const pdfResult = generarPDF();
        
        // 2. ENVÍO A DRIVE (Siempre primero para asegurar datos del profesor)
        btn.textContent = 'Enviando...';
        status.textContent = 'Subiendo al expediente del profesor...';

        await fetch(GAS_URL, {
            method: 'POST', 
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fecha: document.getElementById('examDate').value,
                nombre: nombreAlumno,
                modulo: document.getElementById('studentModule').value,
                tipo: "Preparación de Bordes",
                ejercicio: "Preparación de Bordes",
                nota: scoreRaw,
                pdfNombre: pdfFilename,
                pdf: pdfResult.base64,
                hojaTarget: "EJERCICIOS Y ACTIVIDADES INTERACTIVAS"
            })
        });

        // 3. DESCARGA LOCAL (Blindado para evitar que el bloqueo de Sites detenga el reporte de éxito)
        try {
            const url = URL.createObjectURL(pdfResult.blob);
            const a = document.createElement('a'); 
            a.href = url; a.download = pdfFilename; 
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (downloadErr) {
            console.warn("Descarga local bloqueada por Google Sites.");
        }

        btn.textContent = '¡Completado!';
        status.style.color = '#15803d';
        status.textContent = '✅ Datos guardados y PDF enviado correctamente.';

    } catch(e) {
        btn.disabled = false; 
        btn.textContent = 'Reintentar envío';
        status.style.color = '#dc2626';
        status.textContent = '❌ Error de red al enviar.';
    }
});

function generarPDF() {
  const { jsPDF } = window.jspdf;
  if (!jsPDF) throw new Error('jsPDF no inicializado');
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const PW = doc.internal.pageSize.getWidth();
  
  doc.setFillColor(30, 58, 138); 
  doc.rect(0, 0, PW, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('EVALUACIÓN: PREPARACIÓN DE BORDES', PW / 2, 16, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Evaluación Interactiva · ISO 9692-1', PW / 2, 25, { align: 'center' });
  
  doc.setTextColor(30, 41, 59); 
  let y = 50;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Acreditación del Alumno', 20, y); y+=10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const nf = document.getElementById('studentName').value;
  const curs = document.getElementById('studentCourse').value;
  const mod = document.getElementById('studentModule').value;
  const fech = document.getElementById('examDate').value;
  
  doc.text(`Nombre: ${nf}`, 25, y); y+=8;
  doc.text(`Curso: ${curs}`, 25, y); y+=8;
  doc.text(`Módulo: ${mod}`, 25, y); y+=8;
  doc.text(`Fecha: ${fech}`, 25, y); y+=20;
  
  doc.line(20, y, PW - 20, y); y+=12; 
  
  // --- DESGLOSE DE RESULTADOS ---
  const aciertos = scoreRaw;
  const fallos   = MAX_QUESTIONS - aciertos;
  const finalScore = scoreRaw;

  doc.setFillColor(240, 244, 255);
  doc.roundedRect(20, y, PW - 40, 30, 3, 3, 'F');
  
  doc.setTextColor(30, 58, 138); doc.setFontSize(10); doc.setFont('helvetica', 'bold');
  doc.text('DESGLOSE DETALLADO', PW/2, y + 6, { align: 'center' });
  
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text(`Aciertos: ${aciertos}`, 35, y + 16);
  doc.text(`Fallos: ${fallos}`, 35, y + 23);
  
  doc.text(`Sistema: ${MAX_QUESTIONS} preg. x 1 pt = 10 pts máx.`, PW - 35, y + 16, { align: 'right' });
  doc.text('Sin penalización por error.', PW - 35, y + 23, { align: 'right' });
  y += 40;

  const color = finalScore >= 5 ? [21, 128, 61] : [220, 38, 38]; 
  doc.setFillColor(color[0], color[1], color[2]);
  doc.roundedRect(PW/2 - 35, y, 70, 25, 3, 3, 'F'); 
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26); doc.setFont('helvetica', 'bold');
  doc.text(`${finalScore} / 10`, PW/2, y + 17, { align: 'center' });
  
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.text('Documento generado automáticamente para el expediente del módulo SAP.', PW / 2, 280, { align: 'center' });
  
  const blob = doc.output('blob');
  const dataUri = doc.output('datauristring');
  const base64 = dataUri.split('base64,')[1];
  
  return { blob: blob, base64: base64 };
}
