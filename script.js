const GAS_URL = "https://script.google.com/macros/s/AKfycbzDJni77NAjWJng-ogPCMhr3QEHKKkgi7I2Vvegqamwb1udpgGeCamGO9bjuNrY4sE4/exec";
const metalMat = new THREE.MeshStandardMaterial({ 
  color: 0x8a9ba8, 
  metalness: 0.9, 
  roughness: 0.2, 
  side: THREE.DoubleSide,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 2
});

function drawProfile(shapeCoords, depth=250) {
  const shape = new THREE.Shape();
  shape.moveTo(shapeCoords[0][0], shapeCoords[0][1]);
  for(let i=1; i<shapeCoords.length; i++) {
     shape.lineTo(shapeCoords[i][0], shapeCoords[i][1]);
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: false });
  const mesh = new THREE.Mesh(geo, metalMat);
  
  const edges = new THREE.EdgesGeometry(geo);
  const neonLine = new THREE.LineSegments(
    edges, 
    new THREE.LineBasicMaterial({ color: 0x00f3ff, linewidth: 2, transparent: true, opacity: 0.85 })
  );
  mesh.add(neonLine);
  
  return mesh;
}

const bordsData = {
  "recto": {
    name: "Borde Recto (I)",
    badge: "Espesores finos",
    params: ["Sin preparación", "Corte Guadaña 90°", "< 3mm espesor"],
    desc: "Aproximación de bordes perpendiculares (90º) sin ninguna modificación pre-soldadura.",
    teoria: `<b>Normativa Técnica (UNE-EN ISO 9692-1 / AWS D1.1):</b> Denominado como Junta en I (Square-Groove Weld).<br>
    <b>Geometría y Límites Cinéticos:</b> Las piezas no reciben ningún biselado mecanizado oblicuo, manteniendo los bordes perpendiculares (90º) tras el corte por guillotina, plasma o sierra. Es la preparación más económica al eliminar el coste del mecanizado previo.<br>
    <b>Capacidad de Penetración:</b> Según <b>AWS D1.1</b>, se limita estrictamente a espesores finos (< 3 mm para SMAW/GMAW en pasada única) donde la energía del arco es capaz de alcanzar la raíz opuesta. En espesores mayores sin biselar, se produce inevitablemente una falta de penetración central catastrófica (ISO 402), debilitando la unión ante esfuerzos de flexión.`,
    questions: [
      { text: "¿Cuál es el espesor máximo general recomendado donde realizar una unión I a tope por un solo lado, garantizando el 100% de penetración sin respaldos?", options: ["Alrededor de 3 mm", "Alrededor de 15 mm", "No hay límite de espesor", "Solo es posible en nanómetros"], correct: "Alrededor de 3 mm", hint: "Más de 3mm suele requerir separar excesivamente las placas o biselar para que la fusión llegue a la raíz." },
      { text: "¿Cuál es el principal paso de preparación para una junta con bordes rectos (I)?", options: ["Cortar las piezas exactamente a 90º y sanear óxidos", "Mecanizar un ángulo de 60º", "Forjar el borde calentándolo previamente", "Doblar ligeramente con un martillo antes de soldar"], correct: "Cortar las piezas exactamente a 90º y sanear óxidos", hint: "La preparación I no tiene ángulo de chaflán, solo corte y limpieza." },
      { text: "Si unimos dos placas de 15 mm de espesor usando un bisel recto (I), ¿qué riesgo enorme sumimos respecto a la soldadura generada?", options: ["Una gravísima falta de penetración interna total", "Exceso excesivo de material sobrante", "Rotura del equipo por sobrecalentamiento", "Perforado instantáneo del material de 15mm"], correct: "Una gravísima falta de penetración interna total", hint: "El arco se queda en la superficie. El centro de las placas de 15mm no llegará a fundir." }
    ],
    build: (group) => {
      const pl1 = drawProfile([ [-80,0], [0,0], [0,10], [-80,10], [-80,0] ]); pl1.position.set(-2, -5, -125);
      const pl2 = drawProfile([ [0,0], [80,0], [80,10], [0,10], [0,0] ]); pl2.position.set(2, -5, -125);
      group.add(pl1); group.add(pl2);
    }
  },
  "v": {
    name: "Bisel en V (Simple)",
    badge: "Estándar Universal",
    params: ["~60° apertura", "Talon de raíz (0-3mm)", "Para espesor <15mm"],
    desc: "Chaflán aplicado en un solo plano. Es el tipo de preparación más extendido.",
    teoria: `<b>Normativa Técnica (UNE-EN ISO 9692-1 / AWS D1.1):</b> Bisel en V Simple (Single-V-Groove).<br>
    <b>Diseño Paramétrico de la Junta:</b>
    <ul>
      <li><b>Ángulo de Ranura (Groove Angle):</b> Normalmente entre 60° y 70°. Un ángulo menor dificulta el acceso del electrodo (causando falta de fusión lateral), mientras que uno mayor aumenta excesivamente el Factor de Forma y el consumo innecesario de material.</li>
      <li><b>Talón de Raíz (Root Face):</b> Franja plana (1-2 mm) que actúa como disipador térmico, impidiendo que el arco "desfonde" la junta creando perforaciones (Burn-through).</li>
      <li><b>Abertura de Raíz (Root Opening/Gap):</b> Espacio vital para garantizar que el metal fundido de la 1ª pasada alcance el lado opuesto, asegurando la Penetración Completa (CJP).</li>
    </ul>`,
    questions: [
      { text: "¿Qué función principal tiene dejar el 'talón de raíz' en lugar de sacar la punta del bisel a cuchillo vivo?", options: ["Soportar la fuerza térmica de la 1ª pasada y evitar perforar", "Permitir mayor velocidad y evitar gastar gas inerte inútilmente", "Estéticamente queda mejor al mirarlo a contraluz", "Para poder medir el grosor con un calibre durante el proceso"], correct: "Soportar la fuerza térmica de la 1ª pasada y evitar perforar", hint: "El talón pone masa metálica donde más probabilidad hay de fundir de sobra y hacer un agujero de raíz." },
      { text: "¿Qué ángulo de preparación total (ambas placas sumadas) es el canon estándar tradicional para las uniones a tope V?", options: ["Entre 60º y 70º", "15º", "120º", "180º"], correct: "Entre 60º y 70º", hint: "El arco entra bien para fusionar paredes laterales a 60-70º, haciéndolo menor dejaría falta de fusión." },
      { text: "Si se suelda una chapa en V asimétrica y toda la aportación entra por la cara V superior, la principal desventaja térmica es:", options: ["Distorsión angular agresiva de la placa por asimetría de contracción", "Dificultad de arranque del arco", "Riesgo nulo de grietas en caliente", "Pérdida de propiedades magnéticas del acero"], correct: "Distorsión angular agresiva de la placa por asimetría de contracción", hint: "Poner soldadura (que contraerá) de un solo lado doblará las placas como alas hacia esa cara." }
    ],
    build: (group) => {
      const pl1 = drawProfile([ [-80,0], [0,0], [0,2], [-8,10], [-80,10], [-80,0] ]); pl1.position.set(-2, -5, -125);
      const pl2 = drawProfile([ [0,0], [80,0], [80,10], [8,10], [0,2], [0,0] ]); pl2.position.set(2, -5, -125);
      group.add(pl1); group.add(pl2);
    }
  },
  "x": {
    name: "Bisel en X (Doble V)",
    badge: "Alta resiliencia",
    params: ["Doble cara", "Neutraliza tensiones", "Para espesor grueso"],
    desc: "Biselado simétrico por la cara superior e inferior, dejando el talón en el medio.",
    teoria: `<b>Normativa Técnica (UNE-EN ISO 9692-1 / AWS D1.1):</b> Doble V (Double-V-Groove / X-Groove).<br>
    <b>Ingeniería de Tensiones Residuales:</b> Es la preparación superior para espesores medios y gruesos (>15-20 mm) cuando existe acceso por ambas caras.<br>
    <b>Ventajas Metalomecánicas:</b>
    <ul>
      <li><b>Ahorro Logístico:</b> Gasta aproximadamente un 50% menos de material de aportación que una V simple en el mismo espesor, al reducir el volumen total de la cavidad geométrica.</li>
      <li><b>Control de Distorsión:</b> Al equilibrar el aporte térmico y la contracción del metal soldado mediante pasadas alternas por ambas caras, se neutralizan los momentos flectores térmicos, manteniendo la planitud dimensional de la estructura final (ISO 13920 Clase B).</li>
    </ul>`,
    questions: [
      { text: "¿Por qué el bisel X requiere aproximadamente la mitad de metal de aportación que un bisel V en una placa del mismo alto espesor?", options: ["Por una cuestión puramente geométrica del crecimiento del área del triángulo con la altura", "Porque el calor residual engrosa las paredes internamente reduciendo hueco", "Porque en el bisel X nunca se hace pasada de raíz", "Es un mito, ambos consumen lo mismo"], correct: "Por una cuestión puramente geométrica del crecimiento del área del triángulo con la altura", hint: "Área triángulo simple grande vs dos triángulos pequeños. El V se abre de forma inmensa en la superficie frente a la X." },
      { text: "En fabricación, la secuencia de soldadura para un bisel X si buscamos cero distorsión consiste en:", options: ["Hacer pasadas alternadas controladas por ambas caras secuencialmente", "Rellenar la primera cara hasta el final e ignorar la segunda", "Soldar todo por soldable robot simultáneo verticalmente", "Precalentar ambas caras y arrojarlo al agua antes de soldar"], correct: "Hacer pasadas alternadas controladas por ambas caras secuencialmente", hint: "Balancear tensiones requiere ir compensando el arco en cada lado (dar una pasada cara A, dar otra cara B)." },
      { text: "¿Qué se requiere inexcusablemente para que una preparación en X sea operativa?", options: ["Accesibilidad del soldador por ambos lados de la estructura base", "Un grosor mínimo de 40 centímetros", "Solo realizarse bajo normativa submarina", "No requiere absolutamente nada especial"], correct: "Accesibilidad del soldador por ambos lados de la estructura base", hint: "No puedes soldar una X si la pieza base es una tubería a presión pequeña donde nadie puede entrar, o una viga pegada al suelo." }
    ],
    build: (group) => {
      const pl1 = drawProfile([ [-80,0], [-4,0], [0,4], [0,6], [-4,10], [-80,10], [-80,0] ]); pl1.position.set(-2, -5, -125);
      const pl2 = drawProfile([ [4,0], [80,0], [80,10], [4,10], [0,6], [0,4], [4,0] ]); pl2.position.set(2, -5, -125);
      group.add(pl1); group.add(pl2);
    }
  },
  "u": {
    name: "Bisel en U",
    badge: "Eficiencia de metal",
    params: ["Radio curvo", "Ahorra material", "Piezas pesadas"],
    desc: "Chaflán curvado (usualmente torneado) optimizado para grandes espesores.",
    teoria: `<b>Normativa Técnica (UNE-EN ISO 9692-1 / AWS D1.1):</b> Bisel en U (Single-U-Groove).<br>
    <b>Optimización para Espesores Críticos:</b> Específicamente diseñado para calderería pesada y recipientes a presión (ASME VIII) con espesores superiores a 25-30 mm.<br>
    <b>Geometría de Alta Eficiencia:</b> A diferencia de la V (que se ensancha linealmente), la U mantiene paredes casi paralelas tras el radio de raíz inicial. Esto permite un ahorro masivo de metal de aportación y horas-hombre de soldadura en las etapas de relleno. Aunque el mecanizado previo es más costoso (requiere fresado o torneado), la rentabilidad final en grandes consumos es inigualable.`,
    questions: [
      { text: "¿El coste de MECANIZADO (la creación de la ranura pre-soldadura) de un bisel en U comparado con uno V de amoladora, cómo es?", options: ["Mucho mayor y más costoso (torneado, oxicorte especializado, fresado curvo)", "Más económico; se hace partiendo los cantos a martillazos", "Exactamente idéntico e igual de fácil para montaje empírico en obra", "Menor coste; se corta con tijeras neumáticas de inercia recta"], correct: "Mucho mayor y más costoso (torneado, oxicorte especializado, fresado curvo)", hint: "Generar superficies cóncavas exactas precisa maquinaria pesada, es caro frente a un simple corte diagonal." },
      { text: "Si fabricar U es caro, ¿por qué se utiliza en espesores de 30-50mm?", options: ["Porque el gigantesco ahorro de metal de aporte carísimo durante el rellenado compensa el coste del mecanizado", "Por simple belleza visual arquitectónica interna de las uniones", "Para confundir a los END de ultrasonidos garantizando falso eco curvo favorable", "Por exigencia de aleaciones de plomo pesadas solamente"], correct: "Porque el gigantesco ahorro de metal de aporte carísimo durante el rellenado compensa el coste del mecanizado", hint: "Ahorra 100 kilos de electrodos por cada junta de tanque, compensando las horas de fresa de preparar el disco." },
      { text: "¿La preparación U es idónea para chapa de automoción de 2 mm?", options: ["Falso, es exclusiva de gruesos extremos; en 2mm no aporta nada", "Verdadero, es clave en chapa automotriz galvanizada de alta resistencia", "Verdadero siempre que los robots posean cámara de plasma curvo", "Exige 5 mm para chasis pero no para carrocerías"], correct: "Falso, es exclusiva de gruesos extremos; en 2mm no aporta nada", hint: "Para chapas finas o medias (< 10mm) el U no saca ventaja a un V normal." }
    ],
    build: (group) => {
      const s1 = new THREE.Shape();
      s1.moveTo(-80,0); s1.lineTo(-2,0); s1.lineTo(-2,2); s1.bezierCurveTo(-2,5, -4,7, -10,10); s1.lineTo(-80,10); s1.lineTo(-80,0);
      const p1 = new THREE.Mesh(new THREE.ExtrudeGeometry(s1, {depth:250, curveSegments:32, bevelEnabled:false}), metalMat);
      p1.position.set(-2, -5, -125); 
      const edges1 = new THREE.EdgesGeometry(p1.geometry);
      p1.add(new THREE.LineSegments(edges1, new THREE.LineBasicMaterial({color: 0x00f3ff, linewidth:2, transparent:true, opacity:0.85})));
      group.add(p1);
      
      const s2 = new THREE.Shape();
      s2.moveTo(80,0); s2.lineTo(2,0); s2.lineTo(2,2); s2.bezierCurveTo(2,5, 4,7, 10,10); s2.lineTo(80,10); s2.lineTo(80,0);
      const p2 = new THREE.Mesh(new THREE.ExtrudeGeometry(s2, {depth:250, curveSegments:32, bevelEnabled:false}), metalMat);
      p2.position.set(2, -5, -125); 
      const edges2 = new THREE.EdgesGeometry(p2.geometry);
      p2.add(new THREE.LineSegments(edges2, new THREE.LineBasicMaterial({color: 0x00f3ff, linewidth:2, transparent:true, opacity:0.85})));
      group.add(p2);
    }
  },
  "j": {
    name: "Bisel en J",
    badge: "Tubos y Bridas",
    params: ["U asimétrica", "Medio curvo", "Ahorro relativo"],
    desc: "Unión asimétrica donde solo una cara recibe tallado curvo, la otra es recta (I).",
    teoria: `<b>Normativa Técnica:</b> Bisel en J (Single-J-Groove).<br>
    <b>Aplicaciones Asimétricas Específicas:</b> Se utiliza típicamente en uniones en T de gran espesor o cuando solo una de las piezas es accesible para el mecanizado (ej. unión de un cuerpo de válvula fundido a una tubería).<br>
    <b>Dinámica del Arco:</b> Requiere una técnica operativa precisa; el arco debe dirigirse ligeramente hacia la pared recta (I) para compensar la asimetría de absorción de calor y asegurar la fusión completa en el rincón de la raíz (evitando el efecto de 'pegado' o falta de fusión lateral ISO 401).`,
    questions: [
      { text: "¿En qué casos asimétricos es ideal aplicar preparación J?", options: ["Montajes asimétricos donde una de las piezas no puede biselarse (ej. pared maestra, bloque masivo cast)", "En soldadura de acero inoxidable duplex submarino de tuberías simples simétricas", "En láminas de zinc entrelazadas estructurales finas de aviónica", "Siempre para uniones T soldadas con Láser de CO2"], correct: "Montajes asimétricos donde una de las piezas no puede biselarse (ej. pared maestra, bloque masivo cast)", hint: "Facilita preparar un canto solo de la pieza cómoda o torneable, dejando la base intacta recta I." },
      { text: "¿Hacia donde debe apuntarse asimétricamente el calor/antorcha en una junta J para balancear la fusión de raíz y evitar faltas?", options: ["Dirigir ligeramente hacia la pared plana/recta profunda", "Dirigir directamente al borde afilado curvado delgado del bisel mecanizado", "Soldar en sentido de vaivén puramente inverso, o retroceso central puro", "Bisel J impone auto-fusión pasiva del calor de aporte transversal sin orientaciones de arco"], correct: "Dirigir ligeramente hacia la pared plana/recta profunda", hint: "La pared recta I es la más difícil de penetrar porque la curva J ya tiene una fina capa fácil de fundir." },
      { text: "El fresado (mecanizado) asimétrico J gasta... (respecto aporte vs mecanizado)", options: ["Más horas de mecanizado pero ahorra deposición en gran formato grueso", "Se hace sin máquinas solo calentando", "Reduce consumo horas de soldador a cero y dobla consumo mecanizador láser", "Idéntico consumible y soldabilidad al doble V"], correct: "Más horas de mecanizado pero ahorra deposición en gran formato grueso", hint: "J hereda características físicas de U. Caro de cortar curvado, barato de rellenar gruesos." }
    ],
    build: (group) => {
      const p1 = drawProfile([ [-80,0], [0,0], [0,10], [-80,10], [-80,0] ]); p1.position.set(-2, -5, -125);
      const s2 = new THREE.Shape();
      s2.moveTo(80,0); s2.lineTo(2,0); s2.lineTo(2,2); s2.bezierCurveTo(2,5, 4,7, 10,10); s2.lineTo(80,10); s2.lineTo(80,0);
      const p2 = new THREE.Mesh(new THREE.ExtrudeGeometry(s2, {depth:250, curveSegments:32, bevelEnabled:false}), metalMat);
      p2.position.set(2, -5, -125); 
      const edges2 = new THREE.EdgesGeometry(p2.geometry);
      p2.add(new THREE.LineSegments(edges2, new THREE.LineBasicMaterial({color: 0x00f3ff, linewidth:2, transparent:true, opacity:0.85})));
      group.add(p1); group.add(p2);
    }
  },
  "k": {
    name: "Bisel en K",
    badge: "Espesores Críticos en T",
    params: ["Doble bisel asimétrico", "Uniones maestras T", "Para alto desgaste"],
    desc: "Unión para T (soldadura de ángulo) para altas cargas. Doble bisel oblicuo sobre el elemento vertical.",
    teoria: `<b>Normativa Técnica (UNE-EN ISO 9692-1 / AWS D1.1):</b> Doble Bisel en T (Double-Bevel-Groove / K-Groove).<br>
    <b>Diseño para Cargas de Fatiga Extremas:</b> Aplicado exclusivamente en uniones en T de alta responsabilidad estructural (ej. bases de columnas de aerogeneradores o puentes-grúa).<br>
    <b>Continuidad Metalúrgica CJP:</b> Al biselar la placa vertical por ambas caras, se garantiza que la soldadura atraviese todo el espesor del montante, eliminando el "plano de debilidad" central que quedaría en una unión de ángulo (Filete) convencional. Es la equivalente en T a la preparación X en juntas a tope.`,
    questions: [
      { text: "La forma 'K' sirve esencialmente para hacer de la soldadura en 'T' (donde una placa corta incide a 90º en medio de otra) una penetración de qué nivel?", options: ["Penetración completa (CJP - Complete Joint Penetration) estructural en vez de un pegote de filetes simple perimetral falso", "Penetración nula superficial para sellar contra entrada de líquido refrigerante a corto plazo", "Una soldadura puramente decorativa", "A nivel superficial asimétrico con respaldo no consumible subyacente permanente"], correct: "Penetración completa (CJP - Complete Joint Penetration) estructural en vez de un pegote de filetes simple perimetral falso", hint: "El K asegura que la T esté atravesada y sea un solo bloque." },
      { text: "Durante la elaboración en taller de la pieza montante T pesada, ¿cómo se consigue mantener estable la perpendicularidad estricta y eliminar la distorsión del ala de una viga K?", options: ["Alternar series soldando un número equitativo de pasadas primero a un lado del K y luego cambiando a soldeo del otro hueco del K", "Sujetar el ala con una estiba soldada en rígido extremo sin compensar térmica", "Refrigerar mediante baño salino a altas concentraciones el fondo del ala transversal con amoniaco", "Rellenando masivamente el chaflán superior ignorando por tres días de cadencia el inferior"], correct: "Alternar series soldando un número equitativo de pasadas primero a un lado del K y luego cambiando a soldeo del otro hueco del K", hint: "La distorsión ocurre si llenas un lado completo. Para uniones en K se va saltando alterno para que queden compensadas." },
      { text: "En la analogía geométrica con las placas tope colineales, preparar asimétricamente un ala intermedia afilando de K es el equivalente perpendicular del uso del bisel ____ en placas tope horizontales largas", options: ["Bisel X (Doble V)", "Recto simple paralelo asimétrico cruzado diagonal", "Bisel J profundo doble oblicuo paralelo transversal con hueco", "Unión Lap solapada superficial lisa cizallada con chaflán frontal asimétrico"], correct: "Bisel X (Doble V)", hint: "El bisel X es una flecha de dos puntas para piezas en horizontal, el K es esa misma flecha de dos puntas clavada en T." }
    ],
    build: (group) => {
      const pbase = drawProfile([ [-40,0], [40,0], [40,10], [-40,10], [-40,0] ]); pbase.position.set(0, -5, -125);
      const pk = drawProfile([ [-5, 90], [5, 90], [5, 15], [1, 10], [-1, 10], [-5, 15], [-5, 90] ]); pk.position.set(0, -5, -125);
      group.add(pbase); group.add(pk);
    }
  }
};

class App3D {
  constructor(canvasId) {
    this.container = document.getElementById(canvasId);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 1, 1000);
    this.camera.position.set(60, 60, 100);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.autoRotate = true; // Auto-rotación
    this.controls.autoRotateSpeed = 2.0;
    
    // Grid Helper fondo
    const grid = new THREE.GridHelper(400, 20, 0x334155, 0x1e293b);
    grid.position.y = -20;
    this.scene.add(grid);

    const ambLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(100, 200, 100);
    this.scene.add(dirLight);

    this.modelGroup = new THREE.Group();
    this.scene.add(this.modelGroup);

    window.addEventListener('resize', () => {
      if(!this.container) return;
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    });

    this.controls.addEventListener('start', () => { this.controls.autoRotate = false; });
    this.animate();
  }

  loadModel(type) {
    while(this.modelGroup.children.length > 0){ this.modelGroup.remove(this.modelGroup.children[0]); }
    if (bordsData[type]) bordsData[type].build(this.modelGroup);
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
let activeType = 'recto';

function updateInfoView(type) {
  const data = bordsData[type];
  document.getElementById('infoTitle').textContent = data.name;
  document.getElementById('infoDesc').textContent = data.desc;
  document.getElementById('infoTheory').innerHTML = data.teoria;
  document.getElementById('infoBadge').textContent = data.badge;
  
  const paramsDiv = document.getElementById('infoParams');
  paramsDiv.innerHTML = '';
  data.params.forEach(p => {
    const s = document.createElement('span'); s.className = 'param-chip'; s.textContent = p;
    paramsDiv.appendChild(s);
  });
  studyApp.loadModel(type);
  studyApp.controls.autoRotate = true; 
}

updateInfoView(activeType);

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    activeType = e.target.dataset.type;
    updateInfoView(activeType);
  });
});

// CURSOS
const modulesData = {
  "1º GM Soldadura": ["Mecanizado", "Soldadura en Atmósfera Natural"],
  "2º GM Soldadura": ["Montaje", "Trazado", "Soldadura en Atmósfera Protegida (SAP)"],
  "1º GS Construcciones Metálicas": ["Procesos de Corte y Preparación", "Grafismo y Representación en Fab. Mecánica"],
  "2º GS Construcciones Metálicas": ["Diseño de Estructuras Metálicas", "Procesos de Unión y Montaje"]
};

document.getElementById('studentCourse').addEventListener('change', (e) => {
  const modSelect = document.getElementById('studentModule');
  modSelect.innerHTML = '<option value="" disabled selected>Selecciona tu módulo...</option>';
  modSelect.disabled = false;
  if (modulesData[e.target.value]) {
    modulesData[e.target.value].forEach(mod => {
      const opt = document.createElement('option'); opt.value = opt.textContent = mod;
      modSelect.appendChild(opt);
    });
  }
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
let scoreTotal = 6;
let timer = null;
let timeLeft = 25;

document.getElementById('btnStartExam').addEventListener('click', () => {
  const isOk = ['studentName','studentCourse','studentModule','examDate'].every(id => {
    const v = document.getElementById(id).value;
    document.getElementById(id).style.borderColor = !v ? 'red' : '#cbd5e1';
    return v;
  });
  
  if(!isOk) {
    const btn = document.getElementById('btnStartExam');
    const oldText = btn.textContent;
    btn.textContent = "❌ Rellena todos tus datos arriba";
    setTimeout(() => btn.textContent = oldText, 3000);
    return;
  }

  const studyP = document.getElementById('studyPanel');
  if(studyP) studyP.remove(); // Anti-cheat removal
  
  const examP = document.getElementById('examPanel');
  examP.style.display = 'block';

  // SITES PROOF: Esperar a que el DOM compute el tamaño del nuevo panel antes de iniciar Three.js
  setTimeout(() => {
    if (!examApp) {
      try {
        examApp = new App3D('examCanvas');
      } catch(e) { console.error("Error 3D:", e); }
    }

    let allQ = [];
    Object.keys(bordsData).forEach(k => {
      bordsData[k].questions.forEach(q => {
        allQ.push({ ...q, type: k });
      });
    });
    examQuestions = allQ.sort(()=>Math.random()-0.5).slice(0, 6);
    scoreTotal = examQuestions.length;
    document.getElementById('totalQuestions').textContent = scoreTotal;
    
    loadNextQuestion();
  }, 50);
});

function loadNextQuestion() {
  const q = examQuestions[currentQIdx];
  if(examApp) examApp.loadModel(q.type);
  
  document.getElementById('currentQuestionNum').textContent = currentQIdx + 1;
  document.getElementById('examQuestion').textContent = q.text;
  document.getElementById('progressBar').style.width = ((currentQIdx/scoreTotal)*100)+'%';
  
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

  timeLeft = 25;
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
  currentQIdx++;
  if(currentQIdx < scoreTotal) loadNextQuestion();
  else finishVal();
});

function finishVal() {
  document.querySelector('.exam-grid').style.display = 'none';
  document.querySelector('.panel-header').style.display = 'none';
  document.getElementById('evaluationPanel').style.display = 'block';
  
  const finalScore = (scoreRaw / scoreTotal) * 10;
  
  const arc = document.getElementById('scoreArc');
  const maxDash = 327;
  const dashVal = maxDash - (maxDash * (finalScore/10));
  setTimeout(()=> {
    arc.style.strokeDasharray = `${maxDash - dashVal} 327`;
    if(finalScore<5) arc.style.stroke = '#ef4444'; // Red
  }, 100);

  document.getElementById('scoreCircle').textContent = finalScore.toFixed(1) + '/10';
  document.getElementById('modalTitle').textContent = finalScore>=5 ? "¡Prueba Superada!" : "Necesitas Mejorar";
  document.getElementById('modalSummary').textContent = `Nota Final: ${finalScore.toFixed(1)}/10.`;
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
                modulo: "SAP",
                tipo: "Preparación de Bordes",
                ejercicio: "SAP - Preparación de Bordes",
                nota: ((scoreRaw / scoreTotal) * 10).toFixed(1),
                pdfNombre: pdfFilename,
                pdf: pdfResult.base64
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
  
  doc.line(20, y, PW - 20, y); y+=15; 
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resultado de la Prueba', 20, y); y+=15;
  
  const finalScore = ((scoreRaw / scoreTotal) * 10).toFixed(1);
  const color = finalScore >= 5 ? [21, 128, 61] : [220, 38, 38]; 
  
  doc.setFillColor(color[0], color[1], color[2]);
  doc.rect(PW/2 - 35, y, 70, 25, 'F'); 
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.text(`${finalScore} / 10`, PW/2, y + 17, { align: 'center' });
  
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.text('Documento generado automáticamente para el expediente del módulo SAP.', PW / 2, 280, { align: 'center' });
  
  const blob = doc.output('blob');
  const dataUri = doc.output('datauristring');
  const base64 = dataUri.split('base64,')[1];
  
  return { blob: blob, base64: base64 };
}
