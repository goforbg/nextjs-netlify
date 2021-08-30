import headerStyles from '../styles/Header.module.css'
import Home from './Home'

const Header = () => {

    return (
        <div>
           <h1 className={headerStyles.title}><span>webDev </span>News</h1> 
          <p className={headerStyles.description}> Keep up to date with latest web</p>
          <Home />

        </div>
        
    )
}

export default Header
