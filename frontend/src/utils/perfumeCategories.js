export const PERFUME_CATEGORY_DEFINITIONS = [
    { id: 1, name: "Masculinos", slug: "perfumes-masculinos" },
    { id: 2, name: "Femeninos", slug: "femeninos" },
    { id: 3, name: "Unisex", slug: "unisex" },
    { id: 4, name: "Cremas", slug: "cremas" },
    { id: 5, name: "Body Splash Victoria Secret", slug: "body-splash-victoria-secret" },
    { id: 7, name: "Perfumes de Diseñador", slug: "perfumes-de-disenador" },
];

export const PERFUME_CATEGORY_NAMES = PERFUME_CATEGORY_DEFINITIONS.map((category) => category.name);

export const CATEGORY_ID_TO_NAME = PERFUME_CATEGORY_DEFINITIONS.reduce(
    (acc, category) => ({ ...acc, [category.id]: category.name }),
    {
        6: "Masculinos",
    }
);

export const CATEGORY_NAME_TO_ID = {
    Masculinos: 1,
    "Perfumes masculinos": 1,
    "Perfumes Masculinos": 1,
    Femeninos: 2,
    Unisex: 3,
    Cremas: 4,
    "Body Splash Victoria Secret": 5,
    "Body splash victoria secret": 5,
    "Perfumes de Diseñador": 7,
    "Perfumes de Disenador": 7,
};

export const LEGACY_CATEGORY_NAME_TO_CURRENT = {
    "Vapes Desechables": "Masculinos",
    "Pods Recargables": "Femeninos",
    "Líquidos": "Unisex",
    Resistencias: "Cremas",
    Celulares: "Body Splash Victoria Secret",
    Perfumes: "Masculinos",
    "Body splash victoria secret": "Body Splash Victoria Secret",
    "Body Splash Victoria Secret": "Body Splash Victoria Secret",
    "Perfumes de Disenador": "Perfumes de Diseñador",
};

export const SLUG_TO_NAME = PERFUME_CATEGORY_DEFINITIONS.reduce(
    (acc, category) => ({ ...acc, [category.slug]: category.name }),
    {
        "vapes-desechables": "Masculinos",
        "pods-recargables": "Femeninos",
        liquidos: "Unisex",
        resistencias: "Cremas",
        celulares: "Body Splash Victoria Secret",
        perfumes: "Masculinos",
    }
);

export const SLUG_TO_ID = PERFUME_CATEGORY_DEFINITIONS.reduce(
    (acc, category) => ({ ...acc, [category.slug]: category.id }),
    {
        "vapes-desechables": 1,
        "pods-recargables": 2,
        liquidos: 3,
        resistencias: 4,
        celulares: 5,
        perfumes: 1,
    }
);

export const NAME_TO_SLUG = {
    Masculinos: "perfumes-masculinos",
    "Perfumes masculinos": "perfumes-masculinos",
    "Perfumes Masculinos": "perfumes-masculinos",
    Femeninos: "femeninos",
    Unisex: "unisex",
    Cremas: "cremas",
    "Body splash victoria secret": "body-splash-victoria-secret",
    "Body Splash Victoria Secret": "body-splash-victoria-secret",
    "Perfumes de Diseñador": "perfumes-de-disenador",
    "Perfumes de Disenador": "perfumes-de-disenador",
    "Vapes Desechables": "perfumes-masculinos",
    "Pods Recargables": "femeninos",
    "Líquidos": "unisex",
    Resistencias: "cremas",
    Celulares: "body-splash-victoria-secret",
    Perfumes: "perfumes-masculinos",
};

export const mapCategoryIdFromName = (value = "") => {
    const normalized = String(value || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (normalized.includes("disen")) return 7;
    if (normalized.includes("mascul")) return 1;
    if (normalized.includes("femen")) return 2;
    if (normalized.includes("unisex")) return 3;
    if (normalized.includes("crema")) return 4;
    if (normalized.includes("body") || normalized.includes("victoria")) return 5;
    if (normalized.includes("perfume")) return 1;
    return 1;
};

export const getDisplayCategoryName = (product) => {
    const byId = CATEGORY_ID_TO_NAME[Number(product?.category_id)];
    if (byId) return byId;

    const raw = String(product?.category_name || "").trim();
    if (!raw) return "Sin categoría";

    return LEGACY_CATEGORY_NAME_TO_CURRENT[raw] || raw;
};
