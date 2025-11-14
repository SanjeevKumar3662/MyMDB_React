import "./MediaLists.css";
import Card from "../../components/card/Card";
import PageNav from "../../components/pageNav/PageNav";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  // add more fields as needed
}

const MediaLists: React.FC<{
  media_type: string;
  list_type: string;
  headerText: string;
}> = ({ media_type, list_type, headerText }) => {
  //  const [listData, setlistData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // get initial page from URL
  const pageFromURL = parseInt(searchParams.get("page") || "1");
  const [page, setPage] = useState(pageFromURL);

  // --- keep URL in sync (merge instead of overwrite) ---
  useEffect(() => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", String(page));
      newParams.set("list_type", list_type); // always from props
      return newParams;
    });
  }, [page, list_type, setSearchParams]);

  // --- reset page when media_type OR list_type changes ---
  const prevKeyRef = useRef("");

  useEffect(() => {
    const newKey = `${media_type}-${list_type}`;
    if (prevKeyRef.current && prevKeyRef.current !== newKey) {
      setPage(1); // reset page
    }
    prevKeyRef.current = newKey;
  }, [media_type, list_type]);

  const {
    data: listData,
    isPending,
    isError,
  } = useQuery<Movie[]>({
    queryKey: [media_type, list_type, page],
    queryFn: fetchList,
  });

  async function fetchList() {
    try {
      const response = await fetch(
        `https://first-backend-eight.vercel.app/media_lists/${media_type}/${list_type}/${page}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await data.results;
    } catch (error) {
      console.error(
        `error occured while fetching media Lists for ${media_type} ,list type: ${list_type} ,page: ${page}`,
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
    return <div>Error in media List page</div>;
  }

  // console.log(listData[0]);
  return (
    <div className="movie-container">
      <h1>{headerText}</h1>
      <PageNav
        prevClick={() => setPage(page > 1 ? () => page - 1 : page)}
        nextClick={() => setPage(() => page + 1)}
        page={page}
        setPage={setPage}
      ></PageNav>
      <div className="flex-container">
        {listData ? (
          listData.map((movie) => (
            <Card
              key={movie.id}
              cssClass={"card"}
              linkTo={media_type + "_details"}
              {...movie}
            ></Card>
          ))
        ) : (
          <h1>Loading...</h1>
        )}
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
export default MediaLists;
