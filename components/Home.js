import Link from "next/link";
import homeStyles from "../styles/Home.module.css";

const Home = () => {
  const routes = [
    {
      path: "/articleList",
      name: "Blogs",
      exact: true,
    },
    {
      path: "/allImages",
      name: "Images",
      exact: true,
    },
    {
      path: "/allVideos",
      name: "Videos",
      exact: true,
    },
  ];

  return (
    <div className={homeStyles.home}>
      <h1>This is home page</h1>{" "}
      <div>
        {routes.map((each) => (
          <Link href={each.path}>
            <button>{each.name}</button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
