const RED = "<img draggable='false' class='img' src='https://i.imgur.com/XTGyvnc.png'>";
const GREEN = "<img draggable='false' class='img' src='https://i.imgur.com/PSuDKse.png'>";
const LOOKUP = [341, 432, 133, 96, 216, 61, 264, 493, 97, 132, 433, 340, 492, 265, 60, 217, 495, 266, 63, 218, 98, 135, 434, 343, 219, 62, 267, 494, 342, 435, 134, 99, 268, 489, 220, 57, 129, 100, 337, 436, 56, 221, 488, 269, 437, 336, 101, 128, 438, 339, 102, 131, 59, 222, 491, 270, 130, 103, 338, 439, 271, 490, 223, 58, 54, 211, 486, 259, 443, 350, 107, 142, 258, 487, 210, 55, 143, 106, 351, 442, 140, 105, 348, 441, 257, 484, 209, 52, 440, 349, 104, 141, 53, 208, 485, 256, 111, 138, 447, 346, 482, 263, 50, 215, 347, 446, 139, 110, 214, 51, 262, 483, 213, 48, 261, 480, 344, 445, 136, 109, 481, 260, 49, 212, 108, 137, 444, 345, 322, 423, 146, 119, 207, 42, 287, 506, 118, 147, 422, 323, 507, 286, 43, 206, 504, 285, 40, 205, 117, 144, 421, 320, 204, 41, 284, 505, 321, 420, 145, 116, 283, 510, 203, 46, 150, 115, 326, 419, 47, 202, 511, 282, 418, 327, 114, 151, 417, 324, 113, 148, 44, 201, 508, 281, 149, 112, 325, 416, 280, 509, 200, 45, 33, 196, 497, 276, 428, 329, 124, 153, 277, 496, 197, 32, 152, 125, 328, 429, 155, 126, 331, 430, 278, 499, 198, 35, 431, 330, 127, 154, 34, 199, 498, 279, 120, 157, 424, 333, 501, 272, 37, 192, 332, 425, 156, 121, 193, 36, 273, 500, 194, 39, 274, 503, 335, 426, 159, 122, 502, 275, 38, 195, 123, 158, 427, 334, 27, 254, 459, 302, 406, 371, 70, 163, 303, 458, 255, 26, 162, 71, 370, 407, 161, 68, 369, 404, 300, 457, 252, 25, 405, 368, 69, 160, 24, 253, 456, 301, 66, 167, 402, 375, 463, 298, 31, 250, 374, 403, 166, 67, 251, 30, 299, 462, 248, 29, 296, 461, 373, 400, 165, 64, 460, 297, 28, 249, 65, 164, 401, 372, 376, 413, 168, 77, 245, 16, 293, 448, 76, 169, 412, 377, 449, 292, 17, 244, 450, 295, 18, 247, 79, 170, 415, 378, 246, 19, 294, 451, 379, 414, 171, 78, 289, 452, 241, 20, 172, 73, 380, 409, 21, 240, 453, 288, 408, 381, 72, 173, 411, 382, 75, 174, 22, 243, 454, 291, 175, 74, 383, 410, 290, 455, 242, 23, 12, 233, 476, 313, 385, 356, 81, 180, 312, 477, 232, 13, 181, 80, 357, 384, 182, 83, 358, 387, 315, 478, 235, 14, 386, 359, 82, 183, 15, 234, 479, 314, 85, 176, 389, 352, 472, 317, 8, 237, 353, 388, 177, 84, 236, 9, 316, 473, 239, 10, 319, 474, 354, 391, 178, 87, 475, 318, 11, 238, 86, 179, 390, 355, 367, 394, 191, 90, 226, 7, 306, 471, 91, 190, 395, 366, 470, 307, 6, 227, 469, 304, 5, 224, 88, 189, 392, 365, 225, 4, 305, 468, 364, 393, 188, 89, 310, 467, 230, 3, 187, 94, 363, 398, 2, 231, 466, 311, 399, 362, 95, 186, 396, 361, 92, 185, 1, 228, 465, 308, 184, 93, 360, 397, 309, 464, 229, 0];
var SOLUTION;
var SHOW_SOLUTION = false;

class Puzzle {
    constructor() {
        this.grid = [
            [false, false, false],
            [false, false, false],
            [false, false, false]
        ];
    }

    randomize() {
        let repeat_count = Math.max(1, Math.floor(Math.random() * 10));
        for (let i = 0; i < repeat_count; i++) {
            let x = Math.floor(Math.random() * 3);
            let y = Math.floor(Math.random() * 3);
            this.grid[x][y] = !this.grid[x][y];
        }
        if (this.is_solved()) {
            this.randomize();
        }
    }

    update(x, y) {
        this.grid[x][y] = !this.grid[x][y];

        // cardinals
        if (this.grid[x + 1] != undefined) this.grid[x + 1][y] = !this.grid[x + 1][y];
        if (this.grid[x - 1] != undefined) this.grid[x - 1][y] = !this.grid[x - 1][y];

        if (this.grid[x][y + 1] != undefined) this.grid[x][y + 1] = !this.grid[x][y + 1];
        if (this.grid[x][y - 1] != undefined) this.grid[x][y - 1] = !this.grid[x][y - 1];
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

    solve() {
        let bin = "";
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                bin += String(Number(this.grid[j][i]));
            }
        }
        SOLUTION = decimal_to_9bit_bin(LOOKUP[parseInt(bin, 2)]);
    }
}

// helper functions
function decimal_to_9bit_bin(n) {
    let result = "";
    while (n != 0) {
        result = String(n % 2) + result;
        n = Math.floor(n / 2);
    }
    while (result.length < 9) {
        result = "0" + result;
    }
    return result;
}

// draw conduits to display
function draw(puzzle) {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (puzzle.grid[row][col]) {
                document.getElementById("n" + row + col).innerHTML = GREEN;
            } else {
                document.getElementById("n" + row + col).innerHTML = RED;
            }
            if (SHOW_SOLUTION && SOLUTION[row + 3 * col] == "1") {
                document.getElementById("n" + row + col).style.outline = "1px solid gold";
            } else {
                document.getElementById("n" + row + col).style.outline = "none";
            }
        }
    }
}

// begin puzzle
var puzzle = new Puzzle();
puzzle.randomize();
draw(puzzle);
puzzle.solve();

$(".grid-item").click(function () {
    this.setAttribute("draggable", false);

    puzzle.update(Number(this.id[1]), Number(this.id[2]));
    puzzle.solve();
    if (puzzle.is_solved()) GAME_WON = true;
    draw(puzzle);
});

$(".grid-item").contextmenu(function () {
    puzzle.grid[Number(this.id[1])][Number(this.id[2])] = !puzzle.grid[Number(this.id[1])][Number(this.id[2])];
    puzzle.solve();
    if (puzzle.is_solved()) GAME_WON = true;
    draw(puzzle);
});

window.addEventListener("keydown", function (e) {
    if (e.which == 82) { // R
        puzzle.randomize();
        puzzle.solve();
        draw(puzzle);
    }
    if (e.which == 83) { // S
        puzzle.solve();
        SHOW_SOLUTION = !SHOW_SOLUTION;
        draw(puzzle);
    }
});