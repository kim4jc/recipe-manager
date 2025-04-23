import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserContext from '../../UserContext.js';


const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL || "";

export default function RecipePage(){

    const { headerUsername } = useContext(UserContext);
    const navigate = useNavigate();
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState({});

    useEffect(() => {
        if (!headerUsername) {
            navigate('/');
        }
    }, [headerUsername, navigate]);

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
        fetchRecipeById();
    }, [recipeId])

    function handleEditRecipe(toBeEdittedRecipeID) {
        navigate(`/edit/${toBeEdittedRecipeID}`); // Use navigate instead of <Navigate>
    }

    async function handleDeleteRecipe(){
        try{
            const confirmation = window.confirm("Are you sure you want to delete this recipe?");
            if (!confirmation) {
                return;
            }
            const response = await fetch(`${REACT_APP_BACKEND_API_URL}/api/delete/${recipeId}`,{
                method: 'DELETE',
                credentials: 'include',
            });
            if (response.ok) {
                alert('successful!');
                console.log(response);
                navigate('/');
            } else {
                alert('failed');
            }
        }
        catch(e){
            console.log("Error: ", e);
        }
    }

    return(
        <div className='max-w-full w-screen h-screen bg-gray-100 border-2 flex justify-center flex-wrap content-start gap-8 p-4 overflow-y-scroll'>
            {recipe ? (
                <>
                    <div className='h-100 w-full min-w-80 bg-gray-300 border-2 justify-center items-center flex flex-col content-start rounded text-center p-4 gap-4'>
                        <h1 className='font-bold w-full mt-1 mb-4 h-fit text-2xl overflow-scroll'>{recipe.recipeName}</h1>
                        <div className='h-60 w-80'>
                                {recipe.imgFile ? (
                                    <img 
                                        src={recipe.imgFile} 
                                        alt={recipe.recipeName} 
                                        className='h-full w-full object-cover rounded border-4 border-gray-500'/>
                                ) : (
                                    <h1 className='h-full w-full object-cover rounded border-4 border-gray-500 p-4'>No Image Available</h1>
                                )}
                            </div>                        <h2 className='text-xl overflow-scroll'>Cuisine: {recipe.cuisine}</h2>
                        <h2 className='text-lg'>Difficulty: {recipe.difficulty}/5</h2>
                    </div>
                    <div className='w-full bg-gray-300 border-2 flex flex-col p-2'>
                        <h1 className='text-center text-2xl my-4 font-bold'>Ingredients</h1>
                        <ul className='justify-evenly flex-wrap items-center flex rounded p-2 h-fit list-disc list-inside gap-4'>
                            {recipe.ingredients?.map((ingredient)=>(
                                <li className='p-2 w-[46%] h-12 bg-gray-200 rounded overflow-scroll'>{ingredient}</li>
                            ))}
                        </ul>
                    </div>
                    <div className='w-full bg-gray-300 border-2 flex flex-col p-2'>
                        <h1 className='text-center text-2xl my-4 font-bold'>Steps</h1>
                        <ol className='justify-center flex-wrap items-center flex rounded p-2 h-fit list-decimal list-inside gap-4'>
                            {recipe.steps?.map((step)=>(
                                <li className='w-[98%] mb-4 bg-gray-200 h-fit rounded p-2 overflow-scroll'>{step}</li>
                            ))}
                        </ol>
                    </div>
                    <div className='w-full bg-gray-300 border-2 p-2'>
                        <button 
                            className="block mb-1 w-full py-1 px-2 border-2 rounded bg-gray-600 text-white" 
                            type="button" 
                            onClick={()=>(handleEditRecipe(recipe._id))}>
                                Edit Recipe
                        </button>
                        <button className="block mb-1 w-full py-1 px-2 border-2 rounded bg-red-500 text-white" 
                                type="button" 
                                onClick={()=>(handleDeleteRecipe(recipe._id))}>
                                    Delete Recipe
                        </button>
                    </div>
                </>
            ) : (
                <p>Loading Recipe...</p>
            )}
        </div>
    )

}