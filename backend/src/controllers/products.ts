type ProductForm = {
    id: string,
    title: string,
    released_date: string,
    directors: string[],
    rate: string,
    description: string,
    genres: string[],
    price: string,
    seasons?: string
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
    thumbnail?: string
}


export const validateProduct = (product: ProductForm): ProductType => {
    if (!product.title || !product.released_date || !product.directors || !product.rate || !product.description || !product.genres || !product.price) {
        throw new Error("Missing product data");
    }

    const seasonsNumber = product.seasons ? Number(product.seasons) : NaN;

    return {
        id: Number(product.id),
        title: product.title,
        released_date: new Date(product.released_date),
        directors: product.directors,
        rate: Number(product.rate),
        description: product.description,
        genres: product.genres,
        price: Number(product.price),
        ...((!isNaN(seasonsNumber)) && { seasons: seasonsNumber })
    }
}

