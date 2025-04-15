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
            {headerUsername && recipes.length > 0 ? (
                <div className='max-w-full w-screen h-screen flex justify-center flex-wrap content-start gap-8 p-4 overflow-y-scroll'>
                    {recipes.map((recipe) => (
                        <div className='h-80 w-80 min-w-80 bg-gray-200 border-2 justify-between flex flex-col content-start rounded text-center p-1'
                             key={recipe._id}>
                            <div>
                            <h1 className='font-bold w-full mt-2 mb-2 h-fit overflow-scroll'>{recipe.recipeName}</h1>
                            </div>
                            <div className='h-40'>
                                <h1 className='bg-purple-200 h-full mb-2'>temporary img div</h1>
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
            }
            {!headerUsername && (
                <div>
                    needs styling / welcome page
                </div>
            )}
        </div>

    )
}