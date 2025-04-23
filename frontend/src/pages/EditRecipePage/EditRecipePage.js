import { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import UserContext from "../../UserContext.js";
import { useParams } from "react-router-dom";

const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

export default function EditRecipePage(){
    const navigate = useNavigate();
    const { headerUsername } = useContext(UserContext);
    const { recipeId } = useParams();
    const [recipeName, setRecipeName] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [difficulty, setDifficulty] = useState(1);
    const [imgFile, setImgFile] = useState(null);
    const [existingImgFile, setExistingImgFile] = useState('');
    const [ingredients, setIngredients] = useState([""]);
    const [steps, setSteps] = useState([""]);

    useEffect(() => {
        if (!headerUsername) {
            navigate('/');
        }
    }, [headerUsername, navigate]);    

    useEffect(()=>{
        console.log("useeffect triggered")
        const fetchRecipeById = async () => {
            try{
                const response = await fetch(`${REACT_APP_BACKEND_API_URL}/api/fetch/${recipeId}`, {
                    method: 'GET',
                    credentials: 'include',
                })
                const resData = await response.json();
                console.log(resData);
                setRecipeName(resData.recipeName || '');
                setCuisine(resData.cuisine || '');
                setDifficulty(resData.difficulty || 1);
                setExistingImgFile(resData.imgFile || '');
                setIngredients(resData.ingredients || ['']);
                setSteps(resData.steps || ['']);
            }
            catch(err){
                console.log("Error fetching recipe: ", err);
            }
        }
        fetchRecipeById(recipeId);
    }, [recipeId])

    function handleDifficultyClick(rating){
        setDifficulty(rating);
    }

    function handleIngredientChange(value, index){
        const updatedIngredients = [...ingredients];
        updatedIngredients[index] = value;
        setIngredients(updatedIngredients);
    }

    function handleRemoveIngredient(index){
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(index, 1); //remove 1 element starting at the index aka. remove the desired element
        setIngredients(updatedIngredients);
    }

    function handleAddIngredient(){
        const updatedIngredients = [...ingredients, ""];
        console.log("Updated Ingredients:", updatedIngredients); // Check updated state
        setIngredients(updatedIngredients); //array will now be the same as before but with a new empty string element, therefore it will map another text input for the new empty string element.
    }

    function handleStepChange(value, index){
        const updatedSteps = [...steps];
        updatedSteps[index] = value;
        setSteps(updatedSteps);
    }

    function handleRemoveStep(index){
            const updatedSteps = [...steps];
            updatedSteps.splice(index, 1); //remove 1 element starting at the index aka. remove the desired element
            setSteps(updatedSteps);
    }

    function handleAddStep(){
        const updatedSteps = [...steps, ""];
        console.log("Updated Ingredients:", updatedSteps); // Check updated state
        setSteps(updatedSteps); //array will now be the same as before but with a new empty string element, therefore it will map another textarea for the new empty string element.
    }

    async function handleUpdateRecipe(ev){
        ev.preventDefault()
        if(!recipeName || !cuisine || !difficulty || !ingredients || !steps)
            {
                alert('Please fill in all required fields.');
                return;
            }
        try{
            const filteredIngredients = ingredients.filter((ingredient)=>ingredient !== "");
            const filteredSteps = steps.filter((step)=>step !== "");
            //check fitered ingredients and steps arrays to make sure they arent empty after removing all empty strings
            if (filteredIngredients.length === 0 || filteredSteps.length === 0) {
                alert('Please add at least one meaningful ingredient and one meaningful step.');
                return;
            }

            const formData = new FormData();
            formData.append("recipeName", recipeName);
            formData.append("cuisine", cuisine);
            formData.append("difficulty", difficulty);
            formData.append("ingredients", JSON.stringify(filteredIngredients));
            formData.append("steps", JSON.stringify(filteredSteps));
            if (imgFile) {
                formData.append("imgFile", imgFile); // Append new image only if selected
            }

            const response = await fetch(`${REACT_APP_BACKEND_API_URL}/api/update/${recipeId}`,{
                method: 'PUT',
                credentials: 'include',
                body: formData
            });
            if (response.ok) {
                alert('successful!');
                console.log(response);
                navigate(`/recipe/${recipeId}`);
            } else {
                alert('failed');
            }
        }
        catch(e){
            console.log("Error: ", e);
        }
    }

    return(
        <form className="max-w-xl mt-12 m-auto" onSubmit={(handleUpdateRecipe)}>

            <div className="w-full justify-center items-center py-1 px-1 mb-8 justify-between border-2 rounded bg-gray-100">
                <h2 className="text-center">Recipe Name</h2>
                <input 
                    className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"
                    type="title" 
                    placeholder={recipeName} 
                    value={recipeName}
                    onChange={ev=> setRecipeName(ev.target.value)}/>
            </div>

            <div className="w-full justify-center items-center py-1 px-1 mb-8 justify-between border-2 rounded bg-gray-100">
                <h2 className="text-center">Cuisine</h2>
                <input 
                    className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"
                    type="text" 
                    placeholder={cuisine} 
                    value={cuisine}
                    onChange={ev=> setCuisine(ev.target.value)}/>
            </div>

            <div className="w-full border-2 bg-gray-100 rounded max-w-xl m-auto mb-8">
            <h2 className="text-center">Recipe Difficulty</h2>
                <div className="flex justify-center items-center gap-2">
                    {/*Create 5 different buttons each with a different rating from 1-5*/}
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={rating}
                            type="button"
                            /*set difficulty to the rating of the corresponding button*/
                            onClick={() => handleDifficultyClick(rating)}
                            className="text-3xl"
                        >
                            {/*Change emoji based on difficulty selected. ie: if selecting 2, the first 2 buttons will be chef emojis bc their button rating <=2 */}
                            {rating <= difficulty ? "👨‍🍳" : "👨"}
                        </button>
                    ))}
                </div>
                <p className="text-center">Selected Difficulty: {difficulty}/5</p>
            </div>

        <div className="w-full justify-center items-center py-1 px-1 mb-8 justify-between border-2 rounded bg-gray-100">
        <h2 className="text-center">Upload a New Image</h2>
            {/* Show the existing image if available */}
            {existingImgFile && !imgFile ? (
                <img 
                    src={existingImgFile} 
                    alt="Recipe" 
                    className="w-80 h-80 object-cover rounded border-4 border-gray-500 mx-auto mb-2"/>
            ) : null}
            {/* File upload input for a new image */}
            <input
                type="file"
                className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"
                accept="image/*"
                onChange={ev => setImgFile(ev.target.files[0])}/>
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

        <ul className="max-w-xl m-auto mb-10  border-2 bg-gray-100 rounded">
            <h1 className="text-center">Steps</h1>
            {steps.map((step, index) => (
                <li key={index} className={`${steps.length > 1 ? "flex":""}`}>
                <textarea 
                    className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-3"
                    placeholder={`Step ${index + 1}: `}
                    value={step}
                    onChange={(ev)=>(handleStepChange(ev.target.value, index))}
                />
                {/*only show remove step button if there is more than 1 ingredient*/}
                    {steps.length > 1 &&
                        (<button 
                            className="block px-1 py-1 border-2 text-sm rounded text-white bg-red-500 rounded mb-3"
                            type='button'
                            onClick={()=>(handleRemoveStep(index))} >
                                 Remove
                        </button>)
                    }
                </li>
            ))}
            <button 
                className="block mb-1 w-full py-1 px-2 border-2 rounded bg-gray-600 text-white"
                type='button'
                onClick={handleAddStep} >
                    Add Step
            </button>
        </ul>

        <button 
            className="block mb-15 w-full py-1 px-2 border-2 rounded bg-gray-600 text-white"
            type="submit">
                Update Recipe
        </button>
    </form>

    );
}