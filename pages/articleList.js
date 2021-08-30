import ArticleList from '../components/ArticleList'
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
const articleList = () => {
    const [results, setResult] = useState([]);
    useEffect(() => {
        //const res =  fetch(`https://jsonplaceholder.typicode.com/posts?_limit=6`).then(response =>console.log("working",response.json()))
        const getNameById = () => {
          return axios
            .get(`https://jsonplaceholder.typicode.com/posts?_limit=6`)
            .then((response) => {
              response = response.data;
              return response;
            });
        };
        getNameById().then((data) => {
          setResult(data);
          console.log("this is data", data);
        });
      }, []);
    return (
        <div>
           <ArticleList results ={results}/> 
        </div>
    )
}
export default articleList
