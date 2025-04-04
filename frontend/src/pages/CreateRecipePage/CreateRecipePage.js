import { useState } from "react";

export default function CreateRecipePage(){

    const [ingredients, setIngredients] = useState([""]);
    function handleIngredientChange(value, index){
        const updatedIngredients = [...ingredients];
        updatedIngredients[index] = value;
        setIngredients(updatedIngredients);
    }

    function handleRemoveIngredient(index){
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(index, 1);
        setIngredients(updatedIngredients);
    }

    function handleAddIngredient(){
        const updatedIngredients = [...ingredients, ""];
        console.log("Updated Ingredients:", updatedIngredients); // Check updated state
        setIngredients(updatedIngredients);    }

    return(
        <form className="max-w-xl m-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="title" placeholder={'Recipe Name'} className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"/>
            <input type="summary" placeholder={'Summary of dish'} className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"/>
            <div className="w-full flex items-center py-1 px-1 mb-8 justify-between">
                <label for="file" className="grow-1 whitespace-nowrap">Upload a photo (optional)</label>
                <input type="file" className="grow-1 py-1 px-1"></input>
            </div>
            <ul className="max-w-xl m-auto mb-10">
                <h1 className="text-center">Ingredients</h1>
                {ingredients.map((ingredient, index) => (
                    <li key={index}>
                    <input  type="text" 
                    className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"
                    placeholder={`Ingredient ${index + 1}: `}
                    value={ingredient}
                    onChange={(e)=>(handleIngredientChange(e.target.value, index))}
                    />
                    {/*only show remove ingredient button if there is more than 1 ingredient*/}
                    {ingredients.length > 1 &&
                        (<button type='button'
                                 onClick={()=>(handleRemoveIngredient(index))} 
                                 className="px-2 py-1 text-sm text-white bg-red-500 rounded">
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
                <button type='button'
                        className="block mb-15 w-full py-1 px-2 border-2 rounded bg-gray-600 text-white">
                        Create Recipe
                </button>
        </form>

    );
}