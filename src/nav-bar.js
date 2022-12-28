"use strict";

function NavBar() {
  const allPages = ["about", "gallery", "mint", "resources"];
  const disabledPages = ["gallery"];
  
  const pages = allPages.filter(page => !disabledPages.includes(page));

  const pageLinks = pages.map((page) => {
    const name =
      page.substring(0, 1).toUpperCase() +
      page.substring(1);

    const currentPage = window.location.pathname;
    const onPage = currentPage.includes(page);

    return (
      <li className="nav-item px-3">
        {onPage ? (
          <a className="nav-link" aria-current="page" href={page}>
           <u className="white"> 
            <h5>{name}</h5>
           </u> 
          </a>
        ) : (
          <a className="nav-link" href={page}>
            <h5>{name}</h5>
          </a>
        )}
      </li>
    );
  });

  return (
    <nav className="navbar navbar-expand-lg px-6">
      <div className="container-fluid">
        <a href="/" className="navbar-brand">
          <img
            src="./images/favicon.png"
            alt="Permanent Pixels Logo"
            width="50"
            height="50"
          />
        </a>
        <button
          className="navbar-toggler custom-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-lg-0 text-center">{pageLinks}</ul>
      </div>
    </nav>
  );
}

ReactDOM.createRoot(document.querySelector("#nav")).render(
  React.createElement(NavBar)
);
