
import {useEffect, useState} from "react";
import supabase from "./supabase.js";

import "./styles.css";

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <span style={{fontSize: "40px"}}>{count}</span>
                                                                //CallBack Function
      <button 
      className="btn btn-large" onClick={() => 
      setCount((count) => count+1)}>
      +1
      </button>
    </div>
  )
}

function App() {
  {/*have to render state to make changes  on screen*/}
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");
  useEffect(function () {
    async function getFacts() {
      setIsLoading(true);

      let query = supabase.from("facts").select("*");

      if(currentCategory !== "all")
      query = query.eq("category", currentCategory);

    let { data: facts, error } = await query
    .order('votesInteresting', { ascending: false })
    .limit(1000);

    if(!error) setFacts(facts);
    else alert("There was a problem getting data");
    setIsLoading(false);
  
    }
    getFacts();
  }, [currentCategory])
  
  return (
    <>
    {/* HEADER */}
    {/*1. define state variable*/}
      <Header 
      showForm={showForm} 
      setShowForm={setShowForm}
      />
       
      {/* Ternery operator*/}
      {/*2.Use State variable*/}
      {showForm ? (
        <NewFactForm 
        setFacts={setFacts} 
        setShowForm={setShowForm}
        />
        
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory}/>
        {isLoading ? <Loader /> : <FactList facts={facts} setFacts={setFacts} />}
    
        

      <main/>
    </main>
  </>
  );
}
//
function Loader(){
  return (
    <p className="message">Loading...</p>
  )
}

//
function Header({showForm, setShowForm}){
  const appTitle = "Today I Learned!";

  return (
    <header className="header">
        <div className="logo">
            <img src="logo.png" alt="" height="68" width="68" alt="Today I Leanred Logo"/>
            <h1>{appTitle}</h1>
        </div>
      
        <button 
          className="btn btn-large btn-open" 
        // update State Variable
          onClick={() => setShowForm((show) => !show)}>
          {showForm ? "Close" : "Share a Fact"}
        </button>
      </header>
  )
}

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];
//

function isValidURL (string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https";
}

function NewFactForm({setFacts, setShowForm}) {
const[text, setText] = useState("");
const[source, setSource] = useState("");
const[isUpLoading, setIsUpLoading]  = useState(false);
const[category, setCategory] = useState("");
const textLength = text.length;

async function handleSubmit(e) {
// Prevent browser reload
  e.preventDefault();
  //Check if data is  valid .if true creat new  fact
  if(text && isValidURL(source) && category && textLength <= 200){
      //Create a nnew fact object
      // const newFact = {
      //   id: Math.round(Math.random() * 1000000),
      //   text: text,
      //   source: source,
      //   category: category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };

      //upload new fact to supabase 
    setIsUpLoading(true);
    const {data: newFact, error} = await supabase
      .from("facts")
      .insert([{text, source, category}])
      .select();
    setIsUpLoading(false)
    //Add the new fact to the UI: add fact to state
    if(!error) setFacts((facts) => [newFact[0], ...facts]);
    //Reset input fields
    setText("");
    setSource("");
    setCategory("");
    //Close form
    setShowForm(false);
    
  }

  console.log(text, source, category)
}
return (
    <form className="fact-form"
    onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Share a fact with the world..." 
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUpLoading}
      />

      <span>{ 200 - textLength }</span>

      <input 
        type="text" 
        placeholder="Trustworthy source..." 
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={isUpLoading}
      />

      <select value={category} 
      onChange={(e) => 
        setCategory(e.target.value)}
        disabled={isUpLoading}
        >
        <option value="">Choose Category:</option>
        {CATEGORIES.map((cat) => 
          <option key={cat.name} value={cat.name}>
          {cat.name.toUpperCase()}</option>)}
      </select>
      <button className="btn btn-large" disabled={isUpLoading}>Post</button>
    </form>
    );
}
// Place out component becausew it will never change

function CategoryFilter({setCurrentCategory}) {
  return (
    <aside> 
      <ul>
        <li className="category">
          <button 
          className="btn btn-all"
          onClick={() => setCurrentCategory("all")}>All</button>
        </li>

        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button 
              className="btn btn-category" 
              onClick={() => setCurrentCategory(cat.name)}
              style={{backgroundColor: cat.color}}>
              {cat.name}</button>
        </li>
        ))}
        
      </ul>
    </aside>
  );

}

function FactList({ facts, setFacts }) {

  if(facts.length === 0)
    return (
      <p className="message">No facts for this category yet! Create the first one! </p>
    );

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          //key prop has to be on the first element thats in facts.map
          //props
          <Fact key={fact.id} fact={fact} setFacts={setFacts}/>
        ))}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own!</p>
    </section>
  );
}
 // destructuring props
function Fact({fact, setFacts}) {

const[isUpdating, setIsUpdating] = useState( false);
const isDisputed = fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;
 async function handleVote(columnName) {
    setIsUpdating(true);
    const{data: updatedFact, error} = await supabase
      .from('facts')
      .update({[columnName]: fact [columnName] + 1})
      .eq("id", fact.id)
      .select();
    setIsUpdating(false);

    console.log(updatedFact);
    if(!error) setFacts((facts) => facts.map((f) => f.id === fact.id ? updatedFact[0] : f))
  }
  // Other ways of destructoring const {factObj} = props; same as factObj  = props.factObj
  return (
    <li className="fact">
      <p>
        {isDisputed ?  <span className="disputed">[❌ DISPUTED] </span> : null}
        {fact.text}
        <a className="source" href={fact.source} target="_blank">(Source)</a>
          
      </p>
      <span className="tag" style={{backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category).color}}>{fact.category}</span>
        <div className="vote-buttons">
          <button 
            onClick={() => 
            handleVote("votesInteresting")} 
            disabled={isUpdating}>👍🏽 {fact.votesInteresting}</button>
          <button
            onClick={() => 
            handleVote("votesMindblowing")} 
            disabled={isUpdating}>🤯 {fact.votesMindblowing}</button>
          <button
            onClick={() => 
            handleVote("votesFalse")} 
            disabled={isUpdating}>❌ {fact.votesFalse}</button>
        </div>
    </li>
  )
}
export default App;