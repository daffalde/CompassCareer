import Cookies from "js-cookie";

export function DataLogin() {
  const token = Cookies.get("token");
  const data = Cookies.get("data") ? JSON.parse(Cookies.get("data")) : null;

  return { token, data };
}
