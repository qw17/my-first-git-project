const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');

// 游戏设置
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let dx = 1; // 水平方向速度
let dy = 0; // 垂直方向速度
let score = 0;
let gameLoop;
let gameSpeed = 150;

// 初始化最高分
const highScore = localStorage.getItem('snakeHighScore') || 0;
highScoreElement.textContent = highScore;

// 绘制网格
function drawGrid() {
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格线
    ctx.strokeStyle = '#ddd';
    for (let i = 0; i <= tileCount; i++) {
        // 垂直线
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        // 水平线
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

// 绘制蛇
function drawSnake() {
    snake.forEach((segment, index) => {
        // 蛇头不同颜色
        ctx.fillStyle = index === 0 ? '#4CAF50' : '#8BC34A';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
    });
}

// 绘制食物
function drawFood() {
    ctx.fillStyle = '#f44336';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 1,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// 移动蛇
function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
        // 提高游戏速度
        if (score % 50 === 0 && gameSpeed > 50) {
            gameSpeed -= 10;
            clearInterval(gameLoop);
            gameLoop = setInterval(gameUpdate, gameSpeed);
        }
    } else {
        snake.pop();
    }
}

// 生成食物
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };

    // 确保食物不会出现在蛇身上
    const onSnake = snake.some(segment => segment.x === food.x && segment.y === food.y);
    if (onSnake) {
        generateFood();
    }
}

// 检查碰撞
function checkCollision() {
    const head = snake[0];
    
    // 墙壁碰撞
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // 自身碰撞
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// 游戏更新
function gameUpdate() {
    if (checkCollision()) {
        gameOver();
        return;
    }

    drawGrid();
    drawSnake();
    drawFood();
    moveSnake();
}

// 游戏结束
function gameOver() {
    clearInterval(gameLoop);
    
    // 更新最高分
    if (score > highScore) {
        localStorage.setItem('snakeHighScore', score);
        highScoreElement.textContent = score;
    }
    
    alert(`游戏结束! 得分: ${score}\n按确定重新开始`);
    restartGame();
}

// 改变方向
function changeDirection(direction) {
    const LEFT_KEY = 'LEFT';
    const RIGHT_KEY = 'RIGHT';
    const UP_KEY = 'UP';
    const DOWN_KEY = 'DOWN';

    // 防止180度转向
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (direction === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }

    if (direction === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }

    if (direction === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }

    if (direction === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

// 重新开始游戏
function restartGame() {
    clearInterval(gameLoop);
    snake = [{x: 10, y: 10}];
    dx = 1;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    gameSpeed = 150;
    generateFood();
    gameLoop = setInterval(gameUpdate, gameSpeed);
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = e.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
});

// 开始游戏
restartGame();