import { useState } from "react";

export default function CreateRecipePage(){

    const [ingredients, setIngredients] = useState([]);
    function handleIngredientChange(){
    }

    function handleAddIngredient(){
        
    }

    return(
        <form className="max-w-xl m-auto">
            <input type="title" placeholder={'Recipe Name'} className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"/>
            <input type="summary" placeholder={'Summary of dish'} className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"/>
            <div className="w-full flex items-center py-1 px-1 mb-8 justify-between">
                <label for="file" className="grow-1 whitespace-nowrap">Upload a photo (optional)</label>
                <input type="file" className="grow-1 py-1 px-1"></input>
            </div>
            <ul className="max-w-xl m-auto">
                <h1 className="text-center">Ingredients</h1>
                {ingredients.map((ingredient, index) => (
                    <li key={index}>
                    <input  type="text" 
                    className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"
                    placeholder={`Ingredient ${index + 1}: `}>
                    value={ingredient}
                    onChange={handleIngredientChange}
                    </input>
                    </li>
                ))}

                <button onClick={handleAddIngredient} className="block mb-1 w-full py-1 px-2 border-2 rounded bg-gray-600 text-white">Add Ingredient</button>
            </ul>
        </form>

    );
}