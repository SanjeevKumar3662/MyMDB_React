import "./MediaLists.css";
import Card from "../../components/card/Card";
import PageNav from "../../components/page-nav/PageNav";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const MediaLists: React.FC<{
  media_type: string;
  list_type: string;
  headerText: string;
}> = ({ media_type, list_type, headerText }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read page from URL
  const pageFromURL = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState(pageFromURL);

  // Sync URL whenever page or list_type changes
  useEffect(() => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", String(page));
      newParams.set("list_type", list_type);
      return newParams;
    });
  }, [page, list_type, setSearchParams]);

  // Reset page when media_type or list_type changes
  const prevKeyRef = useRef("");
  useEffect(() => {
    const newKey = `${media_type}-${list_type}`;
    if (prevKeyRef.current && prevKeyRef.current !== newKey) {
      setPage(1);
    }
    prevKeyRef.current = newKey;
  }, [media_type, list_type]);

  // ----------- FETCH FUNCTION ----------------
  async function fetchList() {
    const url = `${SERVER_URI}/api/v1/media/list/${media_type}/${list_type}/${page}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${media_type} ${list_type} page ${page} — status ${response.status}`
      );
    }

    const json = await response.json();

    return {
      results: json.data?.results ?? [],
      total_pages: json.data?.total_pages ?? 1,
    };
  }

  // ----------- REACT QUERY ----------------------
  const { data, isPending, isError } = useQuery({
    queryKey: [media_type, list_type, page],
    queryFn: fetchList,
  });

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

  if (isError || !data) {
    return <div>Error in media list page</div>;
  }

  const maxPage = data.total_pages;

  return (
    <div className="movie-container">
      <h1>{headerText}</h1>

      {/* ---- TOP PAGE NAV ---- */}
      <PageNav
        prevClick={() => page > 1 && setPage(page - 1)}
        nextClick={() => page < maxPage && setPage(page + 1)}
        page={page}
        maxPage={maxPage}
        setPage={setPage}
      />

      {/* ---- MOVIE CARDS ---- */}
      <div className="flex-container">
        {data.results.map((movie: Movie) => (
          <Card
            key={movie.id}
            cssClass="card"
            linkTo={media_type + "_details"}
            {...movie}
          />
        ))}
      </div>

      {/* ---- BOTTOM PAGE NAV ---- */}
      <PageNav
        prevClick={() => page > 1 && setPage(page - 1)}
        nextClick={() => page < maxPage && setPage(page + 1)}
        page={page}
        maxPage={maxPage}
        setPage={setPage}
      />
    </div>
  );
};

export default MediaLists;
