var c = document.getElementById("board");
var ctx = c.getContext("2d");
var width = 600;
var height = 600;
var radius = 14;
var blank = 12;
var turn = 1; // 1 black 2 white 3 gray 턴이 바뀔때마다 1은 흑돌 2는 백돌 3은 회돌로 돌아가며 수를 둔다.

var boardArray = new Array(19); 
for (var i = 0; i < 19; i++) {
    boardArray[i] = new Array(19);
    for (j = 0; j < 19; j++) { 
		boardArray[i][j] = 0;
	}
}

function updateBoard(){
	// board fill color
	ctx.fillStyle="#ffcc66";
	ctx.fillRect(0, 0, width, height);

	// board draw line
	ctx.strokeStyle="#333300";
	ctx.fillStyle="#333300";
	for (i = 0; i < 19; i++) { 
		// horizontal line draw
		ctx.beginPath();
		ctx.moveTo(blank + i * 32, blank);
		ctx.lineTo(blank + i * 32, height - blank);
		ctx.stroke();

		// vertical line draw
		ctx.beginPath();
		ctx.moveTo(blank, blank + i * 32);
		ctx.lineTo(height - blank, blank + i * 32);
		ctx.stroke();
	}

	// board draw point
	var circleRadius = 3;
	for (i = 0; i < 3; i++) { 
		for (j = 0; j < 3; j++) { 
			// board circle draw
			ctx.beginPath();
			ctx.arc(blank + 3 * 32 + i * 6 * 32, blank + 3 * 32  + j * 6 * 32, circleRadius, 0, 2*Math.PI);
			ctx.fill();
			ctx.stroke();
		}
	}

	// board draw clicked 보드를 클릭했을때 어떻게 표시할지 그리고 배열에 몇을 저장할지 정해주는 반복문
	for (i = 0; i < 19; i++) { 
		for (j = 0; j < 19; j++) {
			if (boardArray[i][j] == 1) {
				ctx.beginPath();
				ctx.strokeStyle="#000000";
				ctx.fillStyle="#000000";
				ctx.arc(blank + i * 32, blank + j * 32, radius, 0, 2*Math.PI);
				ctx.fill();
				ctx.stroke();
			} else if (boardArray[i][j] == 2){
				ctx.beginPath();
				ctx.strokeStyle="#ffffff";
				ctx.fillStyle="#ffffff";
				ctx.arc(blank + i * 32, blank + j * 32, radius, 0, 2*Math.PI);
				ctx.fill();
				ctx.stroke();
			} else if (boardArray[i][j] == 3){
				ctx.beginPath();
				ctx.strokeStyle="#888888";
				ctx.fillStyle="#888888";
				ctx.arc(blank + i * 32, blank + j * 32, radius, 0, 2*Math.PI);
				ctx.fill();
				ctx.stroke();
			}
		}
	}


}

updateBoard();

/* Mouse Event */
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
}

function getMouseRoundPos(xPos, yPos){
	var x = (xPos - blank) / 32;
	var resultX = Math.round(x);
	var y = (yPos - blank) / 32;
	var resultY = Math.round(y);

	return {
		x: resultX,
		y: resultY
	};
}

c.addEventListener('mousemove', function(evt) {
	var mousePos = getMousePos(c, evt);
	drawNotClicked(mousePos.x, mousePos.y);
}, false);

c.addEventListener('mousedown', function(evt) {
	var mousePos = getMousePos(c, evt);
	isClicked(mousePos.x, mousePos.y);
}, false);

function drawNotClicked(xPos, yPos){ // 마우스 클릭을 하기전에 마우스 포인터를 가져다 놓으면 놓을 돌의 색상을 흐릿하게 보여줌
	resultPos = getMouseRoundPos(xPos, yPos);

	if (resultPos.x > -1 && resultPos.x < 19 && resultPos.y > -1
	 && resultPos.y < 19 && boardArray[resultPos.x][resultPos.y] == 0){
		updateBoard();
		ctx.beginPath();
		ctx.globalAlpha=0.8;
		if (turn == 1) {
			ctx.strokeStyle="#000000";
			ctx.fillStyle="#000000";
		} else if (turn == 2){
			ctx.strokeStyle="#ffffff";
			ctx.fillStyle="#ffffff";	
		} else if (turn == 3){
			ctx.strokeStyle="#888888";
			ctx.fillStyle="#888888";	
		}
		ctx.arc(blank + resultPos.x * 32, blank + resultPos.y * 32, radius, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.globalAlpha=1;
	}
};

function isClicked(xPos, yPos){ // 클릭했을때 턴을 변경해주는 함수
	resultPos = getMouseRoundPos(xPos, yPos);
	if (resultPos.x > -1 && resultPos.x < 19 && resultPos.y > -1
	 && resultPos.y < 19 && boardArray[resultPos.x][resultPos.y] == 0){
		boardArray[resultPos.x][resultPos.y] = turn;
		checkOmok(turn, resultPos.x, resultPos.y);
		if (turn == 1) turn = 2;
		else if (turn == 2) turn = 3;
		else if (turn == 3) turn = 1; //turn change
	}
	updateBoard();
}

/* is Omok?? */
function checkOmok(turn, xPos, yPos){ //오목인지 체크해준다. 배열을 체크해 같은 돌의 색을 체크한다.
	if (addOmok(turn, xPos, yPos, -1, -1) + addOmok(turn, xPos, yPos, 1, 1) == 4) alert("end");
	if (addOmok(turn, xPos, yPos, 0, -1) + addOmok(turn, xPos, yPos, 0, 1) == 4) alert("end");
	if (addOmok(turn, xPos, yPos, 1, -1) + addOmok(turn, xPos, yPos, -1, 1) == 4) alert("end");
	if (addOmok(turn, xPos, yPos, -1, 0) + addOmok(turn, xPos, yPos, 1, 0) == 4) alert("end");
}

function addOmok(turn, xPos, yPos, xDir, yDir){
	if (xPos + xDir < 0) return 0;
	if (xPos + xDir > 18) return 0;
	if (yPos + yDir < 0) return 0;
	if (yPos + yDir > 18) return 0;

	if (boardArray[xPos + xDir][yPos + yDir] == turn) {
		return 1 + addOmok(turn, xPos + xDir, yPos + yDir, xDir, yDir);
	} else {
		return 0;
	}
}
