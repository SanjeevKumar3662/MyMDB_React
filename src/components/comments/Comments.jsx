import { useEffect, useState } from "react";
import { authFetch } from "../../utils/authFetch";
import { useAuth } from "../../context/AuthProvider";

const SERVER = import.meta.env.VITE_SERVER_URI;

export const Comments = ({ tmdbId, media_type }) => {
  const [userComment, setUserComment] = useState("");
  const [comments, setComments] = useState([]);
  const { user } = useAuth();
  // console.log(user);

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
    setUserComment(e.target.value);
  };

  const submitUserCommnet = async () => {
    try {
      const res = await authFetch(`${SERVER}/api/v1/comment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId,
          type: media_type,
          comment: userComment,
        }),
      });

      const data = res.data.data;

      if (res.ok) {
        setComments([...comments, data]);
        setUserComment("");
      }
    } catch (error) {
      console.error("Failed to submit comment", error.message);
    }
  };

  const deleteUserComment = async (e, commentId) => {
    e.preventDefault();
    // console.log("commentId", commentId);

    const res = await authFetch(`${SERVER}/api/v1/comment/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commentId,
      }),
    });

    if (res.ok) {
      // window.alert("comment deleted");
      setComments(comments.filter((comment) => comment._id !== commentId));
    }
  };
  // console.log(comments);

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
                <div>@{ele.userId.username} :</div>
                <span>{ele.comment}</span>{" "}
                {user._id === ele.userId._id && (
                  <button
                    className="p-3 rounded-lg"
                    onClick={(e) => deleteUserComment(e, ele._id)}
                  >
                    x
                  </button>
                )}
              </div>
            );
          })}
      </section>
    </div>
  );
};
