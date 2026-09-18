import { PDFParse } from "pdf-parse";

export async function extractPdfText(url: string): Promise<string> {
  const parser = new PDFParse({
    url,
  });

  try {
    const result = await parser.getText();

    return result.text.trim();
  } finally {
    await parser.destroy();
  }
}