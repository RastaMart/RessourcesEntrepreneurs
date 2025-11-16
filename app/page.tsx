import { getAllResources } from "../lib/resources";
import HomeClient from "../components/HomeClient";

export default function HomePage() {
  const resources = getAllResources();
  return <HomeClient resources={resources} />;
}


