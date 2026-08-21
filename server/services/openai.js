const OpenAI = require('openai');
const { zodTextFormat } = require('openai/helpers/zod');
const { z } = require('zod');

const client = new OpenAI();

const macroField = z.number().nullable();

const parsedItemSchema = z.object({
    description: z.string(),
    quantity: z.number().nullable(),
    unit: z.string().nullable(),
    calories: macroField,
    protein_g: macroField,
    carbs_g: macroField,
    fat_g: macroField,
});

const parsedMealSchema = z.object({
    description: z.string(),
    meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).nullable(),
    calories: macroField,
    protein_g: macroField,
    carbs_g: macroField,
    fat_g: macroField,
    items: z.array(parsedItemSchema),
});

async function parseMealText(text) {
    const response = await client.responses.parse({
        model: 'gpt-5.6-luna',
        input: [
            {
                role: 'system',
                content: `You extract structured meal nutrition data from freeform text describing food someone ate.
                    Break the meal into its component items, and estimate calories and macros (protein_g, carbs_g, fat_g)
                    per item and as totals for the whole meal when they are not stated explicitly. 
                    You may create an other_ingredients item to capture remaining nutrition from ingredients or components not otherwise represented by the main meal items. 
                    Only use null for a value when you truly cannot produce a reasonable estimate.`
            },
            {
                role: 'user',
                content: text
            }                        
        ],
        text: {
            format: zodTextFormat(parsedMealSchema, 'meal_parse'),
        }
    });

    if (response.output_parsed === null) {
        throw new Error('Model refused or failed to produce structured output');
    }

    return response.output_parsed;
}

module.exports = { parseMealText };