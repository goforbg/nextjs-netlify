import articleStyles from '../styles/Articles.module.css'
import ArticleItem  from './ArticleItem'
const ArticleList = ({results}) => {
    console.log("this is redulst",results)
    return (
        <div className= {articleStyles.grid}>
            {results.map(each => <ArticleItem article={each} />)}
         
        </div>
    )
}

export default ArticleList
