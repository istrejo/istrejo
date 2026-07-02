import fs from "node:fs/promises";

const username = process.env.GITHUB_USERNAME || "istrejo";
const token = process.env.GITHUB_TOKEN;
const maxReposPerSection = Number(process.env.MAX_REPOS_PER_SECTION || 6);
const readmePath = "README.md";

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "profile-readme-updater",
};

if (token) {
  headers.Authorization = `Bearer ${token}`;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${body}`);
  }

  return response.json();
}

async function searchRepositoriesByTopic(topic) {
  const url = new URL("https://api.github.com/search/repositories");

  url.searchParams.set("q", `user:${username} topic:${topic} archived:false fork:false`);
  url.searchParams.set("sort", "updated");
  url.searchParams.set("order", "desc");
  url.searchParams.set("per_page", String(maxReposPerSection));

  const data = await fetchJson(url);
  return data.items ?? [];
}

function escapeMarkdown(value = "") {
  return value.replace(/\|/g, "\\|");
}

function formatUpdatedDate(value) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
  }).format(new Date(value));
}

function formatRepository(repo) {
  const description = repo.description || "No description yet.";
  const language = repo.language ? ` · ${repo.language}` : "";
  const updated = ` · Updated ${formatUpdatedDate(repo.updated_at)}`;
  const liveUrl = repo.homepage ? ` · [Live](${repo.homepage})` : "";

  return `- [${repo.name}](${repo.html_url}) — ${escapeMarkdown(description)}${language}${updated}${liveUrl}`;
}

function formatSection(title, repositories, emptyText) {
  if (!repositories.length) {
    return `### ${title}\n\n${emptyText}`;
  }

  return `### ${title}\n\n${repositories.map(formatRepository).join("\n")}`;
}

async function main() {
  const [featuredRepositories, openSourceRepositories] = await Promise.all([
    searchRepositoriesByTopic("featured"),
    searchRepositoriesByTopic("open-source"),
  ]);

  const dynamicContent = [
    "<!-- FEATURED_REPOS:START -->",
    "<!-- This section is automatically generated. Tag repositories with `featured` or `open-source` to make them appear here. -->",
    formatSection(
      "Featured projects",
      featuredRepositories,
      "_No repositories tagged with `featured` yet._",
    ),
    "",
    formatSection(
      "Open source / resources",
      openSourceRepositories,
      "_No repositories tagged with `open-source` yet._",
    ),
    "<!-- FEATURED_REPOS:END -->",
  ].join("\n");

  const readme = await fs.readFile(readmePath, "utf8");

  const updatedReadme = readme.replace(
    /<!-- FEATURED_REPOS:START -->[\s\S]*?<!-- FEATURED_REPOS:END -->/,
    dynamicContent,
  );

  if (updatedReadme === readme) {
    console.log("README is already up to date.");
    return;
  }

  await fs.writeFile(readmePath, updatedReadme);
  console.log(
    `Updated README with ${featuredRepositories.length} featured repositories and ${openSourceRepositories.length} open source repositories.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});