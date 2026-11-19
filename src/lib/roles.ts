export function getDashboardPath(role?: string | null) {
  switch (role) {
    case "admin":
      return "/dashboard/admin";
    case "vendor":
      return "/dashboard/vendor";
    default:
      return "/dashboard/customer";
  }
}


export function safeRedirect(path?: string | null, fallback = "/dashboard") {
  if (path && path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/\\")) {
    return path;
  }
  return fallback;
}