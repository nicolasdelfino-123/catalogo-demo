import React from "react";

/**
 * Botonera flotante lateral (Instagram / WhatsApp)
 * - Aparece en TODAS las rutas (lo montamos en Layout.jsx)
 * - Tailwind ya está en tu proyecto, así que no necesitas CSS extra.
 * - En mobile se pega al borde derecho abajo; en desktop queda centrada a 1/3 de la altura.
 */
export default function FloatingButtons() {
    // EDITA estas URLs a las reales de tu cliente
    const IG_URL = "https://www.instagram.com/zarpados.vap/";
    const mensaje = "Hola, vi tu tienda Zarpados Vapers y quiero hacer un pedido...";
    const WA_URL = `https://wa.me/5493533497041?text=${mensaje}`;




    return (
        <>
            {/* Barra lateral derecha */}
            <div
                className="
    hidden md:flex
    fixed
    right-0
    top-1/2
    -translate-y-1/2
    flex-col
    z-[9999]
  "
                aria-label="Accesos rápidos"
            >
                {/* Instagram */}
                <a
                    href={IG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-12 h-12 bg-black flex items-center justify-center hover:bg-neutral-900 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="1" />
                    </svg>
                </a>

                {/* WhatsApp */}
                <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-12 h-12 bg-black flex items-center justify-center hover:bg-neutral-900 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                    >
                        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2m5.1 13.7c-.2.5-1.3 1-1.8 1.1c-.5.1-1.1.1-1.8-.1c-.4-.1-1-.3-1.7-.6c-3-1.3-4.9-4.4-5.1-4.7c-.2-.3-1.2-1.6-1.2-3.1s.8-2.2 1.1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5c.2.5.7 1.8.8 1.9c.1.1.1.3 0 .5c-.1.2-.2.3-.4.5c-.2.2-.4.4-.5.5c-.2.2-.3.4-.1.7c.2.3 1 1.7 2.2 2.7c1.5 1.3 2.7 1.7 3 1.9c.3.2.5.2.7 0c.2-.2.8-.9 1-1.2c.2-.3.4-.2.7-.1c.3.1 1.7.8 2 .9c.3.1.5.2.6.3c.1.1.1.6-.1 1.1" />
                    </svg>
                </a>
            </div>
        </>
    );
}
