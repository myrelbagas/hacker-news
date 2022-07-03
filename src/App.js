import React from "react";
import ReactDOM from "react-dom";

import './App.css';

function HackerNewsPosts({ posts }) {
  if (posts.length === 0) {
    return <div className="loading">
      <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>;
  }

  return (
    <div className="container">
      <h2 className="headers"> Top 10 Hacker News Stories </h2>      

      <div className="columns">
        {posts.map((post,index) => (
          <div className="author-div" key={index}>
            <div className="author-box"> 
              <a href={post.story_url}>   
                <img src={post.image_path} className="author-img" alt=""/>               
              </a>
              <p className="title">{post.story_title}</p>
              <p className="author">{post.id}</p> 
              <p className="label">Story timestamp <span>{post.story_timestamp}</span></p>
              <p className="label"> Story score <span>{post.story_score}</span></p>
              <p className="label">Author karma score <span>{post.karma}</span></p>  
              <a className="author-link" href={post.story_url}> VISIT PAGE</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [posts, setPosts] = React.useState([]);
  const [userImage, setUserImage] = React.useState([]);

  React.useEffect(() => {
    async function getTopStories() {
      const url = "https://hacker-news.firebaseio.com/v0/topstories.json";
      try {
        const response = await fetch(url);
        if (response.ok === false) {
          throw new Error("Response Error:" + response.text);
        }
        const json = await response.json();       

        const shuffled = [...json].sort(() => 0.5 - Math.random());
        const StoryItem = shuffled.slice(0,10)
         .map(id =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then(
              response => response.json()
            )
          );
        
        const StoryResult = await Promise.all(StoryItem);

        const User = StoryResult
          .map( id =>
            fetch(`https://hacker-news.firebaseio.com/v0/user/${id.by}.json`).then(
              response => response.json()
            )
          );
        //console.log(User) 

        const UserResult = await Promise.all(User);
        //console.log(UserResult) 

        const allData = []

        Object.values(StoryResult).forEach((v1,k1) => {
          Object.values(UserResult).forEach((v2,k2) => { 
            if(v1['by'] === v2['id']){ 
                
                v2['story_title'] = v1['title']
                v2['story_url'] = v1['url']

                var timestamp = v1['time']
                var date = new Date(timestamp);
                var dateFormat = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
                //console.log(dateFormat)
                v2['story_timestamp'] = dateFormat

                var score = v1['score'] 
                v2['story_score'] = score                

                var userID = v2['id']
                var withPhoto = ['','LeoPanthera','SlowOnTheUptake','historynops','mariuz','fortran77','antismarm','azhenley','joveian','tosh', 'aosaigh','Brushfire','whatrocks','smackeyacky','capableweb', 'clumsysmurf','dingosity',  'echen','elephant_burger', 'firstSpeaker', 'gmays', 'harporoeder',  'huftis','intunderflow', 'jrepinc','mikece', 'sohkamyung',  'thesecretceo', ]
                var user = withPhoto.includes(userID);
                console.log(user)                
                
                if(user === true){                   
                  let userImage = `./assets/images/${userID}.jpg`;
                  v2['image_path']= userImage; 
                } else {
                  let userImage = `./assets/images/noImage.jpg`;
                  v2['image_path']= userImage; 
                }             
                
                allData.push(v2) 
                allData.sort(function(a , b){return a.story_score-b.story_score});
                //console.log(allData)
                setPosts(allData);
            } 
          })
        })

        //console.log(allData)

        
      } catch (err) {
        console.error(err);
      }
    }
    getTopStories();
  }, []);

  return (
    <div className="">
      <HackerNewsPosts posts={posts} />
    </div>
  );
}

export default App;

