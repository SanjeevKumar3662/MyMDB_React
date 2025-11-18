// this is only used in homepage for popular movies and tvs
import "./SlidingCards.css";
import Card from "../card/Card";
// import { useEffect, useState } from "react";

//for slider
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useQuery } from "@tanstack/react-query";
import { JSX } from "react/jsx-runtime";
//slider end

// Type for each card item
interface CardData {
  id: number;
  [key: string]: any; // other API fields
}

// Props for SlidingCards
interface SlidingCardsProps {
  media_type: string; // "movie", "tv", "credits", etc.
  list_type: string; // "popular", "top_rated", etc.
  page?: string; // page context for Card
  movies?: CardData[]; // optional, defaults to []
  otherData?: CardData[]; // optional, defaults to []
  credits?: CardData[]; // optional
  videos?: CardData[]; // optional
}

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const SlidingCards = ({
  media_type,
  list_type,
  credits = [],
  videos = [],
  otherData = [],
}: SlidingCardsProps) => {
  const page = 1;

  // otherData && console.log(otherData[0]);

  const {
    data: movies,
    isError,
    isPending,
  } = useQuery({
    queryKey: [media_type, list_type, page],
    queryFn: fetchData,
  });

  async function fetchData() {
    const response = await fetch(
      `${SERVER_URI}/api/v1/media/list/${media_type}/${list_type}/${page}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${media_type} ${list_type}`);
    }

    const data = await response.json();

    return data.data?.results ?? [];
  }

  if (isError) {
    return <div>Error in SlidingCards for {media_type}</div>;
  }

  if (isPending) {
    return (
      <div
        style={{
          height: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span className="loader"></span>
      </div>
    );
  }

  // console.log("credits length", movies);
  const settings = {
    dots: false,
    infinite: movies && movies?.length <= 8 ? false : true,
    speed: 500,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 8,
    slidesToScroll: 1,
    centerMode: true,
    lazyLoad: "ondemand" as "ondemand",
    pauseOnHover: true,
    lazyLoadBuffer: 3,
    responsive: [
      {
        breakpoint: 1550, // tablets
        settings: {
          slidesToShow: 6,
          // slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024, // tablets
        settings: {
          slidesToShow: 4,
          // slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768, // small tablets / large phones
        settings: {
          slidesToShow: 3,
          // slidesToScroll: 3,
        },
      },
      {
        breakpoint: 620, // tablets
        settings: {
          slidesToShow: 2,
          // slidesToScroll: 2,
        },
      },
      {
        breakpoint: 370, // mobile phones
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // credits && console.log("this", credits.length);
  // otherData && console.log("this", otherData[0]);
  return (
    <>
      <Slider {...settings}>
        {movies.length > 0 &&
          media_type !== "credits" &&
          movies.map((movie: CardData) => (
            <div key={movie.id}>
              <Card
                cssClass="sliding-cards"
                {...movie}
                linkTo={media_type + "_details"}
              />
            </div>
          ))}

        {otherData.length > 0 &&
          otherData.map((ele: CardData) => (
            <div key={ele.id}>
              <Card
                cssClass="sliding-cards"
                {...ele}
                linkTo={media_type + "_details"}
              />
            </div>
          ))}
      </Slider>
    </>
  );
};
export default SlidingCards;
