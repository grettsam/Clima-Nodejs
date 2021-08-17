require("dotenv").config();
const {
  leerInput,
  inquireMenu,
  pausa,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
  const busquedas = new Busquedas();
  let opt = "";
  do {
    opt = await inquireMenu();
    switch (opt) {
      case 1:
        const termino = await leerInput("Seleccione un lugar:");
        const lugares = await busquedas.cuidad(termino);
        const id = await listarLugares(lugares);
        if (id === "0") {
          continue;
        }

        const lugarSelec = lugares.find((l) => l.id === id);

        busquedas.agregarHistorial(lugarSelec.nombre);

        const clima = await busquedas.climaLugar(
          lugarSelec.latitud,
          lugarSelec.longitud
        );

        console.clear();
        console.log("\nInformación de la ciudad\n".blue);
        console.log("Cuidad:", lugarSelec.nombre);
        console.log("Latitud:", lugarSelec.latitud);
        console.log("Longitud:", lugarSelec.longitud);
        console.log("Temperatura:", clima.temp);
        console.log("Temp Min:", clima.min);
        console.log("Temp Max:", clima.max);
        console.log("Como esta el clima:", clima.desc);
        break;
      case 2:
        busquedas.historial.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${lugar}`);
        });
        break;
      case 0:
        console.log("Salir");
        break;
    }
    await pausa();
  } while (opt !== 0);
};

main();
