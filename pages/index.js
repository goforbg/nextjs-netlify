import Head from "next/head";
import Homes from "../components/Home";
export default function Home({ articles }) {
  return (
    <div>
      <Head>
        <title>Next project</title>
        <meta name="keywords" content="web development"></meta>
      </Head>
      <Homes />
    </div>
  );
}
