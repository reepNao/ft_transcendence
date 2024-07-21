import { navigateTo } from "../../utils/navTo.js";
import { userDetailUrl, GamePlaySocketUrl } from "../../constants/constants.js";

export let ws;

export async function fetchGame() {
  const canvas = document.getElementById("canvas-pong");
  const ctx = canvas.getContext("2d");
  const game_id = localStorage.getItem("game_id");
  localStorage.removeItem("game_id");

  const response = await fetch(userDetailUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
    }
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  const data = await response.json();
  const user = data[0];

  if (!game_id)
  {
    navigateTo("/");
    return;
  }

  var connection = GamePlaySocketUrl + "?room=" + game_id + "?token=" + localStorage.getItem("access_token");
  ws = new WebSocket(connection);



  ws.onopen = () => {
    console.log("Connected to server");
  }

  function drawPaddles(paddLeft, paddRight, paddLeftUsername, paddRightUsername) {
    ctx.fillStyle = "white";
    ctx.fillRect(paddLeft.positionX, paddLeft.positionY, paddLeft.sizeX, paddLeft.sizeY);

    ctx.fillStyle = "white";
    ctx.fillRect(paddRight.positionX, paddRight.positionY, paddRight.sizeX, paddRight.sizeY);

    ctx.font = '30px Arial';
    ctx.fillText(paddRight.score, 150, 50);
    ctx.fillText(paddRightUsername, 320, 50);

    ctx.fillText(paddLeft.score, canvas.width - 180, 50);
    ctx.fillText(paddLeftUsername, canvas.width - 420, 50);
  }

  function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.positionX, ball.positionY, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }

  ws.onmessage = (message) => {
    let items = JSON.parse(message.data);


    if (items.message === "game_over" && items.winner) {
      ctx.font = '30px Arial';
      ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
      var winner = "Player " + items.winner + " wins!";
      ctx.fillText(winner, canvas.width / 2 - 100, canvas.height / 2 + 50);
      if (items.newGame)
      {
        localStorage.setItem("game_id", items.newGame);
        navigateTo("/game");
      }
      return;
    } else if (items.message === "game_run") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPaddles(items.padd_left, items.padd_right, items.padd_left_username, items.padd_right_username);
      drawBall(items.ball);
    }
  }

  ws.onclose = () => {
    console.log("Disconnected from server");
  }

  ws.onerror = () => {
    console.error("Error connecting to server");
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "w" || event.key === "s") {
      ws.send(keys[event.keyCode]);
    }
  });

  const keys = {
    87: "w",
    83: "s",
  };

}
