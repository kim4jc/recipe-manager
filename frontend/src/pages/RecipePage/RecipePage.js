import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

export default function RecipePage(){

    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(()=>{
        const fetchRecipeById = async () => {
            try{
                const response = await fetch(`${REACT_APP_BACKEND_API_URL}/api/fetch/${recipeId}`, {
                    method: 'GET',
                    credentials: 'include',
                })
                const resData = await response.json();
                console.log(resData);
                setRecipe(resData);
            }
            catch(err){
                console.log("Error fetching recipe: ", err);
            }
        }
        fetchRecipeById(recipeId);
    }, [recipeId])

    return(
        <div className='max-w-full w-screen h-screen bg-gray-100 border-2 flex justify-center flex-wrap content-start gap-8 p-4 overflow-y-scroll'>
            {recipe && recipe.length > 0 ? (
                <>
                    <div className='h-100 w-full min-w-80 bg-gray-300 border-2 justify-center items-center flex flex-col content-start rounded text-center p-4 gap-4'>
                        <h1 className='font-bold w-full mt-1 mb-4 h-fit text-2xl overflow-scroll'>{recipe[0].recipeName}</h1>
                        <div className='bg-purple-200 border-4 border-gray-500 max-w-80 max-h-80 h-80 w-80 mb-2'>img placeholder</div>
                        <h2 className='text-xl overflow-scroll'>Cuisine: {recipe[0].cuisine}</h2>
                        <h2 className='text-lg'>Difficulty: {recipe[0].difficulty}/5</h2>
                    </div>
                    <div className='w-full bg-gray-300 border-2 flex flex-col p-2'>
                        <h1 className='text-center text-2xl my-4 font-bold'>Ingredients</h1>
                        <ul className='justify-evenly flex-wrap items-center flex rounded p-2 h-fit list-disc list-inside gap-4'>
                            {recipe[0].ingredients.map((ingredient)=>(
                                <li className='p-2 w-[46%] h-12 bg-gray-200 rounded overflow-scroll'>{ingredient}</li>
                            ))}
                        </ul>
                    </div>
                    <div className='w-full bg-gray-300 border-2 flex flex-col p-2'>
                        <h1 className='text-center text-2xl my-4 font-bold'>Steps</h1>
                        <ol className='justify-center flex-wrap items-center flex rounded p-2 h-fit list-decimal list-inside gap-4'>
                            {recipe[0].steps.map((step)=>(
                                <li className='w-[98%] mb-4 bg-gray-200 h-fit rounded p-2 overflow-scroll'>{step}</li>
                            ))}
                        </ol>
                    </div>
                </>
            ) : (
                <p>Loading Recipe...</p>
            )}
        </div>
    )

}