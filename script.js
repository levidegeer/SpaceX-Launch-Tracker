const API_URL = "https://api.spacexdata.com/v4/launches/upcoming";

async function fetchLaunches() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");

    const launches = await response.json();

    // Sort by date (soonest first) - optional stretch goal
    launches.sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc));

    displayLaunches(launches);
  } catch (error) {
    document.getElementById("launches").textContent = `Error: ${error.message}`;
  }
}

function displayLaunches(launches) {
  const container = document.getElementById("launches");
  container.innerHTML = ""; // Clear old content

  launches.forEach(launch => {
    const launchCard = document.createElement("div");
    launchCard.className = "launch-card";

    const launchDate = new Date(launch.date_utc).toLocaleString();

    launchCard.innerHTML = `
      <h2>${launch.name}</h2>
      <p><strong>Date:</strong> ${launchDate}</p>
      ${launch.rocket ? `<p><strong>Rocket ID:</strong> ${launch.rocket}</p>` : ""}
      ${launch.launchpad ? `<p><strong>Launchpad ID:</strong> ${launch.launchpad}</p>` : ""}
    `;

    container.appendChild(launchCard);
  });
}

fetchLaunches();
