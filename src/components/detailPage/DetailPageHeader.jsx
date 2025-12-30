import React, { useEffect, useState } from "react";
import { useApi } from "../../api/apiClient";
import { useParams } from "react-router-dom";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

export default function DetailPageHeader({ name, category }) {
  const api = useApi();
  const { id } = useParams();
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await api(`/projects/${id}/ratings`, { method: "GET" });
        const data = res?.payload ?? res ?? {};
        console.log("fetched rating data:", data);
        setAvg(data.ratingAvg ?? data.averageRating ?? 0);
        setCount(data.ratingCount ?? data.ratingsCount ?? 0);
        setUserRating(data.userRating ?? null);
      } catch (err) {
        console.error("fetch rating:", err);
      }
    })();
  }, [id]);

  const handleRate = async (value) => {
    try {
      const newCount = count + (userRating ? 0 : 1);
      const newAvg = userRating
        ? (avg * count - userRating + value) / count
        : (avg * count + value) / newCount;
      setAvg(Number.isFinite(newAvg) ? Number(newAvg.toFixed(2)) : value);
      setCount(newCount);
      setUserRating(value);

      await api(`/projects/${id}/ratings`, {
        method: "POST",
        body: { value },
      });
    } catch (err) {
      console.error("submit rating:", err);
      setUserRating((u) => (u === value ? u : u));
    }
  };

  const displayStars = (n) =>
    Array.from({ length: 5 }, (_, i) => {
      const val = i + 1;
      const filled = userRating ? val <= userRating : val <= Math.round(avg);
      const Icon = filled ? AiFillStar : AiOutlineStar;
      return (
        <button
          key={val}
          type="button"
          onClick={() => handleRate(val)}
          onMouseEnter={() => setHover(val)}
          onMouseLeave={() => setHover(0)}
          className="text-2xl text-yellow-500 p-1"
          aria-label={`Rate ${val} star`}
        >
          <Icon />
        </button>
      );
    });

  return (
    <div className="w-full max-w-6xl mx-auto py-5">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            {name}
          </h1>
          <p className="mt-3">
            <span className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
              {category}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {displayStars(userRating ?? Math.round(avg))}
            </div>
            <div className="ml-3 text-sm text-gray-700">
              <div className="font-medium">{avg ?? 0} / 5</div>
              <div className="text-xs text-gray-500">
                {count} rating{count === 1 ? "" : "s"}
              </div>
            </div>
          </div>
          {userRating && (
            <div className="text-xs text-gray-500">
              You rated: {userRating}
              <AiOutlineStar />
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
