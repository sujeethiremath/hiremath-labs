import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import * as firestore from "firebase-admin/firestore";
import "../../lib/firebase-admin-init"; // Ensure Firebase Admin SDK is initialized

/**
 * Handles the GET request to fetch and cache LeetCode user data.
 * The data is stored in Firestore and only refreshed once a month.
 */
export async function GET(req: Request) {
  const username = "hiremath09"; // User's LeetCode username
  const db = getFirestore();
  const leetcodeStatsRef = db.collection("leetcode-stats").doc(username);

  try {
    const doc = await leetcodeStatsRef.get();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Check if data exists and is less than a month old
    if (doc.exists && doc.data()?.timestamp.toDate() > thirtyDaysAgo) {
      console.log("Serving cached data from Firestore.");
      return NextResponse.json(doc.data());
    }

    console.log("Fetching new data from LeetCode and updating cache.");

    // LeetCode GraphQL endpoint
    const LEETCODE_API_URL = "https://leetcode.com/graphql";

    // GraphQL query to get user's solved problem counts and skill stats
    const graphqlQuery = {
      query: `
        query userProfile($username: String!) {
          allQuestionsCount {
            difficulty
            count
          }
          matchedUser(username: $username) {
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
            tagProblemCounts {
              advanced {
                tagName
                problemsSolved
              }
              intermediate {
                tagName
                problemsSolved
              }
              fundamental {
                tagName
                problemsSolved
              }
            }
          }
        }
      `,
      variables: {
        username: username,
      },
    };

    const response = await fetch(LEETCODE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    });

    const leetcodeData = await response.json();

    if (leetcodeData.errors) {
      throw new Error(leetcodeData.errors[0].message);
    }

    const { allQuestionsCount, matchedUser } = leetcodeData.data;

    // Process and combine data for storage
    const solvedCounts = matchedUser.submitStatsGlobal.acSubmissionNum;
    const allCounts = allQuestionsCount;
    const skillStats = [
      ...matchedUser.tagProblemCounts.advanced,
      ...matchedUser.tagProblemCounts.intermediate,
      ...matchedUser.tagProblemCounts.fundamental,
    ];

    const dataToStore = {
      solvedCounts,
      allCounts,
      skillStats,
      timestamp: firestore.Timestamp.now(),
    };

    // Save the new data to Firestore
    await leetcodeStatsRef.set(dataToStore);

    return NextResponse.json(dataToStore);
  } catch (error) {
    console.error("Failed to fetch LeetCode data:", error);
    return NextResponse.json(
      { error: "Failed to fetch LeetCode data" },
      { status: 500 }
    );
  }
}
