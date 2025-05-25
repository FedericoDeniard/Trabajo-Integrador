interface Product {
    id: number
    title: string
    price: number
    thumbnail: string
    description: string
    rate: number
    available: boolean
    director: string[]
    releasedDate: Date
    genre: string[]
}

interface Movie extends Product {
    duration: number
}

interface Serie extends Product {
    seasons: Season[]
}

interface Episode {
    title: string
    releasedDate: Date
    description: string
    duration: number
}

interface Season {
    number: number
    episodes: Episode[]
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
            director: ["Christopher Nolan"],
            releasedDate: new Date("2010-07-16"),
            genre: ["Action", "Adventure", "Sci-Fi"],
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
            director: ["Frank Darabont"],
            releasedDate: new Date("1994-09-10"),
            genre: ["Drama", "Crime"],
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
            director: ["Francis Ford Coppola"],
            releasedDate: new Date("1972-03-24"),
            genre: ["Crime", "Drama", "Thriller"],
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
            director: ["Christopher Nolan"],
            releasedDate: new Date("2008-07-18"),
            genre: ["Action", "Crime", "Drama", "Thriller"],
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
            director: ["Quentin Tarantino"],
            releasedDate: new Date("1994-09-10"),
            genre: ["Crime", "Drama", "Thriller"],
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
            director: ["The Duffer Brothers"],
            releasedDate: new Date("2016-07-16"),
            genre: ["Drama", "Horror", "Science Fiction"],
            seasons: [{ number: 1, episodes: [{ title: "Episode 1", releasedDate: new Date("2016-07-16"), description: "Episode 1", duration: 60 }] }, { number: 2, episodes: [{ title: "Episode 2", releasedDate: new Date("2016-07-16"), description: "Episode 2", duration: 60 }] }]
        },
        {
            id: 7,
            title: "Breaking Bad",
            price: 29.99,
            thumbnail: "https://placehold.co/600x400",
            description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
            rate: 4.9,
            available: true,
            director: ["Vince Gilligan"],
            releasedDate: new Date("2008-01-25"),
            genre: ["Crime", "Drama", "Thriller"],
            seasons: [{ number: 1, episodes: [{ title: "Episode 1", releasedDate: new Date("2008-01-25"), description: "Episode 1", duration: 60 }] }, { number: 2, episodes: [{ title: "Episode 2", releasedDate: new Date("2008-01-25"), description: "Episode 2", duration: 60 }] }, { number: 3, episodes: [{ title: "Episode 3", releasedDate: new Date("2008-01-25"), description: "Episode 3", duration: 60 }] }, { number: 4, episodes: [{ title: "Episode 4", releasedDate: new Date("2008-01-25"), description: "Episode 4", duration: 60 }] }, { number: 5, episodes: [{ title: "Episode 5", releasedDate: new Date("2008-01-25"), description: "Episode 5", duration: 60 }] }]
        },
        {
            id: 8,
            title: "The Mandalorian",
            price: 19.99,
            thumbnail: "https://placehold.co/600x400",
            description: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
            rate: 4.7,
            available: true,
            director: ["Jon Favreau"],
            releasedDate: new Date("2019-11-12"),
            genre: ["Action", "Adventure", "Sci-Fi"],
            seasons: [{ number: 1, episodes: [{ title: "Episode 1", releasedDate: new Date("2019-11-12"), description: "Episode 1", duration: 60 }] }, { number: 2, episodes: [{ title: "Episode 2", releasedDate: new Date("2019-11-12"), description: "Episode 2", duration: 60 }] }, { number: 3, episodes: [{ title: "Episode 3", releasedDate: new Date("2019-11-12"), description: "Episode 3", duration: 60 }] }]
        },
        {
            id: 9,
            title: "Game of Thrones",
            price: 34.99,
            thumbnail: "https://placehold.co/600x400",
            description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
            rate: 4.4,
            available: true,
            director: ["David Benioff", "D.B. Weiss"],
            releasedDate: new Date("2011-04-17"),
            genre: ["Drama", "Fantasy", "Medieval"],
            seasons: [{ number: 1, episodes: [{ title: "Episode 1", releasedDate: new Date("2011-04-17"), description: "Episode 1", duration: 60 }] }, { number: 2, episodes: [{ title: "Episode 2", releasedDate: new Date("2011-04-17"), description: "Episode 2", duration: 60 }] }, { number: 3, episodes: [{ title: "Episode 3", releasedDate: new Date("2011-04-17"), description: "Episode 3", duration: 60 }] }, { number: 4, episodes: [{ title: "Episode 4", releasedDate: new Date("2011-04-17"), description: "Episode 4", duration: 60 }] }, { number: 5, episodes: [{ title: "Episode 5", releasedDate: new Date("2011-04-17"), description: "Episode 5", duration: 60 }] }, { number: 6, episodes: [{ title: "Episode 6", releasedDate: new Date("2011-04-17"), description: "Episode 6", duration: 60 }] }, { number: 7, episodes: [{ title: "Episode 7", releasedDate: new Date("2011-04-17"), description: "Episode 7", duration: 60 }] }, { number: 8, episodes: [{ title: "Episode 8", releasedDate: new Date("2011-04-17"), description: "Episode 8", duration: 60 }] }]
        },
        {
            id: 10,
            title: "The Witcher",
            price: 22.99,
            thumbnail: "https://placehold.co/600x400",
            description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
            rate: 4.5,
            available: true,
            director: ["Lauren Schmidt Hissrich"],
            releasedDate: new Date("2019-11-15"),
            genre: ["Fantasy", "Medieval"],
            seasons: [{ number: 1, episodes: [{ title: "Episode 1", releasedDate: new Date("2019-11-15"), description: "Episode 1", duration: 60 }] }, { number: 2, episodes: [{ title: "Episode 2", releasedDate: new Date("2019-11-15"), description: "Episode 2", duration: 60 }] }, { number: 3, episodes: [{ title: "Episode 3", releasedDate: new Date("2019-11-15"), description: "Episode 3", duration: 60 }] }]
        }
    ]
}