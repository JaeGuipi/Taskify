export const checkAuthRedirect = () => {
  if (typeof window === "undefined") return;

  const tokenCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="));

  if (tokenCookie) {
    const restrictedPaths = ["/", "/login", "/signup"];
    if (restrictedPaths.includes(window.location.pathname)) {
      window.location.href = "/mydashboard";
    }
  }
};
