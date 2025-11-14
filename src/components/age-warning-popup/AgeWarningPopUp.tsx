import { useState } from "react";
import "./AgeWarningPopUp.css"; // we'll create this file

const AgeWarningPopup: React.FC<{
  setConcent: React.Dispatch<React.SetStateAction<boolean | null>>;
}> = ({ setConcent }) => {
  const [showPopup, setShowPopup] = useState(true);

  const handleConfirm = () => {
    setShowPopup(false);
    setConcent(true);
  };
  const handleExit = () => {
    setShowPopup(false);
    setConcent(false);
  };

  if (!showPopup) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Age Restricted Content</h2>
        <p>
          This movie/TV show is marked as 18+ or NSFW. Are you sure you want to
          continue?
        </p>
        <div className="popup-buttons">
          <button className="confirm-btn" onClick={handleConfirm}>
            Yes, Continue
          </button>
          <button className="exit-btn" onClick={handleExit}>
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeWarningPopup;
