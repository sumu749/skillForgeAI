import { Suspense } from "react";
import ExplorePage from "./explore-client";

export default function Page() {
  return (
    <Suspense fallback={<div className="container py-10">Loading courses...</div>}>
      <ExplorePage />
    </Suspense>
  );
}
