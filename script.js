/* ============================================================
   CALCULATOR - script.js
   Handles button clicks, keyboard input, the display,
   and doing the actual math safely.
   ============================================================ */

/* ====== 1. GRAB THE ELEMENTS WE NEED ====== */
const display = document.getElementById("display");
// Select ALL buttons (returns a list we can loop over)
const buttons = document.querySelectorAll(".btn");

/* ====== 2. STORE WHAT THE USER IS TYPING ====== */
// "expression" is the full sum as text, e.g. "12+5*2"
let expression = "";

/* ====== 3. UPDATE THE DISPLAY SCREEN ====== */
function updateDisplay() {
  // If empty, show 0; otherwise show the expression
  display.textContent = expression === "" ? "0" : expression;
}

/* ====== 4. HANDLE A BUTTON ACTION ====== */
// This runs for both clicks and keyboard presses
function handleInput(action) {

  if (action === "clear") {
    // Erase everything
    expression = "";

  } else if (action === "delete") {
    // Remove the last character
    expression = expression.slice(0, -1);

  } else if (action === "=") {
    // Calculate the result
    calculate();
    return; // calculate() already updates the display

  } else {
    // Otherwise it's a number, dot, or operator: add it on
    expression += action;
  }

  updateDisplay();
}

/* ====== 5. DO THE MATH SAFELY ====== */
function calculate() {
  try {
    // Only allow numbers, operators, dots, and spaces (safety check)
    if (!/^[0-9+\-*/.\s]+$/.test(expression)) {
      display.textContent = "Error";
      expression = "";
      return;
    }

    // The Function constructor evaluates the math expression.
    // We checked above that only safe characters are present.
    const result = new Function("return " + expression)();

    // Round long decimals to keep the display tidy
    expression = String(Math.round(result * 1000000) / 1000000);
    updateDisplay();

  } catch (error) {
    // If the sum is invalid (e.g. "5++"), show Error
    display.textContent = "Error";
    expression = "";
  }
}

/* ====== 6. CONNECT THE BUTTONS ====== */
// Loop through every button and listen for a click
buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Read the data-action attribute we set in the HTML
    handleInput(button.dataset.action);
  });
});

/* ====== 7. KEYBOARD SUPPORT ====== */
// Listen for any key press on the page
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (key >= "0" && key <= "9") {
    handleInput(key);              // number keys
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    handleInput(key);              // operator keys
  } else if (key === ".") {
    handleInput(".");              // decimal point
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();        // stop Enter from doing anything else
    handleInput("=");              // equals
  } else if (key === "Backspace") {
    handleInput("delete");         // delete last character
  } else if (key === "Escape") {
    handleInput("clear");          // clear everything
  }
});

/* ====== 8. SHOW 0 WHEN PAGE FIRST LOADS ====== */
updateDisplay();
