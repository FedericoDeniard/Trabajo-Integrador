import { Prisma } from "../../generated/prisma";
import prismaInstance from "../services/db";

const products = [
  {
    id: 1,
    title: "Inception",
    price: new Prisma.Decimal("14.99"),
    thumbnail: "https://beam-images.warnermediacdn.com/BEAM_LWM_DELIVERABLES/14552c93-d318-4563-a00b-343df7e35d0b/4beb5159-7570-4f7e-bd37-6f7ea0ccff52?host=wbd-images.prod-vod.h264.io&partner=beamcom",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    rate: new Prisma.Decimal("4.8"),
    available: false,
    directors: [
      {
        media_id: 1,
        director_id: 1,
        director: { name: "Christopher Nolan", id: 1 },
      },
    ],
    genres: [
      { media_id: 1, genre_id: 1, genre: { name: "Action", id: 1 } },
      { media_id: 1, genre_id: 2, genre: { name: "Adventure", id: 2 } },
      { media_id: 1, genre_id: 3, genre: { name: "Sci-Fi", id: 3 } },
    ],
    movie: {
      duration: 148,
      media_id: 1,
      released_date: new Date("2010-07-16"),
    },
    serie: null,
  },
  {
    id: 2,
    title: "The Shawshank Redemption",
    price: new Prisma.Decimal("12.99"),
    thumbnail: "https://resizing.flixster.com/SzNzBSg0ezjiN6IEHyeZ-fF1aqU=/fit-in/705x460/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p15987_v_h9_at.jpg",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    rate: new Prisma.Decimal("4.9"),
    available: true,
    directors: [
      {
        media_id: 2,
        director_id: 3,
        director: { name: "Frank Darabont", id: 3 },
      },
    ],
    genres: [
      { media_id: 2, genre_id: 4, genre: { name: "Drama", id: 4 } },
      { media_id: 2, genre_id: 5, genre: { name: "Crime", id: 5 } },
    ],
    movie: {
      duration: 142,
      media_id: 2,
      released_date: new Date("1994-09-10"),
    },
    serie: null,
  },
  {
    id: 3,
    title: "The Godfather",
    price: new Prisma.Decimal("13.99"),
    thumbnail: "https://communist.red/wp-content/uploads/2022/08/godfather.png",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    rate: new Prisma.Decimal("4.9"),
    available: true,
    directors: [
      {
        media_id: 3,
        director_id: 4,
        director: { name: "Francis Ford Coppola", id: 4 },
      },
    ],
    genres: [
      { media_id: 3, genre_id: 5, genre: { name: "Crime", id: 5 } },
      { media_id: 3, genre_id: 4, genre: { name: "Drama", id: 4 } },
      { media_id: 3, genre_id: 6, genre: { name: "Thriller", id: 6 } },
    ],
    movie: {
      duration: 175,
      media_id: 3,
      released_date: new Date("1972-03-24"),
    },
    serie: null,
  },
  {
    id: 4,
    title: "The Dark Knight",
    price: new Prisma.Decimal("14.99"),
    thumbnail: "https://musicart.xboxlive.com/7/abb02f00-0000-0000-0000-000000000002/504/image.jpg",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    rate: new Prisma.Decimal("4.9"),
    available: true,
    directors: [
      {
        media_id: 4,
        director_id: 1,
        director: { name: "Christopher Nolan", id: 1 },
      },
    ],
    genres: [
      { media_id: 4, genre_id: 1, genre: { name: "Action", id: 1 } },
      { media_id: 4, genre_id: 5, genre: { name: "Crime", id: 5 } },
      { media_id: 4, genre_id: 4, genre: { name: "Drama", id: 4 } },
      { media_id: 4, genre_id: 6, genre: { name: "Thriller", id: 6 } },
    ],
    movie: {
      duration: 152,
      media_id: 4,
      released_date: new Date("2008-07-18"),
    },
    serie: null,
  },
  {
    id: 5,
    title: "Pulp Fiction",
    price: new Prisma.Decimal("12.99"),
    thumbnail: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.netflix.com%2Fes%2Ftitle%2F880640&psig=AOvVaw2bTb_eAuIdxvVenKEMzSEc&ust=1749860924249000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCLCi7IqS7Y0DFQAAAAAdAAAAABAE",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    rate: new Prisma.Decimal("4.8"),
    available: true,
    directors: [
      {
        media_id: 5,
        director_id: 5,
        director: { name: "Quentin Tarantino", id: 5 },
      },
    ],
    genres: [
      { media_id: 5, genre_id: 1, genre: { name: "Crime", id: 1 } },
      { media_id: 5, genre_id: 4, genre: { name: "Drama", id: 4 } },
      { media_id: 5, genre_id: 6, genre: { name: "Thriller", id: 6 } },
    ],
    movie: {
      duration: 154,
      media_id: 5,
      released_date: new Date("1994-09-10"),
    },
    serie: null,
  },
  {
    id: 6,
    title: "Stranger Things",
    price: new Prisma.Decimal("24.99"),
    thumbnail: "https://i0.wp.com/www.lacosacine.com/wp-content/uploads/2024/06/Stranger-Things-2.jpg?resize=800%2C600&ssl=1",
    description:
      "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    rate: new Prisma.Decimal("4.7"),
    available: true,
    directors: [
      {
        media_id: 6,
        director_id: 12,
        director: { name: "The Duffer Brothers", id: 12 },
      },
    ],
    seasons: 3,
    released_date: new Date("2016-07-15"),
    genres: [
      { media_id: 6, genre_id: 4, genre: { name: "Drama", id: 4 } },
      { media_id: 6, genre_id: 6, genre: { name: "Sci-Fi", id: 6 } },
      { media_id: 6, genre_id: 7, genre: { name: "Horror", id: 7 } },
    ],
    movie: null,
  },
  {
    id: 7,
    title: "Breaking Bad",
    price: new Prisma.Decimal("29.99"),
    thumbnail: "https://m.media-amazon.com/images/M/MV5BMTJiMzgwZTktYzZhZC00YzhhLWEzZDUtMGM2NTE4MzQ4NGFmXkEyXkFqcGdeQWpybA@@._V1_.jpg",
    description:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    rate: new Prisma.Decimal("4.9"),
    available: true,
    directors: [
      {
        media_id: 7,
        director_id: 13,
        director: { name: "Vince Gilligan", id: 13 },
      },
    ],
    movie: null,
    genres: [
      { media_id: 7, genre_id: 1, genre: { name: "Crime", id: 1 } },
      { media_id: 7, genre_id: 4, genre: { name: "Drama", id: 4 } },
      { media_id: 7, genre_id: 6, genre: { name: "Thriller", id: 6 } },
    ],
    seasons: 5,
    released_date: new Date("2008-01-20"),
  },
  {
    id: 8,
    title: "The Mandalorian",
    price: new Prisma.Decimal("19.99"),
    thumbnail: "https://disney.images.edge.bamgrid.com/ripcut-delivery/v1/variant/disney/62dad0e3-da6a-4261-89c0-258065b86e04?/scale?width=1200&aspectRatio=1.78&format=webp",
    description:
      "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
    rate: new Prisma.Decimal("4.7"),
    available: true,
    directors: [
      {
        media_id: 8,
        director_id: 14,
        director: { name: "Jon Favreau", id: 14 },
      },
    ],
    movie: null,
    seasons: 2,
    released_date: new Date("2019-01-20"),
    genres: [
      { media_id: 8, genre_id: 1, genre: { name: "Action", id: 1 } },
      { media_id: 8, genre_id: 4, genre: { name: "Drama", id: 4 } },
      { media_id: 8, genre_id: 6, genre: { name: "Sci-Fi", id: 6 } },
    ],
  },
  {
    id: 9,
    title: "Game of Thrones",
    price: new Prisma.Decimal("34.99"),
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHuE5xeOuv5MYUGzHbM0E7EgkO9FFtMflRhg&s",
    description:
      "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    rate: new Prisma.Decimal("4.4"),
    available: true,
    directors: [
      {
        media_id: 9,
        director_id: 9,
        director: { name: "David Benioff", id: 9 },
      },
      {
        media_id: 9,
        director_id: 10,
        director: { name: "D.B. Weiss", id: 10 },
      },
    ],
    genres: [
      { media_id: 9, genre_id: 4, genre: { name: "Drama", id: 4 } },
      { media_id: 9, genre_id: 8, genre: { name: "Fantasy", id: 8 } },
      { media_id: 9, genre_id: 9, genre: { name: "Medieval", id: 9 } },
    ],
    movie: null,
    seasons: 8,
    released_date: new Date("2011-01-20"),
  },
  {
    id: 10,
    title: "The Witcher",
    price: new Prisma.Decimal("22.99"),
    thumbnail: "https://i.ytimg.com/vi/ETY44yszyNc/maxresdefault.jpg",
    description:
      "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
    rate: new Prisma.Decimal("4.5"),
    available: true,
    directors: [
      {
        media_id: 10,
        director_id: 11,
        director: { name: "Lauren Schmidt Hissrich", id: 11 },
      },
    ],
    genres: [
      { media_id: 10, genre_id: 1, genre: { name: "Action", id: 1 } },
      { media_id: 10, genre_id: 2, genre: { name: "Adventure", id: 2 } },
      { media_id: 10, genre_id: 4, genre: { name: "Drama", id: 4 } },
      { media_id: 10, genre_id: 8, genre: { name: "Fantasy", id: 8 } },
    ],
    movie: null,
    seasons: 1,
    released_date: new Date("2019-01-20"),
  },

];

export const createProducts = async () => {
  await prismaInstance.connect();
  const prisma = prismaInstance.client;

  try {
    for (const product of products) {
      const existingMedia = await prisma.media.findUnique({
        where: { title: product.title },
      });

      if (existingMedia) continue;

      const directorNames = Array.from(
        new Set(product.directors.map((d: { director: { name: string } }) => d.director.name))
      );

      await prisma.director.createMany({
        data: directorNames.map((name) => ({ name })),
        skipDuplicates: true,
      });

      const directors = await prisma.director.findMany({
        where: { name: { in: directorNames } },
      });

      const genreNames = Array.from(
        new Set(product.genres.map((g: { genre: { name: string } }) => g.genre.name))
      );

      await prisma.genre.createMany({
        data: genreNames.map((name) => ({ name })),
        skipDuplicates: true,
      });

      const genres = await prisma.genre.findMany({
        where: { name: { in: genreNames } },
      });

      const media = await prisma.media.create({
        data: {
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          description: product.description,
          rate: product.rate,
          available: product.available,
          genres: {
            create: genres.map(genre => ({
              genre: { connect: { id: genre.id } },
            })),
          },
          directors: {
            create: directors.map(director => ({
              director: { connect: { id: director.id } },
            })),
          },
        },
      });

      if (product.movie) {
        await prisma.movie.create({
          data: {
            duration: product.movie.duration,
            released_date: new Date(product.movie.released_date),
            media: { connect: { id: media.id } },
          },
        });
      } else if (product.seasons) {
        await prisma.serie.create({
          data: {
            media: { connect: { id: media.id } },
            seasons: product.seasons,
            released_date: new Date(product.released_date),
          },
        });
      }
    }

    console.log('✅ Products created successfully');
  } catch (error) {
    console.error('❌ Error creating products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from DB")
  }
};


await createProducts();
process.exit(0)