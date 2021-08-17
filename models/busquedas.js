const fs = require("fs");
const axios = require("axios");
const ruta = "./db/database.json";

class Busquedas {
  historial = [];
  bdPath = "./db/database.json";
  constructor() {
    this.leerBD();
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  get paramsOpenWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  async cuidad(lugar = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox,
      });
      const resp = await instance.get();

      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        longitud: lugar.center[0],
        latitud: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async climaLugar(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `htttp://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsOpenWeather, lat, lon },
      });
      const resp = await instance.get();

      const { weather, main } = resp.data;

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(lugar) {
    if (this.historial.includes(lugar)) {
      return;
    }
    this.historial.unshift(lugar);
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };

    fs.writeFileSync(this.bdPath, JSON.stringify(payload));
  }
  leerBD() {
    if (!fs.existsSync(ruta)) {
      return null;
    }
    const infoSTR = fs.readFileSync(ruta, { encoding: "utf-8" });
    const data = JSON.parse(infoSTR);
    this.historial = data.historial;
  //  return data;
  }
}

module.exports = Busquedas;
