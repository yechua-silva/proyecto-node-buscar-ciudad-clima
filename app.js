require('dotenv').config();
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busqueda");


const main = async () => {
    
    const busquedas = new Busquedas
    let opt = '';

    
    do {
        opt = await inquirerMenu();
        
        switch ( opt ) {
            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ');
 
                // Buscar los lugares
                const lugares = await busquedas.ciudad( termino );
                
                // Seleccionar el lugar
                const id = await listarLugares( lugares );
                if ( id === '0') continue;

                const lugarSelec = lugares.find( lugar => lugar.id === id );


                // Desestructurar datos lugar
                const { nombre, lat, lng } = lugarSelec;
                // Guardar en DB
                busquedas.agregarHistorial( nombre );

                // Datos clima
                const clima = await busquedas.climaLugar( lat, lng );
                // Desestructurar datos clima
                const { desc, min, max, temp } = clima;

                // Mostrar resultados
                console.clear();
                console.log(`\nInformación de la ciudad\n`.green);
                console.log('Ciudad: ', nombre.green );
                console.log('Lat: ', lat);
                console.log('Lng: ', lng);
                console.log('Temperatura: ', temp,'°C'.yellow);
                console.log('Mínima: ', max,'°C'.yellow);
                console.log('Máxima: ', min,'°C'.yellow);
                console.log('Descripcion del Clima: ', desc.green );

            break;

            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log(`${ idx } ${ lugar }`);
                })

            break;
        }

        if ( opt !== 0 ) await pausa()
    } while ( opt !== 0 );
}

main();