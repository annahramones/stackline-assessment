import React from "react";

export const Navbar: React.FC = () => {
  return (
    <header className="bg-blue-950">
      <nav aria-label="Global" className="mx-auto flex w-full p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Stackline</span>
            <img
              alt=""
              src={`${import.meta.env.BASE_URL}stackline_logo.svg`}
              className="h-8 w-auto"
            />
          </a>
        </div>
      </nav>
    </header>
  );
};
