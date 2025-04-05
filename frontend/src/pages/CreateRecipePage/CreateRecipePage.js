import { useState } from "react";

export default function CreateRecipePage(){

    const [difficulty, setDifficulty] = useState(1);
    const [ingredients, setIngredients] = useState([""]);
    const [steps, setSteps] = useState([""]);

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

    return(
        <form className="max-w-xl m-auto" onSubmit={(e) => e.preventDefault()}>

            <div className="w-full justify-center items-center py-1 px-1 mb-8 justify-between border-2 rounded bg-gray-100">
                <h2 className="text-center">Recipe Name</h2>
                <input type="title" placeholder={'Recipe Name'} className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"/>
            </div>

            <div className="w-full justify-center items-center py-1 px-1 mb-8 justify-between border-2 rounded bg-gray-100">
                <h2 className="text-center">Cuisine</h2>
                <input type="text" placeholder={'Type of Cuisine'} className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"/>
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
            <h2 className="text-center">Upload a Photo</h2>
            <input type="file" className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"/>
        </div>

        <ul className="max-w-xl m-auto mb-10 border-2 bg-gray-100 rounded">
            <h1 className="text-center">Ingredients</h1>
            {ingredients.map((ingredient, index) => (
                <li key={index} className={`${ingredients.length > 1 ? "flex":""}`}>
                <input  type="text" 
                    className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-3"
                    placeholder={`Ingredient ${index + 1}: `}
                    value={ingredient}
                    onChange={(e)=>(handleIngredientChange(e.target.value, index))}
                />
                {/*only show remove ingredient button if there is more than 1 ingredient*/}
                    {ingredients.length > 1 &&
                        (<button type='button'
                                 onClick={()=>(handleRemoveIngredient(index))} 
                                 className="block px-1 py-1 border-2 text-sm rounded text-white bg-red-500 rounded mb-3">
                                 Remove
                        </button>)
                    }
                </li>
            ))}
            <button type='button'
                    onClick={handleAddIngredient} 
                    className="block mb-1 w-full py-1 px-2 border-2 rounded bg-gray-600 text-white">
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
                    onChange={(e)=>(handleStepChange(e.target.value, index))}
                />
                {/*only show remove step button if there is more than 1 ingredient*/}
                    {steps.length > 1 &&
                        (<button type='button'
                                 onClick={()=>(handleRemoveStep(index))} 
                                 className="block px-1 py-1 border-2 text-sm rounded text-white bg-red-500 rounded mb-3">
                                 Remove
                        </button>)
                    }
                </li>
            ))}
            <button type='button'
                    onClick={handleAddStep} 
                    className="block mb-1 w-full py-1 px-2 border-2 rounded bg-gray-600 text-white">
                    Add Step
            </button>
        </ul>

        <button type='button'
            className="block mb-15 w-full py-1 px-2 border-2 rounded bg-gray-600 text-white">
            Create Recipe
        </button>
    </form>

    );
}