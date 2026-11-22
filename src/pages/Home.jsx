import React, { useState } from 'react';
import { useEffect } from 'react';
// import RecipeCard from '../components/RecipeCard';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';


function Home() {

  const [recipes, setRecipes] = useState([]);
  const [total, settotal] = useState(0);
  let [loading, setloading] = useState(true);
  const [errorMsg, seterrorMsg] = useState("");
  const [searchQuery,setsearchQuery] = useState('');


  async function fetchRecipes(skipCount,query) {
    setloading(true) ;
    try {

      let url = `https://dummyjson.com/recipes?limit=6&skip=${skipCount}`;
       
        if(query){
          url = `https://dummyjson.com/recipes/search?limit=6&skip=${skipCount}&q=${query}`;
        }

      const { data } = await axios.get(url);
      setRecipes((prev) =>
       skipCount===0 ? data.recipes : [...prev, ...data.recipes]
    );
      settotal(data.total);
    setloading(false);

    } catch (error) {
      seterrorMsg("please try again later.")
        setloading(false);
     }
  }

  useEffect(() => {
    fetchRecipes(0);
  }, []);

function handleSearch(e){
  e.preventDefault();
  const form = new FormData(e.target);
  let query = form.get("query").trim();
  setsearchQuery(query);
    // if(query){
      fetchRecipes(0,query);
    // }
}

  if (loading) {
    return <p>Loading...</p>
  }

    if (errorMsg) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <p>{errorMsg || "recipe not found"}</p>
        </main>
        )
      }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-8">
        <input
          type="text"
          name='query'
          placeholder="Search recipes..."
          className="flex-1 border border-border rounded px-3 py-2 bg-card text-text outline-none focus:border-accent"
        />
        <button type="submit" className="bg-accent hover:bg-accent-hover text-white rounded px-4 py-2 font-medium">
          Search
        </button>
      </form>

  {!loading && recipes.length === 0 && <p className='text-center py-6 text-muted'>{`no recipe found for ${searchQuery}`} </p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      {recipes.length < total && <div className="text-center mt-8">
        <button
          type='submit'
          onClick={() => fetchRecipes(recipes.length , searchQuery)}
          className="bg-accent hover:bg-accent-hover text-white rounded px-6 py-2 font-medium"
        >
          Load More
        </button>
      </div>
      }
 
    </main>
  );
}

export default Home;