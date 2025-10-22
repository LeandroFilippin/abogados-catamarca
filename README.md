# "documentacion"

## Como cambiar portada y segundo de inicio de video

- estan configurados de forma independiente, la portada se define en [generar-posters.js](./generar-posters.js) ello que hace es seleccionar el frame del video que quiero de portada. Por otro lado en [script.js](./script.js) se define el segundo exacto de inicio del video para la preview al pasar el mouse. (al poner el video en pantalla completa, comienza desde el inicio).

### Inicio de video preview

En el archivo [script.js](./script.js), vamos a //preview de videos al pasar el mouse linea 33 y solo modificamos los numeros de las variables, estan en segundos.

```js

const VIDEO_START_TIMES = {
        'videos/1.mp4': 16,
        'videos/2.mp4': 5.5,
        'videos/3.mp4': 8,
        'videos/4.mp4': 1,
        'videos/5.mp4': 4,
        'videos/6.mp4': 6
    };

```

### Vista de portada

En el script [generar-posters.js](./generar-posters.js) vamos a la linea 3 y cambiamos exactamente igual las variables que en el codigo anterior.

```js

const POSTER_TIMES = {
        'videos/1.mp4': 16,
        'videos/2.mp4': 5.5,
        'videos/3.mp4': 8,
        'videos/4.mp4': 1,
        'videos/5.mp4': 4,
        'videos/6.mp4': 6
    };

```

**Se penso de forma individual para tener mayor flexibilidad a la hora de modificar la preview del video y la portada.**
