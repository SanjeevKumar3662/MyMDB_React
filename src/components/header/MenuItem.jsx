import React, { useState } from "react";
import { Link } from "react-router-dom";

export const MenuItem = ({ label, children, to, level, closeMenu }) => {
  const [toOpen, setToOpen] = useState(false);

  const handleClickMenu = (e) => {
    // Only toggle if item has children
    if (children) {
      e.stopPropagation();
      setToOpen(!toOpen);
    }
  };

  return (
    <div className="menu-item" style={{ marginLeft: `${level * 1}rem` }}>
      {/* If it has children: it's expandable */}
      {children ? (
        <span className="menu-item-label" onClick={handleClickMenu}>
          {label} <span>{children && "+"}</span>
        </span>
      ) : (
        // If no children: it's a link
        <Link to={to} className="block" onClick={closeMenu}>
          {label}
        </Link>
      )}

      {/* Nested child items */}
      <div className={`${toOpen ? "block" : "hidden"}`}>
        {children &&
          children.map((child) => (
            <MenuItem key={child.label} {...child} level={level + 1} />
          ))}
      </div>
    </div>
  );
};
