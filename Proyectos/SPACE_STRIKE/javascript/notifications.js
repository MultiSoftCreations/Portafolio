/* SPACE STRIKE — In-game news / update notices v1.3.0 */

const NOTICES_KEY = "spaceStrikeNoticesRead";

const NOTICES = [
    {
        id: "v335_skins",
        title: "v3.3.6 — SKINS HORROR",
        body: "12 texturas especiales montables. Canjéalas con código (skin_...). Se guardan para siempre y se equipan si la nave es compatible."
    },
    {
        id: "v334_ddm",
        title: "v3.3.6 — EVENTO DÍA DE MUERTOS",
        body: "Nueva nave exclusiva CEMPASÚCHIL ETERNO. Canjea un código de evento (10 disponibles). Habilidades: VELO · ALTAR DE PÉTALOS · OFRENDA ERRANTE."
    },
    {
        id: "v333",
        title: "v3.3.6 — Ranking solo nube",
        body: "El ranking local permanente se eliminó. Solo se usa buffer offline si no hay internet; al reconectar se sube y se borra."
    },
    {
        id: "v332",
        title: "v3.3.6 — VT-03 ARSENAL",
        body: "VT-03 fase 1 (armada): misiles, láser y doble cañón. Al TRANSFORMAR (fase 2): solo balas normales a alta velocidad. Quédate armado el máximo posible."
    },
    {
        id: "v330",
        title: "v3.3.6 — PUSH + PROGRAMACIÓN",
        body: "Notificaciones FCM (con la página cerrada si activaste permisos). Reinicios programados del dueño. Progreso orientado a la nube."
    },
    {
        id: "v329",
        title: "v3.2.9 — AVISOS EN VIVO",
        body: "Puedes activar notificaciones del navegador para noticias, eventos y códigos limitados. Los admins publican desde ENVIAR AVISO."
    },
    {
        id: "v328",
        title: "v3.2.8 — SUPER ADMIN",
        body: "Panel dueño: wipe total de progreso y gestión de admins. Solo ricardotorresgalvez005@gmail.com."
    },
    {
        id: "v327",
        title: "v3.2.7 — RESET RANKING ADMIN",
        body: "Los admins pueden reiniciar el ranking global desde Ranking o panel de códigos (borra scores y highScore en nube)."
    },
    {
        id: "v326",
        title: "v3.2.6 — TANQUE / SPECTRE",
        body: "Textura nueva en TANQUE. La textura anterior del Tanque pasa a SPECTRE."
    },
    {
        id: "v321",
        title: "v3.2.4 — MAPA + EQUIPAR",
        body: "Mapa de aventura desde abajo y centrado en tu progreso. Equipar nave prioriza este dispositivo; la nube solo sincroniza al cambiar o en otro celular. Texturas y textos actualizados."
    },
    {
        id: "v320",
        title: "v3.2.0 — NUBE + INFINITO CARTAS",
        body: "500 niveles. Tienda solo Aventura. Infinito: mejoras por tarjetas. Progreso en la nube (respaldo local offline). Anuncios fuera del juego; VIP sin anuncios."
    },
    {
        id: "v302",
        title: "v3.0.2 — ASALTO + TANQUE",
        body: "Nuevas texturas: ASALTO (Rogue) y TANQUE (Parasite). Compra en tienda y equípalas."
    },
    {
        id: "v301",
        title: "v3.0.1 — INTERCEPTOR JF-29",
        body: "La nave inicial INTERCEPTOR usa el diseño JF-29 (textura real). Equípala y entra a cualquier modo."
    },
    {
        id: "v300",
        title: "SPACE STRIKE v3.0.0 REMASTER",
        body: "HUD renovado, XP y rangos, banner de jefes, datos de enemigos centralizados. El combate gana XP; el menú muestra tu rango."
    },
    {
        id: "v2101",
        title: "v2.10.1 — COMBO ANIMADO",
        body: "Combo con animación al aparecer, al subir de nivel (x2→x3→x5) y al desaparecer. Sistema separado de game.js."
    },
    {
        id: "v2100",
        title: "v2.10.0 — RECOMPENSAS VISUALES",
        body: "Al destruir enemigos ves +puntos flotantes y avisos de COMBO. Transiciones de menú más suaves."
    },
    {
        id: "v299",
        title: "v2.9.9 — FIX RENDER",
        body: "Corregido crash de partículas (stack overflow) que dejaba la pantalla sin naves ni enemigos."
    },
    {
        id: "v298",
        title: "v2.9.8 — FEEDBACK COMBATE",
        body: "Números de daño flotantes al impactar enemigos y misiles. Más respuesta visual en combate."
    },
    {
        id: "v297",
        title: "v2.9.7 — CRÉDITOS",
        body: "Créditos actualizados: Ricardo Torres · Co-creadora Fantasmita (diseño de naves y texturas) · Leon016 (R.P.D. LEON)."
    },
    {
        id: "v296",
        title: "v2.9.6 — CRÉDITOS + ANIM",
        body: "Nueva pantalla de créditos del equipo. AnimationManager para menú y feedback de UI."
    },
    {
        id: "v295",
        title: "v2.9.5 — PALETA VISUAL",
        body: "Tokens de color unificados (theme.css). Menú, HUD y tienda comparten identidad visual del remaster 3.0."
    },
    {
        id: "v294",
        title: "v2.9.4 — PARTÍCULAS + AUDIO",
        body: "Sistemas de partículas y audio separados de game.js. Mismo comportamiento, arquitectura más limpia para el remaster 3.0."
    },
    {
        id: "v293",
        title: "v2.9.3 — SHOP MANAGER + NEBULA",
        body: "Tienda con flujo seguro (ShopManager). Nueva textura NEBULA. Progreso del remaster 3.0."
    },
    {
        id: "v292",
        title: "REMASTER 3.0 — FASE ARQUITECTURA",
        body: "v2.9.2: PlayerData + SaveManager + GameState. Base estable v2.9.1-STABLE. Sin cambios de gameplay; prepara el remaster."
    },
    {
        id: "v290",
        title: "VERSIÓN 2.9.0 — MISILES",
        body: "Destructor lanza misiles teledirigidos. Tienda: cantidad, ojiva y radio. En Infinito, oleadas 9/19/29… elige mejora de misil."
    },
    {
        id: "v279",
        title: "VT-03 VANGUARD PREMIUM",
        body: "Nueva nave premium VT-03. Fase 1 bombardero · botón TRANS suelta las alas y pasa a modo caza (más rápido y más cadencia)."
    },
    {
        id: "v275",
        title: "PARCHE 2.7.5",
        body: "Jefe Overlord cada 10 oleadas en Infinito y Aventura (para pruebas). Cuota de spawn alineada con el jefe."
    },
    {
        id: "v272",
        title: "PARCHE 2.7.2",
        body: "Destructor con textura T-Wind. Nebula: habilidades FASE, TORMENTA LÁSER y recarga de ESCUDO."
    },
    {
        id: "v271",
        title: "R.P.D. DRON POLICIAL",
        body: "La nave R.P.D. LEON trae dron de apoyo. El dron aplica INMU, PENTA 5 vías y el ORBE médico (1 uso)."
    },
    {
        id: "v270",
        title: "VERSIÓN 2.7.0 — R.P.D. LEON",
        body: "Nueva nave especial R.P.D. LEON (código). Habilidades: INMU 3s · PENTA 5 vías 4s · CURA orbe 1 uso (todas las vidas). Disparo azul."
    },
    {
        id: "v2618",
        title: "PARCHE 2.6.18",
        body: "Ranking global: sube automáticamente tu récord local. Botón SUBIR MI RÉCORD en Ranking si no apareces."
    },
    {
        id: "v2617",
        title: "PARCHE 2.6.17",
        body: "Fix infinito: enemigos volvían a salir tras oleada 10. Sugerencias por WhatsApp. Login Google obligatorio para guardar progreso."
    },
    {
        id: "v2616",
        title: "PARCHE 2.6.16",
        body: "Habilidades EMP/OVER/NOVA se compran en la Tienda y se activan tocando los botones. Tras perder una vida puedes moverte. Jefe Overlord (aventura x10 / infinito x50). Premium admin y badge dorado."
    },
    {
        id: "v2615",
        title: "PARCHE 2.6.15",
        body: "Al perder una vida puedes moverte (sin disparar) durante la invulnerabilidad para escapar."
    },
    {
        id: "v2614",
        title: "JEFE OVERLORD",
        body: "Nuevo jefe con sprite. Aventura cada 10 niveles · Infinito cada 50 oleadas."
    },
    {
        id: "v260",
        title: "NAVE NEBULA ★★",
        body: "Nave especial exclusiva (código). Doble cañón, escudo 3, disparo rojo, 10% láser."
    },
    {
        id: "v250",
        title: "PARCHE 2.5.0",
        body: "EMP más corto, bonus créditos 8%, gráficos AUTO/BAJO/MEDIO/ALTO, evolución visual de nave."
    },
    {
        id: "v230",
        title: "PREMIUM 2.3.0",
        body: "Naves exclusivas Phoenix/Void Runner, +50% créditos e insignia VIP. Menú → Premium."
    },
    {
        id: "v210",
        title: "ACTUALIZACIÓN 2.1.0",
        body: "Ranking GLOBAL con Firebase. Juega infinito y sube al top mundial."
    },
    {
        id: "v200",
        title: "REMASTER 2.0.0",
        body: "Habilidades EMP/OVER/NOVA, escudo regenerable, asteroides, eventos, logros y rango XP."
    },
    {
        id: "v140",
        title: "ACTUALIZACIÓN 1.4.0",
        body: "Combos, stats de misión, jefe en 2 fases. Cañón doble + ráfaga ya funcionan juntos."
    },
    {
        id: "v134",
        title: "ACTUALIZACIÓN 1.3.4",
        body: "Oleadas por enemigos (no puntos). Jefes cada 10 oleadas. Enemigos y jefes más resistentes."
    },
    {
        id: "v130",
        title: "ACTUALIZACIÓN 1.3.0",
        body: "Logo Multisoft, 40 sectores, 5 enemigos, jefe cada 50 oleadas, ranking local y más mejoras en la tienda."
    },
    {
        id: "v121",
        title: "CONTROLES Y FPS",
        body: "Personaliza joystick/FIRE en Configuración. Contador de FPS y optimización móvil."
    },
    {
        id: "future",
        title: "PRÓXIMAMENTE",
        body: "Ranking online global, más jefes de aventura y power-ups en mapa. ¡Sigue las novedades aquí!"
    }
];

function getReadIds() {
    try {
        const raw = localStorage.getItem(NOTICES_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
    } catch (e) {
        return [];
    }
}

function markRead(id) {
    const ids = getReadIds();
    if (ids.indexOf(id) === -1) {
        ids.push(id);
        try {
            localStorage.setItem(NOTICES_KEY, JSON.stringify(ids));
        } catch (e) {}
    }
}

function getUnread() {
    const read = getReadIds();
    return NOTICES.filter(function (n) {
        return read.indexOf(n.id) === -1;
    });
}

if (typeof window !== "undefined") {
    window.SpaceStrikeNotices = {
        all: NOTICES,
        unread: getUnread,
        markRead: markRead
    };
}
