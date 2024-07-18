const ngrok = require('ngrok');

(async function () {
  const url = await ngrok.connect({
    addr: 3000, // Reemplaza con el puerto en el que tu servidor local está corriendo
    subdomain: 'pambii', // Opcional: Reemplaza con el subdominio deseado, si tienes una cuenta ngrok pro
  });
  console.log(`ngrok tunnel opened at: ${url}`);
})();
