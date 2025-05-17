interface Product {
    id: number
    title: string
    price: number
    thumbnail: string
    description: string
    rate: number
    available: boolean
    director: string
    year: number
}

interface Movie extends Product {
    duration: number
}

interface Serie extends Product {
    seasons: number
}

export const getProducts = (): (Movie | Serie)[] => {
    return [
        {
            id: 1,
            title: "Inception",
            price: 14.99,
            thumbnail: "https://placehold.co/600x400",
            description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
            rate: 4.8,
            available: true,
            director: "Christopher Nolan",
            year: 2010,
            duration: 148
        },
        {
            id: 2,
            title: "The Shawshank Redemption",
            price: 12.99,
            thumbnail: "https://placehold.co/600x400",
            description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
            rate: 4.9,
            available: true,
            director: "Frank Darabont",
            year: 1994,
            duration: 142
        },
        {
            id: 3,
            title: "The Godfather",
            price: 13.99,
            thumbnail: "https://placehold.co/600x400",
            description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
            rate: 4.9,
            available: true,
            director: "Francis Ford Coppola",
            year: 1972,
            duration: 175
        },
        {
            id: 4,
            title: "The Dark Knight",
            price: 14.99,
            thumbnail: "https://placehold.co/600x400",
            description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            rate: 4.9,
            available: true,
            director: "Christopher Nolan",
            year: 2008,
            duration: 152
        },
        {
            id: 5,
            title: "Pulp Fiction",
            price: 12.99,
            thumbnail: "https://placehold.co/600x400",
            description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
            rate: 4.8,
            available: true,
            director: "Quentin Tarantino",
            year: 1994,
            duration: 154
        },
        {
            id: 6,
            title: "Stranger Things",
            price: 24.99,
            thumbnail: "https://placehold.co/600x400",
            description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
            rate: 4.7,
            available: true,
            director: "The Duffer Brothers",
            year: 2016,
            seasons: 4
        },
        {
            id: 7,
            title: "Breaking Bad",
            price: 29.99,
            thumbnail: "https://placehold.co/600x400",
            description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
            rate: 4.9,
            available: true,
            director: "Vince Gilligan",
            year: 2008,
            seasons: 5
        },
        {
            id: 8,
            title: "The Mandalorian",
            price: 19.99,
            thumbnail: "https://placehold.co/600x400",
            description: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
            rate: 4.7,
            available: true,
            director: "Jon Favreau",
            year: 2019,
            seasons: 3
        },
        {
            id: 9,
            title: "Game of Thrones",
            price: 34.99,
            thumbnail: "https://placehold.co/600x400",
            description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
            rate: 4.4,
            available: true,
            director: "David Benioff, D.B. Weiss",
            year: 2011,
            seasons: 8
        },
        {
            id: 10,
            title: "The Witcher",
            price: 22.99,
            thumbnail: "https://placehold.co/600x400",
            description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
            rate: 4.5,
            available: true,
            director: "Lauren Schmidt Hissrich",
            year: 2019,
            seasons: 3
        }
    ]
}