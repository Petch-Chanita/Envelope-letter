const envelopeContainer = document.getElementById("envelopeContainer");
const envelope = document.getElementById("envelope");
const envelopeFlap = document.getElementById("envelopeFlap");
const waxSeal = document.getElementById("waxSeal");
const letterPapersContainer = document.getElementById(
  "letterPapersContainer"
);
const letterPaperOverlay = document.getElementById("letterPaperOverlay"); // New overlay for detached paper
const sparkleContainer = document.getElementById("sparkleContainer");
const galaxyContainer = document.getElementById("galaxyContainer"); // Renamed from fireworksContainer
const hintText = document.getElementById("hintText");

let isEnvelopeOpen = false;
let currentLetterIndex = 0;
let activeLetterPaperElement = null; // To keep track of the currently displayed paper
let galaxyAnimationInterval; // Renamed from fireworkInterval

// Array of letter contents
const letterContents = [
  `ถึงเธอคนพิเศษ,\n\nหวังว่าจดหมายฉบับนี้จะทำให้เธอมีความสุขนะ! มีบางอย่างที่อยากจะบอกเธอมานานแล้ว...
  \nทุกครั้งที่คิดถึงเธอ โลกของฉันก็สดใสขึ้นมาทันที เธอคือแสงสว่างในชีวิตของฉันจริงๆ
  \nไม่ว่าวันข้างหน้าจะเป็นอย่างไร ขอให้รู้ไว้ว่าฉันจะอยู่เคียงข้างเธอเสมอ รักนะ!
  \nขอบคุณสำหรับทุกสิ่งทุกอย่างที่ผ่านมา เธอทำให้ฉันเป็นคนที่ดีขึ้นในทุกๆ วัน`,
  `มีอีกหลายเรื่องเลยที่อยากจะเล่าให้เธอฟัง ไว้เรามาเจอกันนะ! คิดถึงเสมอ ❤️`,
];

// Function to create initial hidden letter papers (templates inside envelope)
function createHiddenLetterPapers() {
  letterPapersContainer.innerHTML = ""; // Clear existing papers
  letterContents.forEach((content, index) => {
    const paper = document.createElement("div");
    paper.classList.add("letter-paper-template"); // Use the new template class
    paper.innerHTML = `<p class="whitespace-pre-line">${content}</p>`; // Use pre-line for line breaks
    paper.dataset.index = index; // Store index for navigation
    letterPapersContainer.appendChild(paper);
  });
}

function displayLetterPaper(index) {
  const content = letterContents[index];
  const total = letterContents.length;

  // If an active letter paper already exists, remove its click listener
  if (activeLetterPaperElement) {
    activeLetterPaperElement.removeEventListener("click", showNextLetter);
    // Clear the overlay content to ensure only one paper is active
    letterPaperOverlay.innerHTML = "";
  }

  // Create a new active letter paper element
  activeLetterPaperElement = document.createElement("div");
  activeLetterPaperElement.classList.add("letter-paper-active");
  activeLetterPaperElement.style.position = "relative";

  activeLetterPaperElement.innerHTML = `
    <div id="letterContent" class="whitespace-pre-line flex flex-col justify-center items-center" style="flex:1;"></div>
    <div id="pageNumber" style="text-align:center; font-size: 1rem; color: #666; margin-top: 1.5rem;">
    </div>
  `;

  letterPaperOverlay.appendChild(activeLetterPaperElement);
  letterPaperOverlay.classList.add("active");

  // Add click listener directly to the active letter paper
  activeLetterPaperElement.addEventListener("click", showNextLetter);

  // อัปเดตเนื้อหาและเลขหน้า
  const letterContentDiv =
    activeLetterPaperElement.querySelector("#letterContent");
  const pageNumberDiv =
    activeLetterPaperElement.querySelector("#pageNumber");

  letterContentDiv.textContent = content;
  pageNumberDiv.textContent = `หน้า ${index + 1} / ${total}`;

  // Update hint text based on whether there are more pages
  if (letterContents.length > 1 && index < letterContents.length - 1) {
    hintText.textContent = "คลิกที่กระดาษเพื่ออ่านแผ่นถัดไป";
  } else {
    hintText.textContent = "อ่านจบแล้ว! คลิกที่กระดาษเพื่ออ่านซ้ำ หรือคลิกนอกกระดาษเพื่อปิด 😊";
  }
  hintText.classList.remove("hidden");
}

// Function to show the next letter in the sequence
function showNextLetter() {
  // If it's the last letter, loop back to the first letter (index 0)
  if (currentLetterIndex === letterContents.length - 1) {
    currentLetterIndex = 0; // Reset to the first letter
    displayLetterPaper(currentLetterIndex);
  } else {
    currentLetterIndex = (currentLetterIndex + 1) % letterContents.length; // Move to the next letter
    displayLetterPaper(currentLetterIndex);
  }
}

// คลิกที่ overlay (แต่ไม่ใช่บนกระดาษ) → กลับไปหน้าแรก
letterPaperOverlay.addEventListener("click", (event) => {
  // Only reset if the click target is the overlay itself, not its children
  if (event.target === letterPaperOverlay) {
    resetApp();
  }
});

// Function to generate sparkles (for when the envelope opens)
function generateSparkles(count = 10) {
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");
    const size = Math.random() * 12 + 6; // Random size between 6px and 18px
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.animationDelay = `${Math.random() * 0.8}s`; // Stagger animation more
    sparkleContainer.appendChild(sparkle);

    // Remove sparkle after animation to prevent DOM bloat
    sparkle.addEventListener("animationend", () => {
      sparkle.remove();
    });
  }
}

// Function to create a single galaxy star
function createGalaxyStar() {
  const star = document.createElement("div");
  star.classList.add("galaxy-star");

  const size = Math.random() * 3 + 1; // Star size between 1px and 4px
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;

  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;

  // Randomize animation duration for more natural twinkling
  const duration = Math.random() * 2 + 1; // Duration between 1s and 3s
  star.style.setProperty('--duration', `${duration}s`);

  // Randomize animation delay to stagger appearance
  star.style.animationDelay = `${Math.random() * 2}s`;

  galaxyContainer.appendChild(star);

  // Remove star after a longer period to prevent too many elements
  // The animation itself handles fading, so we remove after a few cycles
  setTimeout(() => {
    star.remove();
  }, duration * 3 * 1000); // Remove after 3 animation cycles
}

// Function to start the continuous galaxy animation
function startGalaxyAnimation() {
  // Clear any existing interval first to prevent duplicates
  if (galaxyAnimationInterval) {
    clearInterval(galaxyAnimationInterval);
  }
  // Continuously create new stars
  galaxyAnimationInterval = setInterval(createGalaxyStar, 100); // Create a new star every 100ms
}

// Function to stop the continuous galaxy animation
function stopGalaxyAnimation() {
  if (galaxyAnimationInterval) {
    clearInterval(galaxyAnimationInterval);
    galaxyAnimationInterval = null;
  }
  // Clear all existing star elements
  galaxyContainer.innerHTML = "";
}

// Function to reset the application to its initial state
function resetApp() {
  // Reset envelope state
  envelope.classList.remove("open");
  envelopeContainer.classList.remove("open-state");
  isEnvelopeOpen = false;

  // Hide and clear the active letter paper from overlay
  letterPaperOverlay.classList.remove("active");
  if (activeLetterPaperElement) {
    activeLetterPaperElement.removeEventListener("click", showNextLetter);
    activeLetterPaperElement = null; // Clear reference
  }
  // Clear the overlay content directly after transition
  setTimeout(() => {
    letterPaperOverlay.innerHTML = "";
  }, 700); // Match letter-paper-active transition duration

  // Reset letter papers (templates)
  currentLetterIndex = 0;
  createHiddenLetterPapers(); // Re-creates hidden templates

  // Clear sparkles and restart galaxy animation
  sparkleContainer.innerHTML = "";
  startGalaxyAnimation(); // Restart galaxy animation for the initial state

  // Reset hint text
  hintText.textContent = "คลิกที่ซองจดหมายเพื่อเปิด";
  hintText.classList.remove("hidden"); // Ensure hint is visible again
}

// Event listener for opening the envelope
envelopeContainer.addEventListener("click", () => {
  if (!isEnvelopeOpen) {
    envelope.classList.add("open");
    envelopeContainer.classList.add("open-state"); // Add state class to prevent hover effect
    isEnvelopeOpen = true;
    generateSparkles(50); // Generate more sparkles on open
    stopGalaxyAnimation(); // Stop galaxy animation when opening the envelope

    // Hide initial hint
    hintText.classList.add("hidden");

    // After envelope animation, display the first paper
    setTimeout(() => {
      displayLetterPaper(currentLetterIndex);
    }, 1000); // Delay to match envelope opening animation
  }
});

// Initialize hidden letter paper templates and start initial galaxy animation when the page loads
document.addEventListener("DOMContentLoaded", () => {
  createHiddenLetterPapers();
  startGalaxyAnimation(); // Start galaxy animation on initial load
});
