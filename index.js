const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { log } = require('console');
const { exec } = require('child_process');
// variables globales 
const errores = [];
let numeroError = 1; // inicializar el contador de errores
let contenidoArchivo = ''; // Guarda el contenido del archivo, para usarlo despues :p

const rl = readline.createInterface({
    input: process.stdin, // Es para leer la entrada del usuario
    output: process.stdout // Es para mostrar la salida en consola
});

function mostrarMenu() {
    console.log('\n=== MENU DE OPCIONES ===');
    console.log('1. Cargar Archivo');
    console.log('2. Analizar Archivo');
    console.log('3. Generar Archivo de Errores');
    console.log('4. Reporte de Tokens');
    console.log('5. Salir');
}

function manejarOpcines(opcion) {
    switch (opcion) {
        case '1': 
            console.log('Haz seleccionado la Opción 1.');
            subMenuCargar();
            break;
        case '2':
            console.log('Haz seleccionado la Opción 2.');
            analizarArchivo();
            mostrarMenu();
            preguntarOpcion();
            break;
        case '3':
            console.log('Haz seleccionado la Opción 3.');
            generarErrorLex(contenidoArchivo);
            mostrarMenu();
            preguntarOpcion();
            break;
        case '4':
            console.log('Haz seleccionado la Opción 4.');
            subMenuReportes();
            break;
        case '5':
            console.log('Saliendo del Programa...');
            rl.close();
            return;
        default:
            console.log('Opción no válida.');
    }

    preguntarOpcion();
}

function preguntarOpcion() {
    rl.question('Seleccione una opción: ', (respuesta) => {
        manejarOpcines(respuesta);
    });
}

//************************************************************* Cargar Archivo ********************************************************/

// Submenú de Cargar Archivo
function subMenuCargar() {
    console.log('\n=== SUBMENÚ: CARGAR ARCHIVO ===');
    console.log('1. Abrir Archivo');
    console.log('2. Salir al Menú Principal');
    rl.question('Seleccione una opción: ', (respuesta) => {
        manejarSubMenuCargar(respuesta);
    });
}

function manejarSubMenuCargar(opcion2) {
    switch (opcion2) {
        case '1':
            console.log('Haz seleccionado la Opción 1.');
            abrirArchivo();
            break;
        case '2':
            console.log('Regresando al Menú Principal...');
            mostrarMenu();
            preguntarOpcion();
            break;
        default:
            console.log('Opción no válida.');
            subMenuCargar(); // Volver a mostrar el submenú
    }
}

function abrirArchivo() {
    console.log('Abriendo Archivo...');
    rl.question('Ingrese la ruta del archivo: ', (ruta) => {
        fs.readFile(ruta, 'utf8', (err, data) => {
            if (err) {
                console.log('Error al abrir el archivo. verifica la ruta')
                console.log(`Detalles del error: ${err.message}`);

            }else {
                console.log('Archivo cagado exitosamente...')
                contenidoArchivo = data; // Guarda el contenido del archivo 
            }
            mostrarMenu();
            preguntarOpcion();
        })
    }); 
    //console.log('Archivo cargado exitosamemente...');
    //subMenuCargar(); // Volver al submenú después de abrir el archivo
}


 //************************************************************* Analizar Archivo Lexicamente
function analizarArchivo() {
    console.log('\n== Analizando Archivo... ==');
    try{
        const data = JSON.parse(contenidoArchivo); // parsear el archivo 
        const tokens = [];

        function recorrerJSON(obj) { // Función recursiva para recorrer el JSON
            if(Array.isArray(obj)) {
                tokens.push({token: 'L_CORCHETE', lexema: '['});
                obj.forEach((item) => {
                    recorrerJSON(item);
                });
                tokens.push({token: 'R_CORCHETE', lexema: ']'});
            } else if (typeof obj === 'object' && obj !== null) {
                tokens.push({token: 'L_LLAVE', lexema: '{'});
                for (const clave in obj) {
                    tokens.push({token: 'clave', lexema: clave});
                    recorrerJSON(obj[clave]);
                }
                tokens.push({token: 'R_LLAVE', lexema: '}'});
            } else if (typeof obj === 'string') {
                tokens.push({token: 'texto', lexema: obj});
            } else if (typeof obj === 'number') {
                tokens.push({ token: 'numero', lexema: obj});
            } else {
                tokens.push({ token: 'otro', lexema: obj});
            }
        }

        recorrerJSON(data); // Llamar a la función recursiva

        // Mostrar los tokens en consola
        console.log('\nTokens Reconocidos: ');
        console.table(tokens);
        console.log('\nFin del Análisis...');

    } catch (err) {
        console.log('Error al analizar el archivo. Verifica que el archivo sea un JSON válido.');
        console.log('Detalles del error: ${err.message}');
    }

}

//************************************************************* generar Archivo de Errores ********************************************************/

function validarOperaciones(data) {
    console.log('Generando Archivos de Errores...');

    if (!data.operaciones || !Array.isArray(data.operaciones)) {
        errores.push(generarDescripcionError(
            'operaciones',
            "raiz",
            1,
            1,
            "La Clave 'operaciones' es requerida y debe ser un array."
        ));
        return; 
    }

    data.operaciones.forEach((operacion, index) => {
        if (!operacion.operacion || typeof operacion.operacion !== 'string') {
            errores.push(generarDescripcionError(
                operacion.operacion || null, 
                `operaciones[${index}].operacion`,
                index + 1,
                1,
                "La Clave 'operacion' debe ser un string."
            ));
        }

        validarValor(operacion.valor1, `operaciones[${index}].valor1`, index + 1);
        validarValor(operacion.valor2, `operaciones[${index}].valor2`, index + 1);

        Object.keys(operacion).forEach((clave) => {
            if (!['operacion', 'valor1', 'valor2'].includes(clave)) {
                errores.push(generarDescripcionError(
                    clave,
                    `operaciones[${index}].${clave}`,
                    index + 1, 
                    1, 
                    `La Clave '${clave}' no es válida.`
                ));
            }

        });

    });
   
}

function validarValor(valor, path, fila) {
    if (typeof valor == 'number') {
        return;  // es un numero valido
    } else if (Array.isArray(valor)) {
        valor.forEach((item, index) => {
            if (typeof item === 'object' && item !== null && item.operacion) {
                validarOperaciones({ operaciones: [item] });
            }else {
                errores.push(generarDescripcionError(
                    item,
                    `${path}[${index}]`,
                    fila,
                    index + 1,
                    "El valor debe ser un número."
                ));
            }
        });
    } else {
        errores.push(generarDescripcionError(
            valor,
            path,
            fila,
            1,
            `El valor en'${path}' no es válido.`
        ));
    }
}

function generarDescripcionError(lexema, path, fila, columna, mensaje) {
    let lexemaStr = typeof lexema === 'object' ? JSON.stringify(lexema) : lexema;

    return {
        No: numeroError++,
        descripcion: {
            lexema: lexemaStr,
            tipo: 'Error Lexico',
            columna: columna,
            fila: fila, 
            mensaje: mensaje,
        },
    };
}

function generarErrorLex(contenidoArchivo){
    try {
        const data = JSON.parse(contenidoArchivo);
        console,log('\n=== Analiando Archivo para errores lexicos ... ===');

        validarOperaciones(data);

        if (errores.length > 0) {
            console.log('Errores lexicos encontrados:', errores.length);
            console.table(errores);

            // Guardar los errores en un archivo
            fs.writeFileSync('errores.json', JSON.stringify({ errores }, null, 2));
            console.log('Los errores se han guardado en el archivo "errores.json"');
        }else {
            console.log('No se encontraron errores lexicos.');
        }
    } catch (err) {
        console.log('Error al analizar el archivo. Verifica que el archivo sea un JSON válido.');
        console.log(`Detalles del error: ${err.message}`);
    }
}

//************************************************************* reportes ********************************************************/


function subMenuReportes() {
    console.log('\n=== SUBMENÚ: REPORTES ===');
    console.log('1. Generar Diagrama del Archivo Analizado');
    console.log('2. Tabla de Tokens');
    console.log('3. Tabla de Errores');
    console.log('4. Salir al Menú Principal');
    rl.question('Seleccione una oppcion: ', (respuesta3) => {
        manejarSubMenuReportes(respuesta3);
    });

}

function manejarSubMenuReportes(opcion3) {
    switch (opcion3) {
        case '1':
            console.log('Haz seleccionado la opcion 1.');
            generarDiagrama();
            subMenuReportes();
            break;
        case '2':
            console.log('Haz seleccionado la opcion 2.');
            //tokensHTML();
            const tokenizer = new Tokenizer(contenidoArchivo);
            tokenizer.parsear();
            subMenuReportes();
            break;
        case '3':
            console.log('Haz seleccionado la opcion 3.');
            //tablaErrores(); 
            const reporteErrores = new ErrorReporte();
            reporteErrores.procesarArchivo(contenidoArchivo);
            reporteErrores.generarHTML();
            subMenuReportes();
            break;
        case '4':
            mostrarMenu();
            preguntarOpcion();
            break;
        default:
            console.log('Opción no válida.');
            subMenuReportes();
    }
}

function generarDiagrama() {
    console.log('Generando Diagrama del Archivo Analizado...');

    try {
        const data = JSON.parse(contenidoArchivo); // Analizar el archivo cargado
        if (!data.operaciones || !Array.isArray(data.operaciones)) {
            console.log('El archivo no contiene un bloque válido de operaciones.');
            return;
        }

        // Configuración para estilos desde el JSON
        const coloresPermitidos = {
            rojo: 'red',
            azul: 'blue',
            negro: 'black'
        };
        const config = data.configuraciones ? data.configuraciones[0] : {};
        const fondo = coloresPermitidos[config.fondo.toLowerCase()] || 'red';
        const fuente = coloresPermitidos[config.fuente.toLowerCase()] || 'black';
        const forma = config.forma || 'circle'; // Default circle
        const formasPermitidas = { circle: "circle", diamond: "diamond", square: "box" };
        const formaNodo = formasPermitidas[forma.toLowerCase()] || "circle";

        let graphContent = 'digraph operaciones {\n';
        graphContent += `node [style=filled, shape=${formaNodo}, color=${fondo}, fontcolor=${fuente}];\n`;

        let nodeId = 0; // Para identificadores únicos de nodos

        function procesarOperacion(operacion, parentNode = null) {
            if (!operacion.operacion) {
                console.log('Operación no válida encontrada:', operacion);
                return null;
            }

            // Función para calcular los resultados
            function calcularResultados(op, valor1, valor2) {
                switch (op.toLowerCase()) {
                    case 'suma':
                        return valor1 + (valor2 || 0);
                    case 'resta':
                        return valor1 - (valor2 || 0);
                    case 'multiplicacion':
                        return valor1 * (valor2 || 1);
                    case 'division':
                        return valor2 !== 0 ? valor1 / valor2 : "infinito";
                    case 'potencia':
                        return Math.pow(valor1, valor2 || 1);
                    case 'raiz':
                        return Math.pow(valor1, 1 / valor2 || 1);
                    case 'inverso':
                        return valor1 !== 0 ? 1 / valor1 : "infinito";
                    case 'seno':
                        return Math.sin((valor1 * Math.PI) / 180);
                    case 'coseno':
                        return Math.cos((valor1 * Math.PI) / 180);
                    case 'tangente':
                        return Math.tan((valor1 * Math.PI) / 180);
                    case 'mod':
                        return valor1 % valor2;
                    default:
                        return null;
                }
            }

            function obtenerValor(valor) {
                if (typeof valor === 'object' && !Array.isArray(valor)) {
                    return procesarOperacion(valor);
                } else if (Array.isArray(valor)) {
                    return valor
                        .map(obtenerValor)
                        .reduce((a, b) => a + b, 0);
                } else {
                    return valor;
                }
            }

            const valor1 = obtenerValor(operacion.valor1);
            const valor2 = operacion.valor2 !== undefined ? obtenerValor(operacion.valor2) : null;

            const resultado = calcularResultados(operacion.operacion, valor1, valor2);

            if (resultado === null) {
                console.log("Operación no soportada:", operacion.operacion);
            }

            const currentId = `node${nodeId++}`;
            const label = `${operacion.operacion.toUpperCase()}\\nResultado: ${resultado}`;
            graphContent += `${currentId} [label="${label}"];\n`;

            if (parentNode) {
                graphContent += `${parentNode} -> ${currentId};\n`;
            }

            // Procesar valores recursivamente
            if (operacion.valor1 !== undefined) {
                procesarValor(operacion.valor1, currentId);
            }

            if (operacion.valor2 !== undefined) {
                procesarValor(operacion.valor2, currentId);
            }

            return resultado;
        }

        function procesarValor(valor, parentId) {
            if (typeof valor === 'object' && !Array.isArray(valor)) {
                procesarOperacion(valor, parentId);
            } else if (Array.isArray(valor)) {
                valor.forEach((item) => procesarValor(item, parentId));
            } else {
                const valueId = `node${nodeId++}`;
                graphContent += `${valueId} [label="${valor}"];\n`;
                if (parentId) {
                    graphContent += `${parentId} -> ${valueId};\n`;
                }
            }
        }

        // Recorrer todas las operaciones iniciales
        data.operaciones.forEach((operacion) => procesarOperacion(operacion));

        graphContent += '}\n';

        // Guardar el archivo DOT y generar la imagen
        const dotFilePath = path.join(__dirname, 'operaciones.dot');
        const outputImagePath = path.join(__dirname, 'operaciones.png');

        fs.writeFileSync(dotFilePath, graphContent);

        exec(`dot -Tpng "${dotFilePath}" -o "${outputImagePath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error('Error al generar el diagrama:', error.message);
                return;
            }
            if (stderr) {
                console.error('Detalles del error:', stderr);
                return;
            }
            console.log('Diagrama generado exitosamente en "operaciones.png".');
        });

    } catch (err) {
        console.log('Error al generar el diagrama. Verifica que el archivo sea un JSON válido.');
        console.log(`Detalles del error: ${err.message}`);
    }
} // fin de la funcion generarDiagrama

//************************************************************* tabla de tokens *************************************** */


    class Token {
        constructor(token, lexema, linea, columna) {
          this.token = token;
          this.lexema = lexema;
          this.linea = linea;
          this.columna = columna;
        }
      }
      
      class Tokenizer {
        constructor(contenidoArchivo) {
          this.contenidoArchivo = contenidoArchivo;
          this.tokens = [];
          this.linea = 1;
          this.columna = 1;
        }
      
        parsear() {
          try {
            const data = JSON.parse(this.contenidoArchivo);
            if (!data.operaciones || !Array.isArray(data.operaciones)) {
              console.log('El archivo no contiene un bloque válido de operaciones.');
              return;
            }
      
            data.operaciones.forEach((operacion) => this.procesarOperacion(operacion));
      
            const tablaHTML = this.generarTablaHTML();
            fs.writeFileSync('tokens.html', tablaHTML);
            console.log('Tabla de Tokens generada exitosamente en "tokens.html".');
          } catch (err) {
            console.log('Error al generar la tabla de tokens. Verifica que el archivo sea un JSON válido.');
            console.log(`Detalles del error: ${err.message}`);
          }
        }
      
        procesarOperacion(operacion) {
          if (!operacion.operacion) {
            console.log('Operación no válida encontrada:', operacion);
            return;
          }
      
          this.tokens.push(new Token(operacion.operacion, 'operación', this.linea, this.columna));
          this.columna += operacion.operacion.length;
      
          this.procesarValor(operacion.valor1);
      
          if (operacion.valor2 !== undefined) {
            this.procesarValor(operacion.valor2);
          }
      
          this.linea++;
          this.columna = 1;
        }
      
        procesarValor(valor) {
          if (typeof valor === 'object' && !Array.isArray(valor)) {
            this.procesarOperacion(valor);
          } else if (Array.isArray(valor)) {
            valor.forEach((item) => this.procesarValor(item));
          } else {
            this.tokens.push(new Token(valor, 'valor', this.linea, this.columna));
            this.columna += valor.toString().length;
          }
        }
      
        generarTablaHTML() {
          const tableRows = this.tokens.map((token) => `
            <tr>
              <td>${token.token}</td>
              <td>${token.lexema}</td>
              <td>${token.linea}</td>
              <td>${token.columna}</td>
            </tr>
          `).join('');
      
          return `
            <html>
              <head>
                <title>Tabla de Tokens</title>
                <style>
                  table {
                    border-collapse: collapse;
                    width: 100%;
                  }
                  th, td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                  }
                  th {
                    background-color: #f2f2f2;
                  }
                </style>
              </head>
              <body>
                <h1>Tabla de Tokens</h1>
                <table>
                  <tr>
                    <th>Token</th>
                    <th>Lexema</th>
                    <th>Línea</th>
                    <th>Columna</th>
                  </tr>
                  ${tableRows}
                </table>
              </body>
            </html>
          `;
        }
      }
//************************************************************* tabla de errores *************************************** */
      class ErrorReporte {
        constructor() {
            this.errores = []; // Lista para almacenar los errores
        }
    
        // Método para agregar un error
        agregarError(token, descripcion, linea, columna) {
            this.errores.push({ token, descripcion, linea, columna });
        }
    
        // Método para procesar el archivo de entrada
        procesarArchivo(contenidoArchivo) {
            console.log('Procesando archivo para detectar errores...');
            try {
                const data = JSON.parse(contenidoArchivo);
    
                if (!data.operaciones || !Array.isArray(data.operaciones)) {
                    this.agregarError("Operaciones", "El bloque de operaciones es inválido o no existe", 1, 1);
                    return;
                }
    
                let linea = 1; // Para simular las líneas
                let columna = 1;
    
                const procesarOperacion = (operacion) => {
                    if (!operacion.operacion) {
                        this.agregarError("Operación", "Falta la clave 'operacion'", linea, columna);
                        return;
                    }
    
                    if (typeof operacion.valor1 === "undefined") {
                        this.agregarError(operacion.operacion, "Falta el valor1 en la operación", linea, columna);
                    }
    
                    if (operacion.valor2 === null) {
                        this.agregarError(operacion.operacion, "Falta el valor2 en la operación", linea, columna);
                    }
    
                    const procesarValor = (valor) => {
                        if (typeof valor === "object" && !Array.isArray(valor)) {
                            procesarOperacion(valor);
                        } else if (Array.isArray(valor)) {
                            valor.forEach(procesarValor);
                        } else if (typeof valor !== "number") {
                            this.agregarError(valor, "El valor no es válido", linea, columna);
                        }
                    };
    
                    procesarValor(operacion.valor1);
                    if (operacion.valor2 !== undefined) {
                        procesarValor(operacion.valor2);
                    }
    
                    linea++; // Simular cambio de línea
                };
    
                data.operaciones.forEach((operacion) => {
                    columna = 1; // Reiniciar columna para cada operación
                    procesarOperacion(operacion);
                });
    
            } catch (err) {
                this.agregarError("Archivo JSON", `Error de sintaxis: ${err.message}`, 1, 1);
            }
        }
    
        // Método para generar el HTML
        generarHTML() {
            if (this.errores.length === 0) {
                console.log("No se encontraron errores.");
                return;
            }
    
            const tablaHTML = `
                <html>
                <head>
                    <title>Tabla de Errores</title>
                    <style>
                        table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        th, td {
                            border: 1px solid black;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                    </style>
                </head>
                <body>
                    <h1>Tabla de Errores</h1>
                    <table>
                        <tr>
                            <th>Token</th>
                            <th>Descripción</th>
                            <th>Línea</th>
                            <th>Columna</th>
                        </tr>
                        ${this.errores.map((error) => `
                            <tr>
                                <td>${error.token}</td>
                                <td>${error.descripcion}</td>
                                <td>${error.linea}</td>
                                <td>${error.columna}</td>
                            </tr>
                        `).join('')}
                    </table>
                </body>
                </html>
            `;
    
            fs.writeFileSync('errores.html', tablaHTML);
            console.log('Tabla de Errores generada exitosamente en "errores.html".');
        }
    }
    

// Iniciar el programa
mostrarMenu();
preguntarOpcion();
