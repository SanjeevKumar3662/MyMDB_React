import { useNavigate } from "react-router-dom";
import "./SearchInput.css";

const SearchInput = () => {
  const navigate = useNavigate();
  return (
    <div className="search-input">
      <input
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          e.key === "Enter" && navigate(`/search/${e.currentTarget.value}`);
        }}
        type="text"
        placeholder="Search for a movie or a person"
      />
    </div>
  );
};

export default SearchInput;
