import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { ChatPromptTemplate } from "langchain/prompts";
import type { BaseChatModel } from "langchain/chat_models/base";

export const LabelSchema = z.array(
  z.object({
    labelName: z.string(),
    fillX: z.number(),
    fillY: z.number(),
  })
);

export type LabelResult = z.infer<typeof LabelSchema>[number];

const parser = StructuredOutputParser.fromZodSchema(LabelSchema);

const prompt = ChatPromptTemplate.fromTemplate(`
Analyze the provided OCR text and coordinates. Identify every text string that acts as a label for a blank input field.
For each label, calculate the "Fill Coordinate." This coordinate should be the X-value of the label's right-most boundary plus a 15-pixel horizontal offset,
and the Y-value should match the label's baseline. Return a JSON array of objects:
{ labelName: string, fillX: number, fillY: number }.

OCR INPUT:
{input}

{format_instructions}
`);

export async function extractLabelCoordinates(
  llm: BaseChatModel,
  input: string
): Promise<LabelResult[]> {
  const formattedPrompt = await prompt.format({
    input,
    format_instructions: parser.getFormatInstructions(),
  });

  const response = await llm.invoke(formattedPrompt);
  return parser.parse(response.content.toString());
}
