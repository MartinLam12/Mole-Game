// Constants for different time intervals (in milliseconds)
const MIN_INTERVAL = 2000;
const MAX_INTERVAL = 20000;
const SAD_INTERVAL = 500;
const HUNGRY_INTERVAL = 2000;

// Select the worm progress bar container
const wormContainer = document.querySelector(".worm-container");

// Initialize score
let score = 0;

// Get a random time in the future for when a mole should do its next action
const getInterval = () => Date.now() + MIN_INTERVAL + Math.floor(Math.random() * MAX_INTERVAL);

// Get a short time in the future for sad or fed moles
const getSadInterval = () => Date.now() + SAD_INTERVAL;

// Random chance to determine if mole is a king mole (10% chance)
const getKingStatus = () => Math.random() > 0.9;

// Get a short time in the future for how long the mole stays hungry
const getHungryInterval = () => Date.now() + HUNGRY_INTERVAL;

// Create an array of 10 mole objects, each with initial "sad" status
const moles = [
  {
    status: "sad",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-0")
  },
  {
    status: "sad",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-1")
  },
  {
    status: "sad",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-2")
  },
  {
    status: "sad",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-3")
  },
  {
    status: "sad",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-4")
  },
  {
    status: "sad",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-5")
  },
  {
    status: "sad",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-6")
  },
  {
    status: "sad",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-7")
  },
  {
    status: "sad",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-8")
  },
  {
    status: "sad",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-9")
  }
];

// Determines what happens next to a mole based on its current status
const getNextStatus = mole => {
  switch (mole.status) {
    case "sad":
    case "fed":
      // Mole changes to "leaving" after being sad or fed
      mole.next = getSadInterval(); // short delay before leaving
      if (mole.king) {
        mole.node.children[0].src = "./king-mole-leaving.png";
      } else {
        mole.node.children[0].src = "./mole-leaving.png";
      }
      mole.status = "leaving";
      break;

    case "leaving":
      // Mole disappears from the hole
      mole.next = getInterval(); // wait until it comes back again
      mole.king = false; // reset king status
      mole.node.children[0].classList.toggle("gone", true); // hide mole visually
      mole.status = "gone"; // mark mole as gone
      break;

    case "hungry":
      // Mole wasn't fed in time, becomes sad
      mole.node.children[0].classList.toggle("hungry", false); // remove hungry appearance
      if (mole.king) {
        mole.node.children[0].src = "./king-mole-sad.png";
      } else {
        mole.node.children[0].src = "./mole-sad.png";
      }
      mole.status = "sad";
      mole.next = getSadInterval(); // show sad mole for a short time
      break;

    case "gone":
      // Mole reappears in a hungry state
      mole.status = "hungry";
      mole.king = getKingStatus(); // maybe it's a king mole now
      mole.next = getHungryInterval(); // how long it stays hungry
      mole.node.children[0].classList.toggle("hungry", true); // visually mark as hungry
      mole.node.children[0].classList.toggle("gone", false); // make mole visible again
      if (mole.king) {
        mole.node.children[0].src = "./king-mole-hungry.png";
      } else {
        mole.node.children[0].src = "./mole-hungry.png";
      }
      break;
  }
};

// Function that runs when the player clicks to feed a mole
const feed = e => {
  // Only respond if a hungry mole image is clicked
  if (e.target.tagName !== "IMG" || !e.target.classList.contains("hungry")) {
    return;
  }

  // Get the correct mole object using its index
  const mole = moles[+e.target.dataset.index];

  // Mark mole as fed and update its image
  mole.status = "fed";
  mole.next = getSadInterval(); // short delay before leaving
  mole.node.children[0].classList.toggle("hungry", false); // remove hungry class
  if (mole.king) {
    mole.node.children[0].src = "./king-mole-fed.png"; // changes image to happy
    score += 20; // king moles give 20 points
  } else {
    mole.node.children[0].src = "./mole-fed.png"; // changes image to happy
    score += 10; // regular moles give 10 points
  }

  // Check if player has won
  if (score >= 100) {
    win();
    return;
  }

  // Update worm progress bar with new score
  wormContainer.style.width = `${score}%`;
};

// Display win screen and hide game background
const win = () => {
  document.querySelector(".bg").classList.toggle("hide", true);
  document.querySelector(".win").classList.toggle("show", true);
};

// Listen for clicks on the game background and call feed() when clicked
document.querySelector(".bg").addEventListener("click", feed);

// Game loop — checks every animation frame if any mole needs to update its status
const nextFrame = () => {
  const now = Date.now();
  for (let i = 0; i < moles.length; i++) {
    if (moles[i].next < now) {
      getNextStatus(moles[i]); // update mole if its time has come
    }
  }
  requestAnimationFrame(nextFrame); // repeat on next animation frame
};

// Start the game loop
requestAnimationFrame(nextFrame);