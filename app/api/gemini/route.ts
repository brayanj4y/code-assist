import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt, context } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 })
    }

    // Prepare the request to Gemini API - using gemini-1.5-flash model
    const url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `You are a helpful coding assistant that specializes in HTML, CSS, and JavaScript. 
              When providing code, always wrap it in markdown code blocks with the appropriate language tag. 
              If you're suggesting changes to the user's code, clearly indicate which parts should be modified 
              and provide the complete updated code. Be concise but thorough in your explanations.
              
              ${context ? context + "\n\n" : ""}
              
              User: ${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }

    // Make the request to Gemini API
    const response = await fetch(`${url}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)
      return NextResponse.json({ error: `Gemini API error: ${JSON.stringify(errorData)}` }, { status: response.status })
    }

    const data = await response.json()

    // Extract the text from the response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response."

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
