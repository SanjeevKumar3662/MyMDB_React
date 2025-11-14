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
    try {
      const response = await fetch(
        `https://first-backend-eight.vercel.app/media_lists/${media_type}/${list_type}/${page}`
      );
      const data = await response.json();
      // console.log(data);
      return await data.results;
    } catch (error) {
      console.error(
        `error occured while fetching SlidingCards component for ${media_type} ,list type: ${list_type} ,page: ${page}`,
        "\n",
        error
      );
    }
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

  const settings = {
    dots: false,
    infinite: credits && credits.length <= 8 ? false : true,
    speed: 200,
    slidesToShow: 8,
    slidesToScroll: 5,
    lazyLoad: "ondemand" as "ondemand",
    lazyLoadBuffer: 3,
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
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768, // small tablets / large phones
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 620, // tablets
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 520, // mobile phones
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
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
