export type MachineGroupData = {
    id: string;
    blueprint: string;
    blocks: RegistryTypes.Item[];
    cost: Record<RegistryTypes.Item, number>;
};

export type MachineBlueprint = {
    id: string,
}

declare namespace global {
    const MACHINE_GROUPS: MachineGroupData[];
    const BLUEPRINTS: MachineBlueprint[]
}

declare module "@package/net/minecraft/world/item" {
    declare type $ItemStack_ =
        | $ItemStack
        | RegistryTypes.Item
        | {
            id: RegistryTypes.Item;
            count?: number;
        };
}

declare module "@package/net/neoforged/neoforge/fluids" {
    declare type $FluidStack_ =
        | $FluidStack
        | RegistryTypes.Fluid
        | "-"
        | {
            fluid: RegistryTypes.Fluid;
            amount?: number;
        };
}

declare module "@package/com/simibubi/create/content/processing/recipe" {
    import type { $ItemStack_ } from "@package/net/minecraft/world/item";

    declare type $ProcessingOutput =
        | typeof CreateItem
        | $ItemStack_
        | RegistryTypes.Item;
}

declare module "@package/net/minecraft/world/item/crafting" {
    import type { $ItemStack_ } from "@package/net/minecraft/world/item";

    declare type $Ingredient_ =
        | $Ingredient
        | $ItemStack_
        | $Ingredient_[]
        | RegExp
        | { tag: RegistryTypes.ItemTag; count?: number }
        | { item: RegistryTypes.Item; count?: number }
        | "*"
        | "-"
        | `#${RegistryTypes.ItemTag}`
        | `@${SpecialTypes.ModId}`
        | `%${RegistryTypes.CreativeModeTab}`
        | `${RegistryTypes.Item}[${string}]`;
}

declare module "@package/net/neoforged/neoforge/fluids/crafting" {
    declare type $SizedFluidIngredient =
        | $FluidStack
        | {
            fluid: RegistryTypes.Fluid;
            amount?: number;
        };
}

declare module "@package/dev/latvian/mods/kubejs/recipe/filter" {
    export type $RecipeFilter_ =
        | RegExp
        | "*"
        | "-"
        | $RecipeFilter[]
        | {
            or?: $RecipeFilter_[];
            not?: $RecipeFilter_;
            id?: SpecialTypes.RecipeId | RegExp;
            type?: RegistryTypes.RecipeSerializer;
            group?: string;
            mod?: SpecialTypes.ModId;
            input?: $Ingredient_;
            output?: $ItemStack_;
        }
        | ((cx: $RecipeMatchContext) => boolean);
}

declare module "@package/java/lang" {
    declare type $Object = unknown;
}

declare module "@package/net/minecraft/world/item/crafting" {
    import type { $Set } from "@package/java/util";

    export interface $Ingredient {
        getItemIds(): $Set<RegistryTypes.Item>;
        get itemIds(): $Set<RegistryTypes.Item>;
    }
}

declare module "@special/types" {
    export namespace RegistryTypes {
        type Item = `${string}:${string}`;
        type ItemTag = `${string}:${string}`;
        type Block = `${string}:${string}`;
    }
}

declare module "@package/com/google/gson" {
    export type $JsonElement_ =
        | $JsonObject
        | $JsonArray
        | $JsonPrimitive
        | Record<string, $JsonElement_>
        | $JsonElement_[]
        | string
        | number
        | boolean
        | null;
}

declare module "@package/net/minecraft/network/chat" {
    export type $Component_ =
        | $Component
        | string
        | {
            text?: string;
            translate?: SpecialTypes.TranslationKey;
            with?: any[];
            color?: $KubeColor_;
            bold?: boolean;
            italic?: boolean;
            underlined?: boolean;
            strikethrough?: boolean;
            obfuscated?: boolean;
            insertion?: string;
            font?: string;
            click?: $ClickEvent_;
            hover?: $Component_;
            extra?: $Component_[];
        }
        | $Component_[];
}

interface ObjectConstructor {
    keys<K, V>(o: Record<K, V>): K[];
    keys(o: object): string[];
}

declare module "@package/net/minecraft/core" {
    export type $BlockPos_ = $BlockPos | [x: number, y: number, z: number];
}