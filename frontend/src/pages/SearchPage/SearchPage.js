import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import UserContext from '../../UserContext.js';

const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL || "";

export default function SearchPage(){
    const { headerUsername } = useContext(UserContext);
    const navigate = useNavigate();
    const [cuisine, setCuisine] = useState('');
    const [ingredients, setIngredients] = useState([""]);
    const [difficulty, setDifficulty] = useState(0);
    const [recipes, setRecipes ] = useState([]);
    const [allOrFewerIngredientsUsed, setAllOrFewerIngredientsUsed] = useState([]);
    const [atLeastOneMatchingIngredient, setAtLeastOneMatchingIngredient] = useState([]);
    const [ isSearching, setIsSearching ] = useState(false);


    useEffect(() => {
        if (!headerUsername) {
            navigate('/');
        }
    }, [headerUsername, navigate]);

    useEffect(()=> {
        const fetchRecipes = async () => {
            try{
                const response = await fetch(`${REACT_APP_BACKEND_API_URL}/api/fetch`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const resData = await response.json();
                setRecipes(resData);
                console.log(resData);
                }
            catch(err){
                console.error("Error fetching recipes:", err);
            };
        }
        fetchRecipes();
    }, []);

    function handleDifficultyClick(rating){
        setDifficulty(rating);
    }

    function handleIngredientChange(value, index){
        const updatedIngredients = [...ingredients];
        updatedIngredients[index] = value;
        setIngredients(updatedIngredients);
    }

    function handleAddIngredient(){
        const updatedIngredients = [...ingredients, ""];
        console.log("Updated Ingredients:", updatedIngredients); // Check updated state
        setIngredients(updatedIngredients); //array will now be the same as before but with a new empty string element, therefore it will map another text input for the new empty string element.
    }


    function handleRemoveIngredient(index){
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(index, 1); //remove 1 element starting at the index aka. remove the desired element
        setIngredients(updatedIngredients);
    }

    async function handleSearchRecipe(ev){
        ev.preventDefault();
        if (cuisine.trim() === '' && difficulty === 0 && ingredients.some(ingredient => ingredient.trim() === "")){
            // No search filters, so show all recipes initially
            setAllOrFewerIngredientsUsed([]);
            setAtLeastOneMatchingIngredient([]);
            setIsSearching(false);
            return;
        }
        try{
            const filteredIngredients = ingredients.filter(ingredients => ingredients.trim() !== "")
            const response = await fetch(`${REACT_APP_BACKEND_API_URL}/api/search`, {
                method: 'POST', // Use POST for sending data in the body
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cuisine,
                    difficulty,
                    ingredients: filteredIngredients,
                }),
            });
    
            const resData = await response.json(); // Expecting { allOrFewerIngredientsUsed, atLeastOneMatchingIngredient }
            setAllOrFewerIngredientsUsed(resData.allOrFewerIngredientsUsed)
            setAtLeastOneMatchingIngredient(resData.atLeastOneMatchingIngredient)
            setIsSearching(true);
            console.log("allOrFewerIngredientsUsed", allOrFewerIngredientsUsed)
            console.log("atLeastOneMatchingIngredient", atLeastOneMatchingIngredient)
        }
        catch(err){
            console.log("Error", err);
        }
    }

    const goToRecipePage = (recipeId) => {
        navigate(`/recipe/${recipeId}`);
    };

    return(
        <div>
            <form className="max-w-xl mt-12 m-auto bg-gray-300 border-2 p-2" onSubmit={(handleSearchRecipe)}>
                <h1 className='font-bold text-center p-2 mb-2'>Search</h1>
                <div className="w-full justify-center items-center py-1 px-1 mb-8 justify-between border-2 rounded bg-gray-100">
                    <h2 className="text-center">Cuisine</h2>
                    <input 
                        className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"
                        type="text" 
                        placeholder={'Type of Cuisine'} 
                        value={cuisine}
                        onChange={ev=> setCuisine(ev.target.value)}/>
                </div>
                <ul className="max-w-xl m-auto mb-10 border-2 bg-gray-100 rounded">
                    <h1 className="text-center">Ingredients</h1>
                    {ingredients.map((ingredient, index) => (
                        <li key={index} className={`${ingredients.length > 1 ? "flex":""}`}>
                            <input  
                            className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-3"
                            type="text" 
                            placeholder={`Ingredient ${index + 1}: `}
                            value={ingredient}
                            onChange={(ev)=>(handleIngredientChange(ev.target.value, index))}
                        />
                        {/*only show remove ingredient button if there is more than 1 ingredient*/}
                        {ingredients.length > 1 &&
                            (<button 
                                className="block px-1 py-1 border-2 text-sm rounded text-white bg-red-500 rounded mb-3"
                                type='button'
                                onClick={()=>(handleRemoveIngredient(index))}>
                                    Remove
                            </button>)
                        }
                        </li>
                    ))}
                    <button 
                        className="block mb-1 w-full py-1 px-2 border-2 rounded bg-gray-600 text-white"
                        type='button'
                        onClick={handleAddIngredient}>
                            Add Ingredient
                    </button>
                </ul>
                <div className="w-full border-2 bg-gray-100 rounded max-w-xl m-auto mb-8">
                    <h2 className="text-center">Recipe Difficulty</h2>
                    <div className="flex justify-center items-center gap-2">
                    {/*create a button to set difficulty to 0 and search through all difficulties*/}
                        <div className="flex-col w-full items-center">
                            <div className='m-2'>
                            <button
                                key={0}
                                type="button"
                                onClick={() => handleDifficultyClick(0)} // 0 means "all difficulties"
                                className='block mb-15 w-full py-1 px-2 border-2 rounded bg-gray-600 text-white'>
                                    All Difficulties
                            </button>
                            </div>
                            <div className='flex justify-center items-center gap-2 m-2'>
                            {/*Create 5 different buttons each with a different rating from 1-5*/}
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    type="button"
                                    /*set difficulty to the rating of the corresponding button*/
                                    onClick={() => handleDifficultyClick(rating)}
                                    className="text-3xl">
                                    {/*Change emoji based on difficulty selected. ie: if selecting 2, the first 2 buttons will be chef emojis bc their button rating <=2 */}
                                    {rating <= difficulty ? "👨‍🍳" : "👨"}
                                </button>
                            ))}
                            </div>
                        </div>
                    </div>
                    {difficulty === 0 ? (<p className="text-center">Selected Difficulty: All Difficulties</p>) : (<p className="text-center">Selected Difficulty: {difficulty}/5</p>)}
                        <button
                            className="block mb-15 w-full py-1 px-2 border-2 rounded bg-gray-600 text-white"
                            type="submit">
                            Search
                        </button>
                </div>
            </form>


            {!isSearching ? (
                <div className='m-4 max-w-full w-xl h-xl flex justify-center flex-wrap content-start gap-8 p-4 overflow-y-scroll bg-gray-600'>
                    <h1 className="w-full text-center font-bold text-white p-4">All Recipes</h1>
                    {recipes.map((recipe) => (
                        <div className='h-80 w-80 min-w-80 bg-gray-200 border-2 justify-between flex flex-col content-start rounded text-center p-1'
                             key={recipe._id}>
                            <div>
                            <h1 className='font-bold w-full mt-2 mb-2 h-fit overflow-scroll'>{recipe.recipeName}</h1>
                            </div>
                            <div className='h-40 w-full flex justify-center items-center'>
                                {recipe.imgFile ? (
                                    <img 
                                        src={recipe.imgFile} 
                                        alt={recipe.recipeName} 
                                        className='h-full w-full object-cover rounded border-4 border-gray-500'/>
                                ) : (
                                    <h1 className='h-full border-4 border-gray-500 p-4'>No Image Available</h1>
                                )}
                            </div>
                            <div>
                            <h2 className='w-full h-fit overflow-scroll'>Cuisine: {recipe.cuisine}</h2>
                            <h2 className='w-full h-fit mb-1'>Difficulty: {recipe.difficulty}/5</h2>
                            <button onClick={() => goToRecipePage(recipe._id)} className='size-fit items-end rounded border-2 bg-gray-600 mb-2 p-2 text-white'>Go To Recipe</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <div className="bg-gray-600 m-4">
                    <h1 className="text-center w-full p-4 font-bold text-white">Recipes with all or fewer ingredients:</h1>
                    {allOrFewerIngredientsUsed.length > 0 ? (
                        <div className='max-w-full w-screen h-screen flex justify-center flex-wrap content-start gap-8 p-4 overflow-y-scroll'>                  
                        {allOrFewerIngredientsUsed.map((recipe) => (
                                <div className='h-80 w-80 min-w-80 bg-gray-200 border-2 justify-between flex flex-col content-start rounded text-center p-1'
                                     key={recipe._id}>
                                    <div>
                                        <h1 className='font-bold w-full mt-2 mb-2 h-fit overflow-scroll'>{recipe.recipeName}</h1>
                                    </div>
                                    <div className='h-40 w-full flex justify-center items-center'>
                                        {recipe.imgFile ? (
                                            <img 
                                                src={recipe.imgFile} 
                                                alt={recipe.recipeName} 
                                                className='h-full w-full object-cover rounded border-4 border-gray-500'/>
                                        ) : (
                                            <h1 className='h-full border-4 border-gray-500 p-4'>No Image Available</h1>
                                        )}
                                    </div>
                                    <div>
                                    <h2 className='w-full h-fit overflow-scroll'>Cuisine: {recipe.cuisine}</h2>
                                    <h2 className='w-full h-fit mb-1'>Difficulty: {recipe.difficulty}/5</h2>
                                    <button onClick={() => goToRecipePage(recipe._id)} className='size-fit items-end rounded border-2 bg-gray-600 mb-2 p-2 text-white'>Go To Recipe</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <h1 className=" bold text-center w-full p-4 text-white">No Recipes Found</h1>
                        </div>
                        )
                    }
                    </div>

                    <div className="bg-gray-600 flex-col m-4">
                    <h1 className="text-center w-full p-4 font-bold text-white">Recipes with at least one matching ingredient:</h1>
                    {atLeastOneMatchingIngredient.length > 0 ? (
                        <div className='max-w-full w-screen h-screen flex justify-center flex-wrap content-start gap-8 p-4 overflow-y-scroll'>                  
                        {atLeastOneMatchingIngredient.map((recipe) => (
                                <div className='h-80 w-80 min-w-80 bg-gray-200 border-2 justify-between flex flex-col content-start rounded text-center p-1'
                                     key={recipe._id}>
                                    <div>
                                        <h1 className='font-bold w-full mt-2 mb-2 h-fit overflow-scroll'>{recipe.recipeName}</h1>
                                    </div>
                                    <div className='h-40 w-full flex justify-center items-center'>
                                        {recipe.imgFile ? (
                                            <img 
                                                src={recipe.imgFile} 
                                                alt={recipe.recipeName} 
                                                className='h-full w-full object-cover rounded border-4 border-gray-500'/>
                                        ) : (
                                            <h1 className='h-full border-4 border-gray-500 p-4'>No Image Available</h1>
                                        )}
                                    </div>
                                    <div>
                                    <h2 className='w-full h-fit overflow-scroll'>Cuisine: {recipe.cuisine}</h2>
                                    <h2 className='w-full h-fit mb-1'>Difficulty: {recipe.difficulty}/5</h2>
                                    <button onClick={() => goToRecipePage(recipe._id)} className='size-fit items-end rounded border-2 bg-gray-600 mb-2 p-2 text-white'>Go To Recipe</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-center w-full p-4 text-white">No recipes Found</h1>
                        </div>
                        )
                    }
                    </div>
                </div>
                )
            }
        </div>
    )
}