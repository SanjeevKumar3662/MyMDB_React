import "./SearchPage.css";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Card from "../../components/card/Card";
import PageNav from "../../components/page-nav/PageNav";
import SearchInput from "../../components/search-input/SearchInput";
import { useQuery } from "@tanstack/react-query";

//imports for react-slider
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface SearchResultBase {
  id: number;
  media_type?: "movie" | "tv" | "person"; // only present in multi-search
  popularity: number;
}

interface MovieResult extends SearchResultBase {
  title: string;
  original_title: string;
  release_date?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview: string;
}

interface TvResult extends SearchResultBase {
  name: string;
  original_name: string;
  first_air_date?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview: string;
}

interface PersonResult extends SearchResultBase {
  name: string;
  profile_path?: string | null;
  known_for?: (MovieResult | TvResult)[];
}

type SearchResult = MovieResult | TvResult | PersonResult;

const SearchPage = () => {
  // const [searchRes, setSearchRes] = useState(null);
  //for getting page from url
  const [searchParams, setSearchParams] = useSearchParams(); //used to read query params from url
  const queryTypeFromURL = searchParams.get("query_type") || "movie";

  const [query_type, setQuery_type] = useState(queryTypeFromURL);

  //this returns a string so parse it
  const pageFromURL = parseInt(searchParams.get("page") || "1");
  const [page, setPage] = useState(pageFromURL);

  useEffect(() => {
    setSearchParams({ query_type, page: String(page) }); //updates the page sting in url
  }, [query_type, page, setSearchParams]);
  //end

  //this will reset the page to 1, when we choose a dif list
  useEffect(() => {
    setPage(1);
  }, [query_type]);

  const { query } = useParams();

  const {
    data: searchRes,
    isPending,
    isError,
  } = useQuery({
    queryKey: [query_type, query, page],
    queryFn: fetchMedia,
  });

  async function fetchMedia() {
    try {
      const response = await fetch(
        `https://first-backend-eight.vercel.app/search/${query_type}/${query}/${page}`
      );
      const data = await response.json();
      return await data;
    } catch (error) {
      console.error(
        `error occured while fetching Search Page for query_type: ${query_type} ,query: ${query} ,page: ${page}`,
        "\n",
        error
      );
    }
  }

  if (isPending) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span className="loader"></span>
      </div>
    );
  }

  if (isError) {
    return <div>Error in media details page</div>;
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 200,
    slidesToShow: 8,
    slidesToScroll: 5,
    responsive: [
      {
        breakpoint: 1350, // tablets
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024, // tablets
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        },
      },
      {
        breakpoint: 768, // small tablets / large phones
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        },
      },
      {
        breakpoint: 550, // tablets
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 480, // mobile phones
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const queryArr = [
    {
      query: "multi",
      text: "All",
      info: "Shows Combination of Movie, TV and People",
    },
    { query: "movie", text: "Movie", info: "Shows movie results" },
    { query: "tv", text: "TV", info: "Shows tv results" },
    { query: "person", text: "Person", info: "Shows persons" },
    { query: "collection", text: "Collection", info: "Shows Collections" },
    { query: "company", text: "Company", info: "Shows Companies" },
    { query: "keyword", text: "Keywords", info: "Lists related keywords" },
  ];

  return (
    <div className="search-container">
      {/* <h1>Base Search Fuction ...</h1> */}
      <SearchInput />
      <div className="query-slider">
        <Slider {...settings}>
          {queryArr &&
            queryArr.map((obj) => (
              <button
                className="btn"
                onClick={() => setQuery_type(obj.query)}
                title={obj.info}
              >
                {obj.text}
              </button>
            ))}
        </Slider>
      </div>
      <div className="search-meta-info">
        <span className="btn">
          Total pages {searchRes && searchRes.total_pages}
        </span>
        <span className="btn">
          Total Results : {searchRes && searchRes.total_results}
        </span>
      </div>

      <div className="flex-search-container">
        {searchRes &&
          searchRes.results.map((ele: SearchResult) => {
            return (
              <Card
                key={ele.id}
                linkTo={
                  (query_type === "multi" ? ele.media_type : query_type) +
                  "_details"
                }
                cssClass={"card"}
                {...ele}
              />
            );
          })}
      </div>
      <PageNav
        prevClick={() => setPage(page > 1 ? () => page - 1 : page)}
        nextClick={() => setPage(() => page + 1)}
        page={page}
        setPage={setPage}
      ></PageNav>
    </div>
  );
};

export default SearchPage;
