type ProductForm = {
    id: string,
    title: string,
    released_date: string,
    directors: string[] | string,
    rate: string,
    description: string,
    genres: string[] | string,
    price: string,
    seasons?: string,
    duration?: string,
    available?: string,

}

export type ProductType = {
    id: number,
    title: string,
    released_date: Date,
    directors: string[],
    rate: number,
    description: string,
    genres: string[],
    price: number,
    seasons?: number,
    duration?: number,
    thumbnail?: string,
    available?: boolean
}


export const validateProduct = (product: ProductForm): ProductType => {
    if (!product.title || !product.released_date || !product.directors || !product.rate || !product.description || !product.genres || !product.price) {
        throw new Error("Missing product data");
    }

    const seasonsNumber = product.seasons ? Number(product.seasons) : NaN;
    const durationNumber = product.duration ? Number(product.duration) : NaN;
    if (isNaN(seasonsNumber) && isNaN(durationNumber)) {
        throw new Error("Invalid product data");
    }

    let directorsArray: string[];
    if (typeof product.directors === "string") {
        directorsArray = product.directors
            .split(",")
            .map(d => d.trim())
            .filter(d => d.length > 0);
    } else if (Array.isArray(product.directors)) {
        directorsArray = product.directors;
    } else {
        directorsArray = [];
    }

    let genresArray: string[];
    if (typeof product.genres === "string") {
        genresArray = product.genres
            .split(",")
            .map(g => g.trim())
            .filter(g => g.length > 0);
    } else if (Array.isArray(product.genres)) {
        genresArray = product.genres;
    } else {
        genresArray = [];
    }

    const available = product.available === "true";


    return {
        id: Number(product.id),
        title: product.title,
        released_date: new Date(product.released_date),
        directors: directorsArray,
        rate: Number(product.rate),
        description: product.description,
        genres: genresArray,
        price: Number(product.price),
        ...((!isNaN(seasonsNumber)) && { seasons: seasonsNumber }),
        ...((!isNaN(durationNumber)) && { duration: durationNumber }),
        ...((product.available) && { available: available }),
    }
}

