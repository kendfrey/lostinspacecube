const seedrandom = require("seedrandom");
const CubeJS = require("cubejs");
require("cubejs/lib/solve.js");
CubeJS.initSolver();

const gapAngle1 = Math.asin(1 / 29);
const gapAngle2 = Math.asin(Math.sqrt(0.5) / 29);
const gapAngle3 = Math.asin(1 / 31);
const gapAngle4 = Math.asin(Math.sqrt(0.5) / 31);

const shades = ["#ffffff", "#00ff00", "#ff0000", "#0000ff", "#ff7f00", "#ffff00"];

class LISCube
{
	public orbits: Cube[] = Array(12).fill(undefined).map(() => new Cube());

	public draw(ctx: CanvasRenderingContext2D)
	{
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 300, 1200, 300);
		ctx.fillRect(300, 0, 300, 900);

		this.drawFace(ctx, 0, 300, 0);
		this.drawFace(ctx, 1, 300, 300);
		this.drawFace(ctx, 2, 600, 300);
		this.drawFace(ctx, 3, 900, 300);
		this.drawFace(ctx, 4, 0, 300);
		this.drawFace(ctx, 5, 300, 600);
	}

	private drawFace(ctx: CanvasRenderingContext2D, index: number, x: number, y: number)
	{
		this.drawCornerSticker(ctx, this.getSticker(index, 0), 0, x, y);
		this.drawEdgeSticker(ctx, this.getSticker(index, 1), 0, x + 100, y);
		this.drawCornerSticker(ctx, this.getSticker(index, 2), 1, x + 200, y);
		this.drawEdgeSticker(ctx, this.getSticker(index, 3), 3, x, y + 100);
		this.drawCentre(ctx, index, x + 100, y + 100);
		this.drawEdgeSticker(ctx, this.getSticker(index, 4), 1, x + 200, y + 100);
		this.drawCornerSticker(ctx, this.getSticker(index, 5), 3, x, y + 200);
		this.drawEdgeSticker(ctx, this.getSticker(index, 6), 2, x + 100, y + 200);
		this.drawCornerSticker(ctx, this.getSticker(index, 7), 2, x + 200, y + 200);
	}

	private getSticker(faceIndex: number, stickerIndex: number): number[]
	{
		return this.orbits.map(cube => cube.stickers[faceIndex][stickerIndex]);
	}

	private drawCornerSticker(ctx: CanvasRenderingContext2D, colours: number[], orientation: number, x: number, y: number)
	{
		const quarterTurn = Math.PI * 0.5;

		ctx.translate(x, y);

		ctx.translate(50, 50);
		ctx.rotate(orientation * quarterTurn);
		ctx.translate(-50, -50);

		this.drawCornerStickerTile(ctx, colours.slice(0, 3));

		ctx.translate(50, 50);
		ctx.rotate(quarterTurn);
		ctx.translate(-50, -50);

		this.drawCornerStickerTile(ctx, colours.slice(3, 6));

		ctx.translate(50, 50);
		ctx.rotate(quarterTurn);
		ctx.translate(-50, -50);

		this.drawCornerStickerTile(ctx, colours.slice(6, 9));

		ctx.translate(50, 50);
		ctx.rotate(quarterTurn);
		ctx.translate(-50, -50);

		this.drawCornerStickerTile(ctx, colours.slice(9, 12));

		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	private drawCornerStickerTile(ctx: CanvasRenderingContext2D, colours: number[])
	{
		ctx.fillStyle = shades[colours[0]];
		ctx.beginPath();
		ctx.moveTo(49, 49);
		ctx.arc(50, 50, 29, Math.PI + gapAngle1, Math.PI * 1.5 - gapAngle1);
		ctx.fill();

		ctx.fillStyle = shades[colours[1]];
		ctx.beginPath();
		ctx.lineTo(5, 6);
		ctx.lineTo(5, 49);
		ctx.arc(50, 50, 31, Math.PI + gapAngle3, Math.PI * 1.25 - gapAngle4);
		ctx.fill();
		
		ctx.fillStyle = shades[colours[2]];
		ctx.beginPath();
		ctx.lineTo(6, 5);
		ctx.lineTo(49, 5);
		ctx.arc(50, 50, 31, Math.PI * 1.5 - gapAngle3, Math.PI * 1.25 + gapAngle4, true);
		ctx.fill();
	}

	private drawEdgeSticker(ctx: CanvasRenderingContext2D, colours: number[], orientation: number, x: number, y: number)
	{
		const quarterTurn = Math.PI * 0.5;

		ctx.translate(x, y);

		ctx.translate(50, 50);
		ctx.rotate(orientation * quarterTurn);
		ctx.translate(-50, -50);

		this.drawEdgeStickerTile(ctx, colours.slice(0, 3));

		ctx.translate(50, 50);
		ctx.rotate(quarterTurn);
		ctx.translate(-50, -50);

		this.drawEdgeStickerTile(ctx, colours.slice(3, 6));

		ctx.translate(50, 50);
		ctx.rotate(quarterTurn);
		ctx.translate(-50, -50);

		this.drawEdgeStickerTile(ctx, colours.slice(6, 9));

		ctx.translate(50, 50);
		ctx.rotate(quarterTurn);
		ctx.translate(-50, -50);

		this.drawEdgeStickerTile(ctx, colours.slice(9, 12));

		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	private drawEdgeStickerTile(ctx: CanvasRenderingContext2D, colours: number[])
	{
		ctx.fillStyle = shades[colours[0]];
		ctx.beginPath();
		ctx.moveTo(50, 49);
		ctx.arc(50, 50, 29, Math.PI * 1.25 + gapAngle2, Math.PI * 1.75 - gapAngle2);
		ctx.fill();
		
		ctx.fillStyle = shades[colours[1]];
		ctx.beginPath();
		ctx.lineTo(6, 5);
		ctx.lineTo(49, 5);
		ctx.arc(50, 50, 31, Math.PI * 1.5 - gapAngle3, Math.PI * 1.25 + gapAngle4, true);
		ctx.fill();
		
		ctx.fillStyle = shades[colours[2]];
		ctx.beginPath();
		ctx.lineTo(94, 5);
		ctx.lineTo(51, 5);
		ctx.arc(50, 50, 31, Math.PI * 1.5 + gapAngle3, Math.PI * 1.75 - gapAngle4);
		ctx.fill();
	}

	private drawCentre(ctx: CanvasRenderingContext2D, colour: number, x: number, y: number)
	{
		ctx.fillStyle = shades[colour];
		ctx.fillRect(x + 5, y + 5, 90, 90);
	}
}

class Cube
{
	public stickers: number[][] = Array(6).fill(undefined).map((_, i) => Array(8).fill(i));

	public algorithm(algorithm: string)
	{
		algorithm.split(" ").forEach(turn => this.turn(turn));
	}

	private turn(turn: string)
	{
		const match = turn.match(/^([UFRBLD])(|2|')$/i)!;
		if (match === null)
		{
			return;
		}
		const side = match[1].toLowerCase();
		let times = 1;
		switch (match[2])
		{
			case "":
				times = 1;
				break;
			case "2":
				times = 2;
				break;
			case "'":
				times = 3;
				break;
		}

		for (let i = 0; i < times; i++)
		{
			(<any>this)[side]();
		}
	}

	private u()
	{
		this.cycle([0, 0], [0, 2], [0, 7], [0, 5]);
		this.cycle([0, 1], [0, 4], [0, 6], [0, 3]);
		this.cycle([1, 0], [4, 0], [3, 0], [2, 0]);
		this.cycle([1, 1], [4, 1], [3, 1], [2, 1]);
		this.cycle([1, 2], [4, 2], [3, 2], [2, 2]);
	}

	private f()
	{
		this.cycle([1, 0], [1, 2], [1, 7], [1, 5]);
		this.cycle([1, 1], [1, 4], [1, 6], [1, 3]);
		this.cycle([0, 7], [2, 5], [5, 0], [4, 2]);
		this.cycle([0, 6], [2, 3], [5, 1], [4, 4]);
		this.cycle([0, 5], [2, 0], [5, 2], [4, 7]);
	}

	private r()
	{
		this.cycle([2, 0], [2, 2], [2, 7], [2, 5]);
		this.cycle([2, 1], [2, 4], [2, 6], [2, 3]);
		this.cycle([0, 2], [3, 5], [5, 2], [1, 2]);
		this.cycle([0, 4], [3, 3], [5, 4], [1, 4]);
		this.cycle([0, 7], [3, 0], [5, 7], [1, 7]);
	}

	private b()
	{
		this.cycle([3, 0], [3, 2], [3, 7], [3, 5]);
		this.cycle([3, 1], [3, 4], [3, 6], [3, 3]);
		this.cycle([0, 0], [4, 5], [5, 7], [2, 2]);
		this.cycle([0, 1], [4, 3], [5, 6], [2, 4]);
		this.cycle([0, 2], [4, 0], [5, 5], [2, 7]);
	}

	private l()
	{
		this.cycle([4, 0], [4, 2], [4, 7], [4, 5]);
		this.cycle([4, 1], [4, 4], [4, 6], [4, 3]);
		this.cycle([0, 5], [1, 5], [5, 5], [3, 2]);
		this.cycle([0, 3], [1, 3], [5, 3], [3, 4]);
		this.cycle([0, 0], [1, 0], [5, 0], [3, 7]);
	}

	private d()
	{
		this.cycle([5, 0], [5, 2], [5, 7], [5, 5]);
		this.cycle([5, 1], [5, 4], [5, 6], [5, 3]);
		this.cycle([1, 7], [2, 7], [3, 7], [4, 7]);
		this.cycle([1, 6], [2, 6], [3, 6], [4, 6]);
		this.cycle([1, 5], [2, 5], [3, 5], [4, 5]);
	}

	private cycle(...stickers: [number, number][])
	{
		const [fn, sn] = stickers[stickers.length - 1];
		let tmp = this.stickers[fn][sn];
		for (let i = stickers.length - 1; i > 0; i--)
		{
			const [f, s] = stickers[i];
			const [f_, s_] = stickers[i - 1];
			this.stickers[f][s] = this.stickers[f_][s_];
		}
		const [f0, s0] = stickers[0];
		this.stickers[f0][s0] = tmp;
	}

	public cornerTwist()
	{
		this.cycle([0, 7], [2, 0], [1, 2]);
	}

	public edgeFlip()
	{
		this.cycle([0, 6], [1, 1]);
	}

	public edgeSwap()
	{
		this.cycle([0, 6], [0, 4]);
		this.cycle([1, 1], [2, 1]);
	}
}

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

const output = document.getElementById("output")!;
const seed = document.getElementById("seed") as HTMLInputElement;

document.getElementById("new")!.addEventListener("click", () =>
{
	seed.value = seedrandom(seed.value || readableSeed(), { global: true });

	const scrambles: string[] = Array(12).fill("").map(CubeJS.scramble);
	scrambles[0] = "No scramble";

	const cube = new LISCube();

	for (let i = 0; i < 12; i++)
	{
		const orbit = cube.orbits[i];

		for (let j = 0; j < i % 3; j++)
		{
			orbit.cornerTwist();
		}

		if (i >= 3 && i < 9)
		{
			orbit.edgeFlip();
		}

		if (i >= 6)
		{
			orbit.edgeSwap();
		}
	}

	for (let i = 0; i < 12; i++)
	{
		cube.orbits[i].algorithm(scrambles[i]);
	}

	cube.draw(ctx);
	output.textContent = scrambles.map((s, i) => `Orbit ${i}:\n${s.replace(/((?:\S+ ){10}(\S+)) /, "$1\n")}`).join("\n\n");
});

function readableSeed()
{
	return Math.floor(Math.random() * 0x100000000).toString();
}
