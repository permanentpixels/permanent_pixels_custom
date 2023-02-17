document.querySelectorAll(".official-links-links h1").forEach((button) => {
  button.addEventListener("click", () => {
      navigator.clipboard.writeText(button.textContent);
  })
});