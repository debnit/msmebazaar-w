
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// This is a mock function. In a real-world scenario, you would
// use the CIBIL SDK or make an API call to their service.
async function fetchCibilScore(pan: string): Promise<number> {
  const { CIBIL_API_KEY, CIBIL_API_SECRET } = process.env;

  if (!CIBIL_API_KEY || !CIBIL_API_SECRET) {
    console.warn("CIBIL API keys not found. Using mock data.");
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Return a random score between 600 and 850 for demonstration
    return Math.floor(Math.random() * (850 - 600 + 1) + 600);
  }

  // Example of what a real API call might look like:
  // const cibilApiUrl = 'https://api.cibil.com/v1/credit-score';
  // const response = await fetch(cibilApiUrl, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'x-api-key': CIBIL_API_KEY,
  //     'x-api-secret': CIBIL_API_SECRET,
  //   },
  //   body: JSON.stringify({ pan }),
  // });
  //
  // if (!response.ok) {
  //   const errorData = await response.json();
  //   throw new Error(errorData.message || 'Failed to fetch CIBIL score');
  // }
  //
  // const data = await response.json();
  // return data.score;
  
  // Using mock for now
  await new Promise(resolve => setTimeout(resolve, 1500));
  return Math.floor(Math.random() * (850 - 600 + 1) + 600);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { pan } = body;

    if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      return NextResponse.json(
        { error: "A valid PAN is required" },
        { status: 400 }
      );
    }

    const score = await fetchCibilScore(pan);

    return NextResponse.json({ score }, { status: 200 });
  } catch (error: any) {
    console.error("Credit score API error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the credit score." },
      { status: 500 }
    );
  }
}
