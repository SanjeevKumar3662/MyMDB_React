import { useState } from "react";
import { MenuItem } from "./MenuItem";

export const MenuList = ({ label, children, level, closeMenu }) => {
  const [toOpen, setToOpen] = useState(false);

  const handleClickMenu = (e) => {
    e.stopPropagation();
    setToOpen(!toOpen);
  };
  // console.log(toOpen);
  return (
    <div className="  " key={label}>
      <span className=" menu-list-label" onClick={(e) => handleClickMenu(e)}>
        {label} {children && (toOpen ? "-" : "+")}
      </span>

      <div className={`${toOpen ? "inline" : "hidden"}`}>
        {children &&
          children.map((ele) => (
            <MenuItem
              key={ele.label}
              {...ele}
              level={level + 1}
              closeMenu={closeMenu}
            />
          ))}
      </div>
    </div>
  );
};
