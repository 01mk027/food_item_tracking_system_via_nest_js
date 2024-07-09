import { Recipe } from '../recipe/recipe.entity'; // Adjust path as per your project structure

export class CreateMenuViewDto {
    recipes: Recipe[]; // Use Partial<Recipe> to allow optional properties
    number_of_portions: number;
    created_at: string;
}
