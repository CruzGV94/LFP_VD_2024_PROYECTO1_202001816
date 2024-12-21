# NodeLex: Escaner Léxico y Procesador Numerico con Node.js 
## MANUAL DE USUARIO 
 A continuación, se detalla el uso y las tecnologías empleadas en la implementación de este proyecto. Este documento tiene como objetivo proporcionar una guía clara y precisa para la operación del sistema.
 ## Tecnologias Utilizadas
## Node.js 
Node.js es un entorno de ejecución usado para ejecutar código JavaScript en los servidores. Permite ejecutar JavaScript sin necesidad de un navegador web. Node.js es compatible con sistemas operativos como Windows, macOS y Linux. Es una plataforma de código abierto, por lo que todos los usuarios pueden acceder al código fuente de forma gratuita.
### INSTRUCCIONES DE USO 
para poner en funcionamiento el programa, siga las siguientes instrucciones: 
* #### Ejecución del programa
* 1.  Navegue a la carpeta raiz del proyecto.
* 2. Ejecute el siguiente codigo a la terminal:
* #### npm run start 
### FLUJO DEL PROGRAMA 
Al ejecutar el programa se desplejará un menú de opciones. 
![menu](/capturas/menu.jpg)
### Opcion 1 
Al seleccionar esta opción, se desplegará un submenú con las siguientes opciones:
![submenucargar](/capturas/CargaArchivo%20.jpg)
Se solicitará al usuario ingresar la ruta del archivo de entrada con extensión .json.
![ruta](/capturas/CargaExitosa.jpg)
Si la carga del archivo es exitosa, se mostrará un mensaje de confirmación.
### Opcion 2
Esta opción requiere que el archivo de entrada haya sido cargado previamente. El programa procederá a realizar un análisis léxico, generando una tabla de tokens:
![Tokens](/capturas/Analizar.jpg)
### Opcion 3
Seleccionando esta opción, el programa generará un archivo JSON que listará los errores léxicos identificados en el archivo de entrada. Una vez completada esta operación, se mostrará un mensaje de éxito en la consola:
![Errores](/capturas/GenerarArchivo.jpg)
### Opcion 4 
Al seleccionar esta opción, se desplegará un submenú con las siguientes funcionalidades:
![reportes](/capturas/Reportes.jpg)
* Opcion 1: Generar un diagrama que represente las operaciones encontradas en el archivo de entrada.

* Opcion 2: Crear un archivo HTML con la tabla de tokens identificados.

* Opcion 3: Producir un archivo HTML que contenga la tabla de errores léxicos encontrados.

* Opcion 4: Regresar al menú principal. 
### Salir 
![salir](/capturas/Salir.jpg)
Para finalizar la ejecución del programa, seleccione la opción 5 del menú principal:
# MANUAL TÉCNICO
Este manual describe el funcionamiento técnico del programa desarrollado en Node.js. El código implementa un sistema de análisis léxico, validación de datos JSON y generación de reportes con diagramas y tablas.
## Requerimiento Previos 
1. #### Node.js: version 14 o superior. 
2. #### Modulos Nativos de Node.js
* readline: Para la interacción por consola.

* fs: Para la manipulación de archivos.

* path: Para el manejo de rutas.

* child_process: Para la ejecución de comandos del sistema.
3. Dependencias Adicionales:

* graphviz: Utilizado para la generación de diagramas a partir de archivos DOT.
## Estructura del Codigo
![globales](/capturas/varaiablesGlobales.jpg)
* errores: Arreglo que almacena los errores detectados durante el análisis.

* numeroError: Contador para enumerar los errores léxicos.

* contenidoArchivo: Variable que guarda el contenido del archivo JSON cargado.
### Interaccion con el Usuario
![menu](/capturas/MostrarMenu.jpg)
* mostrarMenu: Muestra las opciones disponibles al usuario.

* manejarOpciones: Procesa la selección del usuario y llama a la función correspondiente.
![preguntar](/capturas/Preguntar.jpg)
preguntarOpcion: Solicita al usuario una opción y la procesa.
### Analisis del Archivo
![analisis](/capturas/FuncionAnalizar.jpg)
* Función Principal: analizarArchivo.

### Proceso:

* Parsea el contenido JSON utilizando JSON.parse.

* Utiliza una función recursiva recorrerJSON para identificar tokens.

* Clasifica elementos JSON en tipos como llaves, arreglos, números y cadenas.

* Muestra los tokens identificados en una tabla.
### Generación de Archivo de Errores
![error](/capturas/GenerarErrorLex.jpg)
* Función Principal: generarErrorLex.

* Validaciones Implementadas:

* Verifica la existencia y estructura de la clave operaciones.

* Comprueba que los valores sean numéricos o estructuras JSON válidas.

* Genera descripciones detalladas de los errores y los almacena en el archivo errores.json.
### Reportes
![Diagrama](/capturas/GenerarDiagrama.jpg)
* La función generarDiagrama genera un grafo DOT con las operaciones encontradas en el JSON.

* Se utiliza child_process para ejecutar Graphviz y generar una imagen PNG del diagrama.
### Configuracion Visual de Diagrama
* Personalizable a través de las claves configuraciones en el JSON cargado.

Opciones Disponibles:

fondo: Color de fondo de los nodos (rojo, azul, negro).

fuente: Color del texto dentro de los nodos.

forma: Forma de los nodos (círculo, diamante, cuadrado).
# REQUERIMIENTOS DEL SISTEMA
El programa realizado en Visual Studio Code, funciona con el sistema operativo Windows, desde la version 7 en adelante, requiere no mas de 1 GB de ram y procesador desde core i3. 
### Requisitos Míminos
* Contar con Node.js instalado en el sistema operativo, version 14 o superior. 
* Sistema Operativo Windows o Linux. 
* Procesador: Intel core Celeron. 
* Memoria RAM: 1GB. 
* Resolucion de pantalla: 1280x720 pixeles
### Expresion regular asociada 
\{
\s*"operaciones"\s*:\s*\[
\s*(\{
\s*"operacion"\s*:\s*"([a-zA-Z]+)"\s*,\s*"valor1"\s*:\s*([\d.]+|\[[^\]]+\])\s*,\s*"valor2"\s*:\s*([\d.]+|\[[^\]]+\])\s*\}\s*,\s*)*(\{
\s*"operacion"\s*:\s*"([a-zA-Z]+)"\s*,\s*"valor1"\s*:\s*([\d.]+|\[[^\]]+\])\s*,\s*"valor2"\s*:\s*([\d.]+|\[[^\]]+\])\s*\}\s*\]\s*,\s*"configuraciones"\s*:\s*\[
\s*(\{
\s*"texto"\s*:\s*"([a-zA-Z]+)"\s*,\s*"fondo"\s*:\s*"([a-zA-Z]+)"\s*,\s*"fuente"\s*:\s*"([a-zA-Z]+)"\s*,\s*"forma"\s*:\s*"([a-zA-Z]+)"\s*\}\s*\]
\}
### Metodo del Arbol 
![arbol](/capturas/ArbolER.jpg)
### AFD
![AFD](/capturas/AFD.png)



    
