// import React from 'react'
// import path from 'path'
// import fs from 'fs'
// const allImages = ({posts}) => {
//     console.log("thdasfasdf",posts)
//     return (
//         <div>
//             This is images
//         </div>
//     )
// }
// export const getStaticProps = async () => {
//    const files = fs.readdirSync(path.join('post'))
//    console.log("this is file", files)
//    const posts =files.map(filename => {
//        //create slug
//        const slug = filename.replace('.md',"")
//        //get frontmatter
//        const markdownWithMeta = fs.readFileSync(path.join('post',filename))
//        return {
//            slug
//        }
//    })
//    console.log("this is post",posts)
//     return {
//         props:{
//             posts:"this is cool post"
//         }
//     }
//     }
// export default allImages

import React from 'react'
import { Component } from 'react'
import Head from "next/head";
import { attributes, react as HomeContent } from '../content/home.md';
const allImages = () => {
    let { title, cats } = attributes;
    return (
        <div>
                   <Head>
          <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
        </Head>
        <article>
          <h1>{title}</h1>
          <HomeContent />
          <ul>
            {cats.map((cat, k) => (
              <li key={k}>
                <h2>{cat.name}</h2>
                <p>{cat.description}</p>
              </li>
            ))}
          </ul>
        </article>

        </div>
    )
}

export default allImages

