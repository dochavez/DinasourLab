# DinosaurLab

Experiencia web estática con Three.js y WebGL para explorar un Spinosaurus en 360°.

## Ejecutar localmente

Desde esta carpeta, inicia cualquier servidor estático, por ejemplo:

```powershell
node server.mjs
```

Después abre `http://localhost:4173`. El servidor es necesario para que el navegador pueda cargar los archivos `.glb`.

## Controles

- Arrastra el espécimen para rotarlo y usa la rueda para acercar o alejar.
- Cambia entre **Modelo con textura** y **Estructura ósea**.
- En el modelo texturizado, activa **Superponer estructura ósea** para ver ambos a la vez.
- El paisaje sonoro comienza al pulsar «Entrar al laboratorio» y puede silenciarse desde la barra lateral.
