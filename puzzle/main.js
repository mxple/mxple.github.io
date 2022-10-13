const RED   = "<img draggable='false' class='img' src='https://i.imgur.com/XTGyvnc.png'>";
const GREEN = "<img draggable='false' class='img' src='https://i.imgur.com/PSuDKse.png'>";

class Puzzle {
    constructor() {
        this.grid = [
            [false,false,false],
            [false,false,false],
            [false,false,false]
        ];
    }

    randomize() {
        let repeat_count = Math.max(1, Math.floor(Math.random() * 10));
        for (let i = 0; i < repeat_count; i++) {
            let x = Math.floor(Math.random()*3);
            let y = Math.floor(Math.random()*3);
            this.grid[x][y] = !this.grid[x][y];
        }
        if (this.is_solved()) {
            this.randomize();
        }
    }

    update(x,y) {
        this.grid[x][y] = !this.grid[x][y];

        // cardinals
        if (this.grid[x+1] != undefined) this.grid[x+1][y] = !this.grid[x+1][y];
        if (this.grid[x-1] != undefined) this.grid[x-1][y] = !this.grid[x-1][y];

        if (this.grid[x][y+1] != undefined) this.grid[x][y+1] = !this.grid[x][y+1];
        if (this.grid[x][y-1] != undefined) this.grid[x][y-1] = !this.grid[x][y-1];
    }

    is_solved() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!this.grid[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
}

// draw conduits to display
function draw(puzzle) {
    for (let row = 0; row < 3; row++) {  
        for (let col = 0; col < 3; col++) {
            if (puzzle.grid[row][col]) {
                document.getElementById("n"+row+col).innerHTML=GREEN;
            } else {
                document.getElementById("n"+row+col).innerHTML=RED;
            }
        }
    }
}

// begin puzzle
var puzzle = new Puzzle();
puzzle.randomize();
draw(puzzle);
$(".grid-item").click(function() {
    this.setAttribute("draggable", false);

    puzzle.update(Number(this.id[1]),Number(this.id[2]));
    draw(puzzle);
});