const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath= './db/database.json';

    constructor() {
        // TODO: Leer db si existe
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {
            // Arreglo de palabras que componen el lugar - seprados por cada " "
            let palabras = lugar.split(' ')
            // Capitalizar primera letra de cada palabra del arreglo
            palabras = palabras.map( palabra => palabra[0].toUpperCase() + palabra.substring(1))
            // Se une cada palabra del arreglo con un " "
            return palabras.join(' ');
        })
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY || '',
            'language' : 'es'
        }
    }

    get paramsWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY || '',
            'units': 'metric',
            'lang': 'es',
        }
    }
    async ciudad( lugar = '' ) {

        try {
            // Peticion http
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const resp = await intance.get();
            return resp.data.features.map( lugar => ({ // Retornar objeto de forma implicita con map( lugar => ({ objeto}))
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))
            
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async climaLugar ( lat, lon ) {
        try {
            //instance axios.create()
            // const intance = axios.create({
            //     baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_KEY}&units=metric&lang=es`

            // });
            const intance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
                params: this.paramsWeather
            })

            // Resp.data
            const resp = await intance.get();

            // Descripcion
            const { description } = resp.data.weather[0];
            // temp - temp_min - temp_max
            const { temp, temp_min, temp_max } = resp.data.main;

            return {
                desc: description,
                min: temp_min,
                max: temp_max,
                temp: temp
            }
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial( lugar = '' ) {
        // Prevenir duplicados
        if ( this.historial.includes( lugar.toLocaleLowerCase())) {
            return;
        }

        this.historial = this.historial.splice(0, 5);

        this.historial.unshift( lugar.toLocaleLowerCase() );

        // Grabar DB
        this.guardarDb();
    }

    guardarDb() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );
    }

    leerDB() {
        // Debe de existir
        if ( !fs.existsSync( this.dbPath ) ) return ;

        //Lo lee como strig y lo devuelve asi
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf8'});

        // Transformar en JSON
        const data = JSON.parse( info );

        this.historial = data.historial;
    }
}

module.exports = Busquedas;