import { Users } from "../users/user.entity";

interface CustomItemType {
    item_id: number;
    item_name: string;
    quantityPerPortion: number;
    unitPerPortion: string;
}



export class UpdateRecipeDto{
    cook_name: string;
    items: CustomItemType[];
    user: Users;
    description: string;
    updated_at: string;
}