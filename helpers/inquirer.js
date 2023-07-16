const inquirer = require('inquirer');
require('colors');
const prompt =  inquirer.createPromptModule();

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar Ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
        ]
    }
]

const inquirerMenu = async () => {

    console.clear();

    console.log('================================'.green);
    console.log('      Selecione una opción'.white);
    console.log('================================'.green);

    // Crear opciones
    const { opcion } = await prompt(preguntas);

    return opcion

}

const pausa = async () => {
    const pregunta = {
        type: 'input',
        name: 'continuar',
        message: `Presione ${'ENTER'.green} para continuar`
    };
    console.log('\n');
    await prompt(pregunta);
};

const leerInput = async ( message ) => {
    const pregunta = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if ( value.length === 0 ) {
                    return 'Por favor ingresar un valor';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt( pregunta );
    return desc
}

const listarLugares = async ( lugares = [] )  => {

    const choices = lugares.map( (lugar, i) => {
        const idx = `${i + 1}.`.green;
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    })

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    })
    
    const pregunta = [
        {
            type: 'list',
            name: 'id',
            message: 'Selecione lugar: ',
            choices
        }
    ]

    const { id } = await inquirer.prompt( pregunta )
    return id
}

const confirmar = async ( message ) => {
    const pregunta = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]
    // Retorna un boleano
    const { ok } = await inquirer.prompt( pregunta );
    return ok;
}

const mostrarListadoChecklist = async ( tareas = [] )  => {

    const choices = tareas.map( (tarea, i) => {
        const idx = `${i + 1}.`.green;
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: ( tarea.completaEn ) ? true : false
        }
    })

    
    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ]

    const { ids } = await inquirer.prompt( pregunta )
    return ids;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
}