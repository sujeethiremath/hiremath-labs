import { NextResponse } from "next/server";
import { admin, db } from "../../lib/firebase-admin-init";

/**
 * Handles the GET request to fetch and cache GitHub user statistics.
 * The data is stored in Firestore and cached for 30 days.
 */
export async function GET(req: Request) {
  const username = "hiremath09"; // User's GitHub username
  const githubStatsRef = db.collection("github-stats").doc(username);

  try {
    const doc = await githubStatsRef.get();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Check if data exists and is less than a month old
    if (doc.exists && doc.data()?.timestamp.toDate() > thirtyDaysAgo) {
      console.log("Serving cached GitHub data from Firestore.");
      return NextResponse.json(doc.data());
    }

    console.log("Fetching new data from GitHub API and updating cache.");

    // 1. Fetch User Profile
    const profileResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Hiremath-Labs-Portfolio"
      }
    });

    if (!profileResponse.ok) {
      throw new Error(`GitHub Profile API responded with status: ${profileResponse.status}`);
    }

    const profileData = await profileResponse.json();

    // 2. Fetch Public Repositories (up to 100)
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Hiremath-Labs-Portfolio"
      }
    });

    if (!reposResponse.ok) {
      throw new Error(`GitHub Repos API responded with status: ${reposResponse.status}`);
    }

    const reposData = await reposResponse.json();

    // 3. Process Repository Metrics & Languages
    let totalStars = 0;
    let totalForks = 0;
    const languageCounts: Record<string, number> = {};
    const topRepos: Array<{ name: string; stars: number; forks: number; language: string; url: string }> = [];

    if (Array.isArray(reposData)) {
      reposData.forEach((repo: any) => {
        if (repo.fork) return; // Skip forks for authentic stats

        totalStars += repo.stargazers_count;
        totalForks += repo.forks_count;

        if (repo.language) {
          languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
        }

        topRepos.push({
          name: repo.name,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language || "Unknown",
          url: repo.html_url
        });
      });
    }

    // Sort languages by count descending
    const languages = Object.entries(languageCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Sort repos by stars + forks descending, slice top 3
    topRepos.sort((a, b) => (b.stars + b.forks) - (a.stars + a.forks));
    const finalTopRepos = topRepos.slice(0, 3);

    const dataToStore = {
      profile: {
        login: profileData.login,
        avatarUrl: profileData.avatar_url,
        followers: profileData.followers,
        publicRepos: profileData.public_repos,
        name: profileData.name || profileData.login
      },
      stats: {
        totalStars,
        totalForks,
        languages,
        topRepos: finalTopRepos
      },
      timestamp: admin.firestore.Timestamp.now(),
    };

    // Save the new data to Firestore
    await githubStatsRef.set(dataToStore);

    return NextResponse.json(dataToStore);
  } catch (error) {
    console.error("Failed to fetch GitHub data:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
