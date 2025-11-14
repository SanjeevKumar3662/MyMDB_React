import "./MediaContentSlider.css";
// import { useState, useEffect } from "react";
import VideoCards from "../card/VideoCards";
import Slider from "react-slick";
import Card from "../card/Card";
import { useQuery } from "@tanstack/react-query";
import { Key } from "react";

const MediaContentSlider: React.FC<{
  media_type: string;
  id: string | undefined;
  content_type: string;
}> = ({ media_type, id, content_type }) => {
  const {
    data: contentData,
    isError,
    isPending,
  } = useQuery({
    queryKey: [media_type, id, content_type],
    queryFn: fetchContentData,
  });

  async function fetchContentData() {
    try {
      const response = await fetch(
        `https://first-backend-eight.vercel.app/media_content/${media_type}/${id}/${content_type}`
      );
      return await await response.json();
    } catch (error) {
      console.error(
        `error occured while fetching media Lists for ${media_type} ,id: ${id} ,content_type: ${content_type}`,
        "\n",
        error
      );
    }
  }

  if (isError) {
    return <div>Error in media details page</div>;
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

  const getSlidesToShow = (
    type: string,
    breakpoint: number | string = "default"
  ) => {
    switch (breakpoint) {
      case "desktop":
        switch (type) {
          case "videos":
            return 2;
          case "images":
            return 3;
          case "recommendations":
            return 8;
          default:
            return 3;
        }
      case 1200:
        switch (type) {
          case "videos":
            return 1;
          case "images":
            return 2;
          case "recommendations":
            return 4;
          default:
            return 3;
        }
      case 520:
        switch (type) {
          case "videos":
            return 1;
          case "images":
            return 1;
          case "recommendations":
            return 2;
          default:
            return 3;
        }
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: getSlidesToShow(content_type, "desktop"),
    slidesToScroll: content_type === "recommendations" ? 4 : 1,
    lazyLoad: "ondemand" as "ondemand",
    lazyLoadBuffer: 3,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: getSlidesToShow(content_type, 1200),
          slidesToScroll: content_type === "recommendations" ? 2 : 1,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: getSlidesToShow(content_type, 520),
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (
    (contentData.backdrops && contentData.backdrops.length === 0) ||
    (contentData.results && contentData.results.length === 0)
  ) {
    return;
  }

  contentData &&
    (() => {
      switch (content_type) {
        case "images":
          contentData.backdrops.length <= 1 && (settings.infinite = false);
          break;
        case "videos":
          contentData.results.length <= 1 && (settings.infinite = false);
          break;
      }
    })();

  return (
    <>
      <div className="slider-bg" style={{ padding: "10px" }}>
        <Slider {...settings}>
          {(() => {
            switch (content_type) {
              case "videos":
                return (
                  contentData &&
                  contentData.results.map(
                    (video: {
                      type: string;
                      name: string;
                      id: Key | null | undefined;
                      key: string;
                    }) => (
                      <VideoCards
                        type={video.type}
                        title={video.name}
                        key={video.id}
                        videoId={video.key}
                        mediaId={id}
                      />
                    )
                  )
                );
              case "images":
                return (
                  contentData &&
                  contentData.backdrops.map((imgs: { file_path: string }) => (
                    <div className="backdrop-border">
                      <img
                        className="backdrops"
                        loading="lazy"
                        src={`https://image.tmdb.org/t/p/w780${imgs.file_path}`}
                        alt=""
                      />
                    </div>
                  ))
                );
              case "recommendations":
                return (
                  contentData &&
                  contentData.results.map((media: any) => (
                    <Card
                      // {console.log(media)}
                      cssClass={"sliding-cards"}
                      {...media}
                      linkTo={media_type + "_details"}
                    />
                  ))
                );
            }
          })()}
        </Slider>
      </div>
    </>
  );
};

export default MediaContentSlider;
