import { useState, useContext, useMemo, useEffect } from "react";
import { Context } from "../../../js/store/appContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "";

const normalizeImagePath = (u = "") => {
    if (!u) return "";
    if (u.startsWith("/admin/uploads/")) u = u.replace("/admin", "/public");
    if (u.startsWith("/uploads/")) u = `/public${u}`;
    return u;
};

const toAbsUrl = (u = "") => {
    u = normalizeImagePath(u);
    if (!u) return "";
    if (/^https?:\/\//i.test(u)) return u;
    if (u.startsWith("/public/")) return `${API}${u}`;
    if (u.startsWith("/")) return u;
    return `${API}/${u}`;
};

const parseMl = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "number" && Number.isFinite(value)) return Math.floor(value);
    const text = String(value).trim();
    if (!text) return null;
    const match = text.match(/\d+/);
    if (!match) return null;
    const n = Number(match[0]);
    return Number.isFinite(n) ? Math.floor(n) : null;
};

const parsePrice = (value) => {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const normalized = String(value).replace(/\./g, "").replace(",", ".").trim();
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
};

export default function ProductCardPerfumes({ product, returnTo, isGrid = true }) {

    const [quantity, setQuantity] = useState(1);
    const [selectedFlavor, setSelectedFlavor] = useState("");
    const [selectedSizeMl, setSelectedSizeMl] = useState("");

    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();

    const isWholesale = location.pathname.startsWith("/mayorista");
    const prefix = isWholesale ? "/mayorista" : "";

    const sizeOptions = useMemo(() => {
        const rows = [];

        const baseMl = parseMl(product?.volume_ml);
        const basePrice = parsePrice(product?.price);
        const baseWholesale = parsePrice(product?.price_wholesale);

        if (baseMl && baseMl > 0) {
            rows.push({
                ml: baseMl,
                price: basePrice && basePrice > 0 ? basePrice : null,
                price_wholesale: baseWholesale && baseWholesale > 0 ? baseWholesale : null,
            });
        }

        const rawVolumeOptions = (() => {
            if (Array.isArray(product?.volume_options)) return product.volume_options;
            if (Array.isArray(product?.volumeOptions)) return product.volumeOptions;
            if (typeof product?.volume_options === "string") {
                try {
                    const parsed = JSON.parse(product.volume_options);
                    return Array.isArray(parsed) ? parsed : [];
                } catch {
                    return [];
                }
            }
            if (typeof product?.volumeOptions === "string") {
                try {
                    const parsed = JSON.parse(product.volumeOptions);
                    return Array.isArray(parsed) ? parsed : [];
                } catch {
                    return [];
                }
            }
            if (product?.volume_options && typeof product.volume_options === "object") {
                return Object.values(product.volume_options);
            }
            if (product?.volumeOptions && typeof product.volumeOptions === "object") {
                return Object.values(product.volumeOptions);
            }
            return [];
        })();

        for (const opt of rawVolumeOptions) {
            const ml = parseMl(
                opt?.ml ??
                opt?.volume_ml ??
                opt?.size_ml ??
                opt?.volumeMl ??
                opt?.sizeMl ??
                opt?.label ??
                opt?.name
            );
            const price = parsePrice(
                opt?.price ??
                opt?.retail_price ??
                opt?.retailPrice
            );
            const priceWholesale = parsePrice(
                opt?.price_wholesale ??
                opt?.wholesale_price ??
                opt?.wholesalePrice
            );

            if (!ml || ml <= 0) continue;

            rows.push({
                ml,
                price: price && price > 0 ? price : (basePrice && basePrice > 0 ? basePrice : null),
                price_wholesale:
                    priceWholesale && priceWholesale > 0
                        ? priceWholesale
                        : (baseWholesale && baseWholesale > 0 ? baseWholesale : null),
            });
        }

        const byMl = new Map();
        for (const row of rows) byMl.set(row.ml, row);
        return Array.from(byMl.values()).sort((a, b) => a.ml - b.ml);
    }, [product]);

    useEffect(() => {
        if (sizeOptions.length > 0) {
            setSelectedSizeMl(String(sizeOptions[0].ml));
        } else {
            setSelectedSizeMl("");
        }
    }, [product?.id, sizeOptions.length]);

    const selectedSize =
        sizeOptions.find((opt) => String(opt.ml) === String(selectedSizeMl)) ||
        sizeOptions[0] ||
        null;

    const wholesalePrice = Number(selectedSize?.price_wholesale ?? product?.price_wholesale);
    const retailPrice = Number(selectedSize?.price ?? product?.price);

    const finalPrice = isWholesale
        ? (wholesalePrice > 0 ? wholesalePrice : null)
        : (retailPrice > 0 ? retailPrice : null);
    const pricePrefix = isWholesale ? "US$" : "$";

    const stock = Number(product?.stock ?? 0);
    const hasStock = stock > 0;
    const hasVolume = sizeOptions.length > 0;

    const handleAddToCart = () => {
        const hasFlavors =
            product.flavor_enabled &&
            Array.isArray(product.flavors) &&
            product.flavors.length > 0;

        if (hasFlavors && !selectedFlavor) {
            sessionStorage.setItem("lastProductId", String(product.id));

            const state = returnTo ? { fromGrid: true, returnTo } : undefined;
            navigate(`${prefix}/product/${product.id}`, { state });

            return;
        }

        const productForCart = selectedSize
            ? {
                ...product,
                volume_ml: selectedSize.ml,
                price: selectedSize.price ?? product.price,
                price_wholesale: selectedSize.price_wholesale ?? product.price_wholesale,
                selected_size_ml: selectedSize.ml,
            }
            : product;

        actions.addToCart(
            { ...productForCart, selectedFlavor: hasFlavors ? selectedFlavor : null },
            quantity
        );
    };


    /*  const handleProductClick = () => {
         sessionStorage.setItem("lastProductId", String(product.id));
         navigate(`${prefix}/product/${product.id}`);
     }; */

    const handleProductClick = () => {
        // ancla para restauración exacta
        // ancla + página exacta para restauración sólida
        sessionStorage.setItem("lastProductId", String(product.id));

        const pageFromReturnTo = (() => {
            if (!returnTo) return null;
            const qs = returnTo.split("?")[1] || "";
            const p = Number(new URLSearchParams(qs).get("page"));
            return Number.isFinite(p) && p > 0 ? p : null;
        })();

        if (pageFromReturnTo) {
            sessionStorage.setItem("lastProductPage", String(pageFromReturnTo));
        }

        // guardo returnTo y marco si viene del grid según el prop `isGrid`
        const state = returnTo ? { fromGrid: Boolean(isGrid), returnTo } : undefined;


        navigate(`${prefix}/product/${product.id}`, { state });
    };
    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col h-full">

            {/* Imagen */}
            <div
                onClick={handleProductClick}
                className="aspect-square bg-gray-100 overflow-hidden cursor-pointer"
            >
                <img
                    src={toAbsUrl(product?.image_url) || "/sin_imagen.jpg"}
                    alt={product?.name || "Producto"}
                    className="w-full h-full object-cover hover:scale-105 transition"
                />
            </div>

            {/* CONTENIDO */}
            <div className="p-4 flex flex-col flex-grow">

                {/* selector sabores */}
                {/*  {product.flavor_enabled && product.flavors?.length > 0 && (
                    <select
                        value={selectedFlavor}
                        onChange={(e) => setSelectedFlavor(e.target.value)}
                        className="mb-2 border rounded-md px-2 py-1 text-sm"
                    >
                        <option value="">Elegir opción</option>
                        {product.flavors.map((f) => (
                            <option key={f}>{f}</option>
                        ))}
                    </select>
                )} */}

                {/* nombre */}
                <h3
                    onClick={handleProductClick}
                    className="font-semibold text-gray-900 cursor-pointer hover:text-purple-600 line-clamp-2"
                >
                    {product.name}
                </h3>

                {/* categoría */}
                <p className="text-xs text-gray-400 mt-1">
                    {product.category_name}
                </p>
                {hasVolume && (
                    <p className="text-xs text-gray-500 mt-1">
                        Tamaño: {selectedSize?.ml}ml
                    </p>
                )}

                {/* precio */}
                <div className="mt-2">
                    {finalPrice !== null ? (
                        <span className="text-xl font-bold text-gray-900">
                            {pricePrefix}{finalPrice.toLocaleString("es-AR")}
                        </span>
                    ) : (
                        <span className="text-sm text-gray-400 italic">
                            Consultar
                        </span>
                    )}

                    {isWholesale && finalPrice !== null && (
                        <div className="text-xs text-gray-500">
                            Precio mayorista
                        </div>
                    )}
                </div>

                {/* acciones */}
                <div className="mt-4 pt-3 border-t border-gray-100 mt-auto">
                    {hasVolume && (
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 font-medium">Tamaño:</span>
                            <div className="flex flex-wrap justify-end gap-1 max-w-[65%]">
                                {sizeOptions.map((opt) => {
                                    const active = String(opt.ml) === String(selectedSizeMl);
                                    return (
                                        <button
                                            key={opt.ml}
                                            type="button"
                                            onClick={() => setSelectedSizeMl(String(opt.ml))}
                                            className={`px-2 py-1 rounded-full text-xs border ${active
                                                    ? "border-gray-900 text-gray-900 font-semibold"
                                                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                                                }`}
                                        >
                                            {opt.ml}ml
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Cantidad */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 font-medium">
                            Cantidad:
                        </span>

                        <select
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            disabled={!hasStock}
                            className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                        >
                            {[...Array(Math.min(stock || 1, 10))].map((_, i) => (
                                <option key={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>

                    {/* Botón SIEMPRE abajo */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!hasStock}
                        className={`w-full py-2 rounded-lg font-semibold text-sm transition
        ${hasStock
                                ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:opacity-90"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {hasStock ? "Agregar al carrito" : "Sin stock"}
                    </button>

                </div>
            </div>
        </div>
    );
}
