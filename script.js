(() => {
  const allCheckboxes = document.querySelectorAll("input");
  const checkboxWrapper = document.querySelector(".checkboxes");
  const scoreBoard = document.querySelector(".score");
  const currentScore = document.querySelector(".current");
  const tips = document.querySelector(".tips");
  const timer = document.querySelector(".timer");
  const flagPiece = document.querySelector(".flagPiece");
  const finalTime = document.querySelector(".finalTime");
  const resetButton = document.querySelector(".resetButton");
  const endBoard = document.querySelector(".end");
  const boostWords = [
    "Speed!",
    "Nice!",
    "Fast!",
    "Power!",
    "Great!",
    "Awesome!",
    "Amazing!",
    "Super!",
  ];

  resetButton.addEventListener("click", reset);

  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 50);

  let animationFrame;
  let startTime;

  let currentIndex = 0;

  function startTimer() {
    startTime = Date.now();
    animationFrame = window.requestAnimationFrame(tick);
  }

  function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 10)
        .toString()
        .padStart(2, "0"),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds + ":" + milliseconds;
  }

  function tick() {
    var delta = Date.now() - startTime;
    timer.innerHTML = msToTime(delta);

    animationFrame = window.requestAnimationFrame(tick);
  }

  function randomPosOrNeg(number) {
    const posOrNeg = Math.random() < 0.5 ? -1 : 1;
    return Math.min(Math.random() * number, window.innerHeight - 10) * posOrNeg;
  }

  function reset() {
    allCheckboxes.forEach((checkbox, index) => {
      checkbox.style.transform = "none";
      if (index !== 0) {
        checkbox.disabled = true;
      }
      checkbox.checked = false;
    });

    currentIndex = 0;
    checkboxWrapper.style.transform = `translateX(${-20 * currentIndex}px)`;
    currentScore.innerHTML = 0;
    tips.classList.remove("hide");
    startTime = null;
    scoreBoard.classList.remove("show");
    timer.innerHTML = "00:00:00";
    flagPiece.style.fill = "red";
    endBoard.classList.remove("show");
  }

  function addBoost(element) {
    let verticalMovement = new DOMMatrixReadOnly(
      window.getComputedStyle(element).transform
    ).f;

    const boostElement = document.createElement("div");
    boostElement.classList.add("boost");
    boostElement.style.top = `${
      checkboxWrapper.clientHeight / 2 + verticalMovement - 60
    }px`;
    boostElement.style.left = `${element.offsetLeft}px`;
    boostElement.innerHTML =
      boostWords[Math.floor(Math.random() * boostWords.length)];
    checkboxWrapper.appendChild(boostElement);
  }

  document.body.addEventListener("click", () => {
    if (currentIndex === 0 || currentIndex === allCheckboxes.length) return;

    allCheckboxes[currentIndex].disabled = true;
    allCheckboxes[currentIndex - 1].checked = false;
    allCheckboxes[currentIndex - 1].disabled = false;
    currentIndex--;
    currentScore.innerText = currentIndex.toString().padStart(3, "0");
    checkboxWrapper.style.transform = `translateX(${-20 * currentIndex}px)`;
  });

  allCheckboxes.forEach((checkbox, index) => {
    checkbox.addEventListener("click", (event) => {
      if (!startTime) {
        startTimer();
      }

      if (index === currentIndex) {
        if (currentIndex === 0) {
          tips.classList.add("hide");
          scoreBoard.classList.add("show");
        }

        event.stopPropagation();

        if (Math.random() > 0.6) addBoost(checkbox);

        currentIndex++;
        currentScore.innerText = currentIndex.toString().padStart(3, "0");

        if (currentIndex === allCheckboxes.length) {
          flagPiece.style.fill = "#00c800";
          cancelAnimationFrame(animationFrame);
          scoreBoard.classList.remove("show");

          var delta = Date.now() - startTime;
          finalTime.innerHTML = msToTime(delta);
          endBoard.classList.add("show");
          return;
        }

        allCheckboxes[currentIndex].disabled = false;
        checkboxWrapper.style.transform = `translateX(${-20 * currentIndex}px)`;

        allCheckboxes[
          currentIndex
        ].style.transform = `translateY(${randomPosOrNeg(5 + currentIndex)}px)`;
      } else if (currentIndex === allCheckboxes.length) {
        if (currentIndex === allCheckboxes.length) {
          event.stopPropagation();
          event.preventDefault();
        }
      }
    });
  });
})();
