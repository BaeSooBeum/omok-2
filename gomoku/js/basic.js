// 코드 주석 : 배수범

var c = document.getElementById("board");
var ctx = c.getContext("2d");
var width = 600;
var height = 600;
var radius = 14;
var blank = 12;
var turn = 1; // 1 black 2 white
var end = 0;
var latestX = 0;
var latestY = 0;

// 오목판의 사이즈는 19 * 19
// 배열의 값의 0=비었음, 1=검은돌, 2=흰돌
var boardArray = new Array(19); 			
for (var i = 0; i < 19; i++) {
    boardArray[i] = new Array(19);
    for (j = 0; j < 19; j++) { 
		boardArray[i][j] = 0;
	}
}

// 바둑판 그리기
function updateBoard(){
	// board fill color
	ctx.fillStyle="#ffcc66";				//윤곽선의 색 설정
	ctx.fillRect(0, 0, width, height);		//(0,0)과 (width, height)를 대각 꼭지점으로 갖는 사각형을 만든다.

	// 게임 Map인 바둑판을 그리는 부분
	// board draw line
	ctx.strokeStyle="#333300";				//도형의 색 설정
	ctx.fillStyle="#333300";				//윤곽선의 색 설정
	for (i = 0; i < 19; i++) { 				//바둑판의 선을 그어주는 반복문
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


	// boardArray는 현재 바둑알이 놓여진 상황을 나태내는 배열
	// 이 배열에 맞게 바둑알을 그린다.
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
			}
		}
	}


}

updateBoard();

/* Mouse Event */
// 마우스위 위치를 얻는것.
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
}

// 마우스위 위치는 바둑판위에 돌 한칸한칸 위치로 얻어지지 않음
// 따라서 마우스 위치 정보를 바둑판의 어느칸인지 변환할 필요가 있음.
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

// 마우스 이벤트 처리 리스너
c.addEventListener('mousemove', function(evt) {
	var mousePos = getMousePos(c, evt);
	drawNotClicked(mousePos.x, mousePos.y);
}, false);

c.addEventListener('mousedown', function(evt) {
	var mousePos = getMousePos(c, evt);
	isClicked(mousePos.x, mousePos.y);
}, false);

// 클릭하지 않고 마우스만 바둑판에 가져가도 흐릿하게 놓여진 돌의 모습을 미리 보여주는 함수
function drawNotClicked(xPos, yPos){
	resultPos = getMouseRoundPos(xPos, yPos);									// 마우스의 위치를 얻어옴

	if (resultPos.x > -1 && resultPos.x < 19 && resultPos.y > -1				// 마우스 커서가 바둑판 내에 위치하고, 놓여진 돌이 없는 곳이면
	 && resultPos.y < 19 && boardArray[resultPos.x][resultPos.y] == 0){
		updateBoard();															// 바둑판을 최신상태로 그리고
		ctx.beginPath();
		ctx.globalAlpha=0.8;
		if (turn < 2) {															// 순서에따라 돌의 색 지정해서
			ctx.strokeStyle="#000000";
			ctx.fillStyle="#000000";
		} else {
			ctx.strokeStyle="#ffffff";
			ctx.fillStyle="#ffffff";	
		}
		ctx.arc(blank + resultPos.x * 32, blank + resultPos.y * 32, radius, 0, 2*Math.PI);		// 흐릿하게 돌을 그림
		ctx.fill();
		ctx.stroke();
		ctx.globalAlpha=1;
	}
};

// 마우스로 클릭하면 해당칸에 맞게 오목알을 그리는 함수
function isClicked(xPos, yPos){
	resultPos = getMouseRoundPos(xPos, yPos);									// 마우스로 클릭한 곳에 맞는 바둑알의 위치를 얻는다.
	if (resultPos.x > -1 && resultPos.x < 19 && resultPos.y > -1				// 만약 클릭한 곳의 x,y가 바둑판 배열안에 포함되고, 놓여진 돌이 없으면		
	 && resultPos.y < 19 && boardArray[resultPos.x][resultPos.y] == 0){
		boardArray[resultPos.x][resultPos.y] = turn;							// 바둑판 관리 배열에 해당위치에 돌이 놓여진 것으로 설정한다.
		checkOmok(turn, resultPos.x, resultPos.y);								// 오목 규칙에 의해 게임이 종료되었느지 확인하고 해당 함수에서 종료되면 종료 메시지 보임
		turn = 3 - turn; //turn change											// 다음 턴 돌의 차례로 바꿈
		latestX = resultPos.x;
		latestY = resultPos.y;
	}
	updateBoard();
}

/* is Omok?? */
// 승리조건 판정 함수수
function checkOmok(turn, xPos, yPos){
	if (addOmok(turn, xPos, yPos, -1, -1) + addOmok(turn, xPos, yPos, 1, 1) == 4) end=1;			// 우상향~좌하향 대각으로 돌이 연속한지 확인
	if (addOmok(turn, xPos, yPos, 0, -1) + addOmok(turn, xPos, yPos, 0, 1) == 4) end=1;			// 상하 방향으로 돌이 연속한지 확인 
	if (addOmok(turn, xPos, yPos, 1, -1) + addOmok(turn, xPos, yPos, -1, 1) == 4) end=1;			// 우하향~좌상향 대각으로 돌이 연속한지 확인
	if (addOmok(turn, xPos, yPos, -1, 0) + addOmok(turn, xPos, yPos, 1, 0) == 4) end=1;			// 좌우 방향으로 돌이 연속한지 확인

	if(turn == 1) {
		if (end == 1) {
			$("#myModal").attr("style", "display:block");
			$("#myModal").find(".msg").text("Black Win!");
		}
	} else if (turn == 2) {
		if (end == 1) {
			$("#myModal").attr("style", "display:block");
			$("#myModal").find(".msg").text("White Win!");
		}
	}
}

// xPos, yPos 기준으로 xDir, yDir 만큼 위치를 옮기며 연속된 돌 갯수 세기 함수
function addOmok(turn, xPos, yPos, xDir, yDir){
	// 체크하는 위치가 바둑판 밭이면 연속된 돌카운트를 0으로 반환한다.
	if (xPos + xDir < 0) return 0;			
	if (xPos + xDir > 18) return 0;			 
	if (yPos + yDir < 0) return 0;			 
	if (yPos + yDir > 18) return 0;			 

	// 만약 체크하는 위치에 내가 원하는 turn(유저)의 돌이 있으면, 연속된 될 카운트 +1하고, 같은 방향으로 추가로 확인한다.
	if (boardArray[xPos + xDir][yPos + yDir] == turn) {
		return 1 + addOmok(turn, xPos + xDir, yPos + yDir, xDir, yDir);
	} else {
		return 0;
	}
}

function undo() {
	boardArray[latestX][latestY] = 0;
	turn = 3 - turn;
    updateBoard();
}