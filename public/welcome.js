// La entrada al laboratorio no depende del visor 3D: así sigue funcionando
// incluso si WebGL tarda en iniciar o una dependencia externa no está disponible.
(() => {
  const modal = document.querySelector('#welcomeModal');
  const enterButton = document.querySelector('#enterLab');
  if (!modal || !enterButton) return;

  enterButton.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    window.dispatchEvent(new Event('dinosaurlab:enter'));
  });
})();
