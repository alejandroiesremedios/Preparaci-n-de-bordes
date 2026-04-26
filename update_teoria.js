const fs = require('fs');

const filePath = 'F:/TRABAJO/APLICACIONES/EJERCICIOS Y ACTIVIDADES INTERACTIVAS/SAP/preparacion-bordes/script.js';
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
    {
        old: /teoria:\s*`<b>Definición:<\/b> Unión a tope con bordes rectos\. Es la preparación más económica al eliminar el biselado\.<br><b>Aplicación:<\/b> Limitada a espesores finos \(< 3-4 mm\)\. En espesores mayores, el arco no alcanza la raíz, causando una falta de penetración total\.`,/,
        new: "teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>Bordes rectos [Square groove weld]:</b> Unión a tope sin preparación especial en los bordes. Es la geometría más económica al eliminar el biselado mecanizado.<br><br><b>Aplicación crítica:</b> Limitada a chapas de espesor fino (generalmente < 3 mm). En espesores mayores, la falta de apertura [Root opening] impide que el arco alcance la zona inferior, causando una falta de penetración total [Incomplete joint penetration].`,"
    },
    {
        old: /teoria:\s*`<b>Definición:<\/b> También llamada Bisel Simple\. Se utiliza cuando solo se puede acceder o mecanizar una de las piezas\.<br><b>Geometría:<\/b> Una pieza a 90º y la otra con chaflán inclinado\.`,/,
        new: "teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>Bisel simple [Single-bevel groove weld]:</b> Preparación asimétrica donde solo una de las piezas es mecanizada con un ángulo de bisel [Bevel angle], mientras la otra permanece recta a 90°.<br><br><b>Aplicación técnica:</b> Se utiliza frecuentemente en uniones en T o cuando el acceso a una de las piezas está restringido. Presenta una cara de la raíz [Root face] y una separación [Root gap] para facilitar la penetración.`,"
    },
    {
        old: /teoria:\s*`<b>Definición:<\/b> Es el estándar universal para espesores medios \(5-15 mm\)\. Ofrece un acceso equilibrado del electrodo a la raíz\.`,/,
        new: "teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>V simple [Single-V groove weld]:</b> Estándar universal de preparación simétrica por un solo lado. Ambas piezas se biselan formando un ángulo de ranura total [Groove angle] típicamente de 60°. <br><br><b>Talón de raíz [Root face]:</b> Se deja un pequeño borde sin achaflanar en la parte inferior para evitar que la primera pasada desfonde la junta por exceso de calor.`,"
    },
    {
        old: /teoria:\s*`<b>Definición:<\/b> Se usa para grandes espesores y acceso por ambos lados\. Reduce la distorsión angular y el consumo de metal\.`,/,
        new: "teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>V doble [Double-V groove weld]:</b> Preparación bilateral para grandes espesores que exige acceso por ambos lados de la estructura.<br><br><b>Ventaja estructural:</b> Reduce el volumen de metal de aportación [Filler metal] necesario y minimiza drásticamente la distorsión angular [Angular distortion] al equilibrar las tensiones térmicas soldando por ambas caras alternativamente.`,"
    },
    {
        old: /teoria:\s*`<b>Definición:<\/b> Similar a la Y pero con fondo redondeado \(U\)\. Ofrece mejor acceso a la raíz en espesores elevados\.`,/,
        new: "teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>J simple [Single-J groove weld]:</b> Variante asimétrica avanzada donde la pieza mecanizada presenta un fondo redondeado [Root radius] en lugar de un vértice afilado.<br><br><b>Mecanizado:</b> Su coste de preparación es elevado, pero asegura una excelente penetración en la raíz en grandes espesores donde el espacio está restringido y no se puede abrir una V.`,"
    },
    {
        old: /teoria:\s*`<b>Definición:<\/b> La mejor opción para espesores muy gruesos\. Ahorra mucho hilo\/electrodo frente a la V\.`,/,
        new: "teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>U simple [Single-U groove weld]:</b> Geometría curva simétrica diseñada específicamente para espesores muy pesados.<br><br><b>Eficiencia de aportación:</b> Su principal ventaja es el ahorro masivo de metal de aportación respecto a una V en espesores altos, ya que las paredes curvas evitan que la parte superior de la ranura se abra excesivamente.`,"
    },
    {
        old: /teoria:\s*`<b>Definición:<\/b> Equivalente a una X pero con una cara recta\. Se usa mucho en uniones en T de gran espesor\.`,/,
        new: "teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>Bisel doble [Double-bevel groove weld]:</b> Preparación asimétrica bilateral. Una pieza se mecaniza por arriba y por abajo, mientras la pieza base permanece intacta a 90°.<br><br><b>Uso principal:</b> Es la junta reina en uniones en T de alto compromiso estructural sometidas a cargas dinámicas extremas [Dynamic loads] que requieren penetración completa [CJP].`,"
    },
    {
        old: /teoria:\s*`<b>Definición:<\/b> Variante de la J simple aplicada en ambos lados de la chapa\. Se utiliza cuando solo se puede mecanizar una de las piezas, pero el gran espesor exige soldar por ambas caras para equilibrar tensiones\.`,/,
        new: "teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>J doble [Double-J groove weld]:</b> Geometría avanzada que combina un lado recto y otro con doble curva bilateral.<br><br><b>Equilibrio de tensiones:</b> Obligatoria cuando un componente de muy alto espesor solo puede mecanizarse por una cara, pero las especificaciones de fatiga [Fatigue life] exigen soldadura bilateral para minimizar tensiones residuales [Residual stresses].`,"
    },
    {
        old: /teoria:\s*`<b>Definición:<\/b> Es la preparación más eficiente para espesores extremadamente gruesos \(>40mm\)\. Combina las ventajas de la U simple con la distribución de tensiones de la soldadura por ambas caras\.`,/,
        new: "teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS D1.1 (código de soldadura estructural en acero).<br><br><b>U doble [Double-U groove weld]:</b> La máxima expresión de ahorro de material en soldaduras de penetración completa para bloques extremadamente masivos (> 40 mm).<br><br><b>Sinergia térmica:</b> Une las ventajas del mínimo volumen de ranura curvo con la compensación de contracciones al poder alternar pasadas de raíz [Root pass] por ambas caras de la junta.`,"
    },
    {
        old: /teoria:\s*`<b>Definición:<\/b> Unión donde una de las chapas se dobla 90° para formar una pestaña\. El propio material de la pestaña se funde para crear el cordón, a menudo sin necesidad de añadir hilo o electrodo externo\.`,/,
        new: "teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS A3.0 (términos y definiciones estándar de soldadura).<br><br><b>Canto rebordeado simple [Single-flange weld]:</b> Conformado en frío donde una de las chapas finas se dobla 90° para crear una pestaña vertical paralela a la otra pieza plana.<br><br><b>Soldadura autógena:</b> La propia pestaña hace las veces de material base y de aporte, fundiéndose durante el proceso GTAW (TIG) sin requerir varilla externa.`,"
    },
    {
        old: /teoria:\s*`<b>Definición:<\/b> Ambas chapas finas se doblan 90° hacia arriba y se juntan\. El arco funde ambas pestañas a la vez\. Es ideal para soldadura TIG autógena \(sin material de aporte\) en tanques de chapa fina\.`,/,
        new: "teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 9692-1 (preparación de juntas para soldadura) / AWS A3.0 (términos y definiciones estándar de soldadura).<br><br><b>Canto rebordeado doble [Double-flange weld]:</b> Variante simétrica donde ambas piezas de chapa fina sufren un plegado de 90° y se alinean cara a cara.<br><br><b>Sellado industrial:</b> Es la solución perfecta para el sellado estanco y automatizado de depósitos delgados, permitiendo velocidades de avance muy rápidas mediante la fusión conjunta de las dos pestañas [Flanges].`,"
    }
];

let replacedCount = 0;
for (const rep of replacements) {
    if (rep.old.test(content)) {
        content = content.replace(rep.old, rep.new);
        replacedCount++;
    } else {
        console.warn('Could not find match for:', rep.old);
    }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Successfully replaced ${replacedCount} items.`);
