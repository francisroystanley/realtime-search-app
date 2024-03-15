import { Search } from "@/components/Search";
import data from "../../public/data.json";

const Page = () => (
  <div className="container mx-auto">
    <Search data={data} />
  </div>
);

export default Page;
