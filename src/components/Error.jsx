import { useRouteError } from "react-router-dom";

export default function Error() {
  const error = useRouteError();
  console.error("Route Error:", error);

  return (
    <div>
      <h1>Oops! Something went wrong.</h1>
      <p>{error.statusText || "An unexpected error occurred."}</p>
      {error.status && <p>Error Code: {error.status}</p>}
    </div>
  );
}
