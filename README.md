# ByKatriel · sitio web listo para subir

Esta carpeta es la web completa. No necesita instalar nada ni base de datos: son archivos estáticos (HTML, CSS, JavaScript, imágenes y vídeo) que funcionan en cualquier hosting.

```
sitio/
├── index.html            La página
├── css/estilos.css       Estilos
├── js/main.js            Reservas, textos legales, banda de fotos, vídeo y animaciones
├── img/                  Logo, fotos de la colección, alumnas e imagen para compartir
├── video/                Vídeo del método (H.264, 4,2 MB; solo se carga al llegar a esa sección)
├── favicon.png, icon-192.png, icon-512.png, apple-touch-icon.png, site.webmanifest
├── robots.txt, sitemap.xml
└── .htaccess             Caché y compresión (solo servidores Apache; en los demás se ignora)
```

`LEEME.md` es solo esta guía: no hace falta subirlo.

## 1. Antes de subir: pon tu dominio

Busca `TU-DOMINIO.com` y cámbialo por el dominio real (por ejemplo `bykatriel.com`) en:

- `index.html`: aparece en el `<head>` (canonical, imagen para compartir y datos para Google).
- `robots.txt`
- `sitemap.xml`

Cualquier editor de texto sirve: Buscar y reemplazar en los tres archivos.

## 2. Subir la web

**Hosting con panel (Hostinger, SiteGround, cPanel, Raiola…)**

1. Abre el Administrador de archivos del panel o conéctate por FTP.
2. Entra en la carpeta pública del dominio, normalmente `public_html`.
3. Sube **el contenido** de `sitio/`, no la carpeta: `index.html` tiene que quedar directamente dentro de `public_html`.
4. Comprueba que también se ha subido `.htaccess`: es un archivo oculto y algunos programas no lo muestran (en FileZilla: Servidor › Forzar mostrar archivos ocultos).
5. Activa el certificado SSL (HTTPS) desde el panel y la opción de forzar HTTPS si existe.

**Netlify (gratis, sin panel)**

1. Entra en https://app.netlify.com/drop
2. Arrastra la carpeta `sitio` completa.
3. En Domain settings, conecta tu dominio.

## 3. Textos que siguen pendientes

En la web se ven entre corchetes o como cajas oscuras con una descripción:

- **Sobre mí:** «[Tu historia en dos o tres frases…]».
- **Foto de Katriel:** caja oscura «Retrato de Katriel · fondo oscuro, luz lateral».
- **Foto del estudio:** caja oscura «El estudio · luz cálida, plano general».
- **Opinión de alumnas:** «[Opinión de una alumna sobre el curso.]» (Estephanie y Cristina).
- **Política de privacidad, apartado 5:** «[Empresa que aloja la web]»: pon el nombre de tu hosting (Hostinger, Netlify…).

Revisa también:

- **Horario:** «Lunes a Jueves 10:00–18:00» y «Martes, Miércoles y Viernes 12:00–19:00» se solapan en martes y miércoles.
- **Aviso legal:** el nombre comercial figura como «TrueNails»; si ya no es el nombre registrado, cámbialo por ByKatriel.

## 4. Cambios habituales

- **Número de WhatsApp:** busca `34611528824`. Está en `js/main.js` (`PHONE`) y en los enlaces de `index.html`. Va con prefijo de país, sin espacios ni «+».
- **Servicios del panel de reservas:** nombres de la agenda de TrueStudio en `js/main.js` (`SERVICES`) y opciones del desplegable en `index.html` (`<select id="bk-svc">`).
- **Agenda de TrueStudio:** el enlace «Continuar a la agenda» está en `index.html`.
- **Textos legales:** dentro de `index.html`, en el bloque `bk-legal-layer`. Se pueden enlazar directamente con `tudominio.com/#aviso-legal` y `tudominio.com/#privacidad`.

## 5. Privacidad: tipografías

Las tipografías (Allura, Marcellus, Cormorant Garamond y Jost) se cargan desde Google Fonts, que recibe la dirección IP del visitante. La política de privacidad ya lo declara. Si prefieres evitarlo, se pueden alojar las fuentes en tu propio servidor y quitar ese párrafo de la política.

## 6. Después de publicar

- Da de alta el dominio en Google Search Console y envía `https://tu-dominio/sitemap.xml`.
- Crea o actualiza la ficha de Google Business Profile con la misma dirección y teléfono.
- Prueba cómo se ve el enlace al compartirlo por WhatsApp: debe salir el logo sobre fondo negro.
