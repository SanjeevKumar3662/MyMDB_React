export const menuData = [
  {
    label: "Movies",
    children: [
      { label: "Now Playing", to: "/movie/now_playing" },
      { label: "Popular", to: "/movie/popular" },
      { label: "Top Rated", to: "/movie/top_rated" },
      { label: "Upcoming", to: "/movie/upcoming" },
    ],
  },
  {
    label: "TV Shows",
    children: [
      { label: "Popular", to: "/tv/popular" },
      { label: "Airing Today", to: "/tv/airing_today" },
      { label: "Top Rated", to: "/tv/top_rated" },
      { label: "On The Air", to: "/tv/on_the_air" },
    ],
  },
];
