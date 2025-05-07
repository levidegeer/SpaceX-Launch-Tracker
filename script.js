const API_BASE = "https://api.spacexdata.com/v4";

async function fetchData() {
  try {
    const [launchRes, rocketRes, padRes] = await Promise.all([
      fetch(`${API_BASE}/launches/upcoming`),
      fetch(`${API_BASE}/rockets`),
      fetch(`${API_BASE}/launchpads`)
    ]);

    if (!launchRes.ok || !rocketRes.ok || !padRes.ok)
      throw new Error("Failed to fetch API data");

    const launches = await launchRes.json();
    const rockets = await rocketRes.json();
    const launchpads = await padRes.json();

    // Create lookup maps
    const rocketMap = new Map(rockets.map(rocket => [rocket.id, rocket.name]));
    const padMap = new Map(launchpads.map(pad => [pad.id, pad.name]));

    // Sort launches by soonest first
    launches.sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc));

    displayLaunches(launches, rocketMap, padMap);
  } catch (error) {
    document.getElementById("launches").textContent = `Error: ${error.message}`;
  }
}

function displayLaunches(launches, rocketMap, padMap) {
  const container = document.getElementById("launches");
  container.innerHTML = "";

  launches.forEach(launch => {
    const launchCard = document.createElement("div");
    launchCard.className = "launch-card";

    const launchDate = new Date(launch.date_utc).toLocaleString();
    const rocketName = rocketMap.get(launch.rocket) || "Unknown";
    const padName = padMap.get(launch.launchpad) || "Unknown";

    launchCard.innerHTML = `
      <h2>${launch.name}</h2>
      <p><strong>Date:</strong> ${launchDate}</p>
      <p><strong>Rocket:</strong> ${rocketName}</p>
      <p><strong>Launchpad:</strong> ${padName}</p>
    `;

    container.appendChild(launchCard);
  });
}

fetchData();
