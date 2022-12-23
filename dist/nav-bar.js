"use strict";

function NavBar() {
  const allPages = ["about.html", "gallery.html", "mint.html", "resources.html"];
  const disabledPages = ["gallery.html", "mint.html"];
  const pages = allPages.filter(page => !disabledPages.includes(page));
  const pageLinks = pages.map(page => {
    const name = page.substring(0, 1).toUpperCase() + page.substring(1, page.lastIndexOf("."));
    const currentPage = window.location.pathname;
    const onPage = currentPage.includes(page);
    return /*#__PURE__*/React.createElement("li", {
      className: "nav-item px-3"
    }, onPage ? /*#__PURE__*/React.createElement("a", {
      className: "nav-link",
      "aria-current": "page",
      href: page
    }, /*#__PURE__*/React.createElement("u", {
      className: "white"
    }, /*#__PURE__*/React.createElement("h5", null, name))) : /*#__PURE__*/React.createElement("a", {
      className: "nav-link",
      href: page
    }, /*#__PURE__*/React.createElement("h5", null, name)));
  });
  return /*#__PURE__*/React.createElement("nav", {
    className: "navbar navbar-expand-lg bg-black px-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("a", {
    href: "./index.html",
    className: "navbar-brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "./images/favicon.png",
    alt: "Permanent Pixels Logo",
    width: "50",
    height: "50"
  })), /*#__PURE__*/React.createElement("button", {
    className: "navbar-toggler custom-toggler border-0",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#navbarSupportedContent",
    "aria-controls": "navbarSupportedContent",
    "aria-expanded": "false",
    "aria-label": "Toggle navigation"
  }, /*#__PURE__*/React.createElement("span", {
    className: "navbar-toggler-icon"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "collapse navbar-collapse",
    id: "navbarSupportedContent"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "navbar-nav me-auto mb-lg-0 text-center"
  }, pageLinks)));
}

ReactDOM.createRoot(document.querySelector("#nav")).render(React.createElement(NavBar));