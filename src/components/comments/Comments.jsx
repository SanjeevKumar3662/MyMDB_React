import { useEffect, useState } from "react";
import { authFetch } from "../../utils/authFetch";

const SERVER = import.meta.env.VITE_SERVER_URI;

export const Comments = ({ tmdbId, media_type }) => {
  const [userComment, setUserComment] = useState("");
  const [comments, setComments] = useState([]);

  // console.log(typeof tmdbId);
  useEffect(() => {
    const getMediaComment = async () => {
      try {
        const res = await fetch(
          `${SERVER}/api/v1/comment?type=${media_type}&tmdbId=${tmdbId}`,
          {
            method: "GET",
          }
        );
        const json = await res.json();
        // console.log("Comments data", json);
        setComments(json.data);
      } catch (error) {
        console.error("error", error.message);
      }
    };
    getMediaComment();
  }, [tmdbId, media_type]);

  const handleUserComment = (e) => {
    // console.log("comment submit", e.target.value);
    setUserComment(e.target.value);
  };
  const submitUserCommnet = async () => {
    try {
      // console.log(userComment);
      const res = await authFetch(`${SERVER}/api/v1/comment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId,
          type: media_type,
          comment: userComment,
        }),
      });
      // console.log("res", res);

      const data = res.data.data;
      // console.log("data ", data);
      if (res.ok) {
        // window.alert("Comment submitted");
        setComments([...comments, data]);
        setUserComment("");
      }
    } catch (error) {
      console.error("Failed to submit comment", error.message);
    }
  };
  // console.log(object);
  return (
    <div className="border flex   flex-col gap-4 border-white p-4  my-2">
      <span className="section-heading">This is a comment section</span>

      <div className="flex flex-row gap-3">
        <textarea
          onChange={handleUserComment}
          name="comment"
          className="border rounded-lg flex-6  border-white px-2 py-3 w-full  text-white"
          type="textarea"
          placeholder="Enter your comment here"
          value={userComment}
        ></textarea>

        <button onClick={submitUserCommnet} className="btn flex-1 rounded-lg">
          Submit
        </button>
      </div>

      <section className="flex flex-col gap-5 ">
        {comments.length !== 0 &&
          comments.map((ele) => {
            return (
              <div
                className="border rounded-lg border-white p-3  flex justify-start text-white text-xl gap-4"
                key={ele._id}
              >
                <div> {ele._id} :</div>
                <span>{ele.comment}</span>
              </div>
            );
          })}
      </section>
    </div>
  );
};
