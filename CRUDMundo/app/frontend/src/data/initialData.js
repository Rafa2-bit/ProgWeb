// Mocks apenas para a página de APIs externas (OpenWeatherMap / REST Countries)
// Os dados reais vêm do backend via api.js

export const WEATHER_MOCK = {
  "São Paulo":      { temp: 22, humidity: 75, desc: "Parcialmente nublado", wind: 12, icon: "cloud" },
  "Rio de Janeiro": { temp: 28, humidity: 80, desc: "Ensolarado",           wind: 18, icon: "sun" },
  "Buenos Aires":   { temp: 19, humidity: 65, desc: "Céu limpo",            wind: 10, icon: "sun" },
  "Berlim":         { temp: 8,  humidity: 70, desc: "Chuvoso",              wind: 22, icon: "cloud-rain" },
  "Paris":          { temp: 12, humidity: 68, desc: "Nublado",              wind: 15, icon: "cloud" },
  "Tóquio":         { temp: 16, humidity: 60, desc: "Ensolarado",           wind: 8,  icon: "sun" },
};

export const COUNTRIES_API = {
  "Brasil":    { flag: "🇧🇷", capital: "Brasília",    region: "Americas", area: "8.5M km²" },
  "Argentina": { flag: "🇦🇷", capital: "Buenos Aires", region: "Americas", area: "2.7M km²" },
  "Alemanha":  { flag: "🇩🇪", capital: "Berlim",       region: "Europe",   area: "357K km²" },
  "França":    { flag: "🇫🇷", capital: "Paris",        region: "Europe",   area: "551K km²" },
  "Japão":     { flag: "🇯🇵", capital: "Tóquio",       region: "Asia",     area: "377K km²" },
  "Nigéria":   { flag: "🇳🇬", capital: "Abuja",        region: "Africa",   area: "923K km²" },
};
