import { getUserRole } from "./AuthServices";

export const ProtectedRoute = ({ children, roles }) => {
  const role = getUserRole();
  const _role = roles.find((x) => x === role);
  if (_role) {
    return children;
  }
};
