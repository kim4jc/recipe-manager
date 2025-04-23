import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import UserContext from '../../UserContext.js';

const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

export default function MainPage(){
    const { headerUsername } = useContext(UserContext);
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();
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

    const goToRecipePage = (recipeId) => {
        navigate(`/recipe/${recipeId}`);
    };

    return(
        <div>
            {headerUsername ? (
                recipes.length > 0 ? (
                    <div className='m-4 max-w-full w-xl h-xl flex justify-center flex-wrap content-start gap-8 p-4 overflow-y-scroll bg-gray-600'>
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
                        No recipes yet.
                    </div>
                    )

            ) : (
                    <div>
                        needs styling / welcome page
                    </div>
            )
        }
</div>
    )
}