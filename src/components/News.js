import React, {useEffect, useState} from "react";
import NeswItem from "./NewsItem";
import Spinner from "./spinner";
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);                  

  const capitalizeFirstLetter=(string)=>{
    return string[0].toUpperCase() + string.slice(1);
  }


  const updateNews = async () => {
    props.setProgress(10);
    const url =`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    await fetch(url).then((res) => {
      props.setProgress(30);
      res.json().then((result) => {
        props.setProgress(70);
        setArticles(result.articles);
        setLoading(false);
        setTotalResults(result.totalResults);
      });
      props.setProgress(100);
    });
  };

  useEffect(() => {
    document.title = `NewsMonkey - ${capitalizeFirstLetter(props.category)}`
    updateNews()
    // eslint-disable-next-line
  }, [])

  const fetchMoreData = async () => {
    let url =`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page + 1);
    await fetch(url).then((res) => {
      res.json().then((result) => {
        setArticles(articles.concat(result.articles))
        setTotalResults(result.totalResults)
      });
    });
  };
  
    return (
      <>
          <h1 className="text-center" style={{margin: '35px 0', marginTop: '86px'}}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
          {loading && <Spinner/>}

          <InfiniteScroll
            dataLength={articles.length}
            next={fetchMoreData}
            hasMore={articles.length !== totalResults}
            loader={<Spinner/>}
            scrollableTarget="scrollableDiv"
          >
          <div className="container">
            <div className="row">
              {articles &&
                articles.map((element) => (
                  <div className="col-md-4" key={element.url}>
                    <NeswItem
                      title={element.title?element.title:''}
                      description={element.description?element.description:''}
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author ={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                ))}
                </div>
          </div>
          </InfiniteScroll>
      </>
    )
}

News.defaultProps={
  country: 'in',
  pageSize: 8,
  category: 'general'
}

News.protoTypes={
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News
