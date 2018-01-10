const path = require("path");
const fs = require("fs");
const os = require("os");
const rimraf = require("rimraf");
const seedrandom = require("seedrandom");
const Frame = require("canvas-to-buffer");
const CubeJS = require("cubejs");
require("cubejs/lib/solve.js");
CubeJS.initSolver();

const schemes =
{
	"Regular black": ["#FFFFFF", "#009A44", "#BA0C2F", "#003DA5", "#FE5000", "#FFD700", "#000000"],
	"Regular white": ["#000000", "#009A44", "#BA0C2F", "#003DA5", "#FE5000", "#FFD700", "#FFFFFF"],
	"TheCubicle.us standard": ["#FFFFFF", "#019B67", "#C40042", "#373ABF", "#FF8601", "#FFDB00", "#000000"],
	"TheCubicle.us half-bright": ["#FFFFFF", "#00AD51", "#C40042", "#373ABF", "#FE8707", "#F4F501", "#000000"],
	"TheCubicle.us full-bright": ["#FFFFFF", "#00AD51", "#EF3E34", "#39B7EA", "#FE8707", "#F4F501", "#000000"],
};

class LISCube
{
	public orbits: Cube[] = Array(12).fill(undefined).map(() => new Cube());

	public draw(ctx: CanvasRenderingContext2D, shades: string[])
	{
		ctx.save();
		ctx.translate(1.5, 1.5);

		this.drawFace(ctx, shades, 0, 300, 0);
		this.drawFace(ctx, shades, 1, 300, 300);
		this.drawFace(ctx, shades, 2, 600, 300);
		this.drawFace(ctx, shades, 3, 900, 300);
		this.drawFace(ctx, shades, 4, 0, 300);
		this.drawFace(ctx, shades, 5, 300, 600);

		ctx.restore();
	}

	private drawFace(ctx: CanvasRenderingContext2D, shades: string[], index: number, x: number, y: number)
	{
		ctx.save();
		ctx.translate(x, y);
		
		this.drawCornerSticker(ctx, shades, this.getSticker(index, 0), 0, 0, 0);
		this.drawEdgeSticker(ctx, shades, this.getSticker(index, 1), 0, 100, 0);
		this.drawCornerSticker(ctx, shades, this.getSticker(index, 2), 1, 200, 0);
		this.drawEdgeSticker(ctx, shades, this.getSticker(index, 3), 3, 0, 100);
		this.drawCentre(ctx, shades, index, 100, 100);
		this.drawEdgeSticker(ctx, shades, this.getSticker(index, 4), 1, 200, 100);
		this.drawCornerSticker(ctx, shades, this.getSticker(index, 5), 3, 0, 200);
		this.drawEdgeSticker(ctx, shades, this.getSticker(index, 6), 2, 100, 200);
		this.drawCornerSticker(ctx, shades, this.getSticker(index, 7), 2, 200, 200);

		ctx.lineWidth = 3;
		ctx.strokeStyle = shades[6];
		ctx.lineCap = "square";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, 300);
		ctx.moveTo(100, 0);
		ctx.lineTo(100, 300);
		ctx.moveTo(200, 0);
		ctx.lineTo(200, 300);
		ctx.moveTo(300, 0);
		ctx.lineTo(300, 300);
		ctx.moveTo(0, 0);
		ctx.lineTo(300, 0);
		ctx.moveTo(0, 100);
		ctx.lineTo(300, 100);
		ctx.moveTo(0, 200);
		ctx.lineTo(300, 200);
		ctx.moveTo(0, 300);
		ctx.lineTo(300, 300);
		ctx.stroke();
		
		ctx.restore();
	}

	private getSticker(faceIndex: number, stickerIndex: number): number[]
	{
		return this.orbits.map(cube => cube.stickers[faceIndex][stickerIndex]);
	}

	private drawCornerSticker(ctx: CanvasRenderingContext2D, shades: string[], colours: number[], orientation: number, x: number, y: number)
	{
		const quarterTurn = Math.PI * 0.5;

		ctx.save();
		ctx.translate(x, y);

		ctx.translate(50, 50);
		ctx.rotate(orientation * quarterTurn);
		ctx.translate(-50, -50);

		this.drawCornerStickerTile(ctx, shades, colours.slice(0, 3));

		ctx.translate(50, 50);
		ctx.rotate(quarterTurn);
		ctx.translate(-50, -50);

		this.drawCornerStickerTile(ctx, shades, colours.slice(3, 6));

		ctx.translate(50, 50);
		ctx.rotate(quarterTurn);
		ctx.translate(-50, -50);

		this.drawCornerStickerTile(ctx, shades, colours.slice(6, 9));

		ctx.translate(50, 50);
		ctx.rotate(quarterTurn);
		ctx.translate(-50, -50);

		this.drawCornerStickerTile(ctx, shades, colours.slice(9, 12));

		const radius = Math.sqrt(0.5) * 30;
		ctx.lineWidth = 1;
		ctx.strokeStyle = shades[6];
		ctx.beginPath();

		ctx.moveTo(0, 0);
		ctx.lineTo(50 - radius, 50 - radius);
		ctx.moveTo(100, 0);
		ctx.lineTo(50 + radius, 50 - radius);
		ctx.moveTo(0, 100);
		ctx.lineTo(50 - radius, 50 + radius);
		ctx.moveTo(100, 100);
		ctx.lineTo(50 + radius, 50 + radius);

		ctx.moveTo(50, 0);
		ctx.lineTo(50, 100);
		ctx.moveTo(0, 50);
		ctx.lineTo(100, 50);

		ctx.moveTo(80, 50);
		ctx.ellipse(50, 50, 30, 30, 0, 0, Math.PI * 2);

		ctx.stroke();

		ctx.restore();
	}

	private drawCornerStickerTile(ctx: CanvasRenderingContext2D, shades: string[], colours: number[])
	{
		ctx.fillStyle = shades[colours[0]];
		ctx.beginPath();
		ctx.moveTo(50, 50);
		ctx.arc(50, 50, 30, Math.PI, Math.PI * 1.5);
		ctx.fill();

		ctx.fillStyle = shades[colours[1]];
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, 50);
		ctx.arc(50, 50, 30, Math.PI, Math.PI * 1.25);
		ctx.fill();
		
		ctx.fillStyle = shades[colours[2]];
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(50, 0);
		ctx.arc(50, 50, 30, Math.PI * 1.5, Math.PI * 1.25, true);
		ctx.fill();
	}

	private drawEdgeSticker(ctx: CanvasRenderingContext2D, shades: string[], colours: number[], orientation: number, x: number, y: number)
	{
		const quarterTurn = Math.PI * 0.5;

		ctx.save();
		ctx.translate(x, y);

		ctx.translate(50, 50);
		ctx.rotate(orientation * quarterTurn);
		ctx.translate(-50, -50);

		this.drawEdgeStickerTile(ctx, shades, colours.slice(0, 3));

		ctx.translate(50, 50);
		ctx.rotate(quarterTurn);
		ctx.translate(-50, -50);

		this.drawEdgeStickerTile(ctx, shades, colours.slice(3, 6));

		ctx.translate(50, 50);
		ctx.rotate(quarterTurn);
		ctx.translate(-50, -50);

		this.drawEdgeStickerTile(ctx, shades, colours.slice(6, 9));

		ctx.translate(50, 50);
		ctx.rotate(quarterTurn);
		ctx.translate(-50, -50);

		this.drawEdgeStickerTile(ctx, shades, colours.slice(9, 12));

		ctx.lineWidth = 1;
		ctx.strokeStyle = shades[6];
		ctx.beginPath();

		ctx.moveTo(0, 0);
		ctx.lineTo(100, 100);
		ctx.moveTo(100, 0);
		ctx.lineTo(0, 100);

		ctx.moveTo(50, 0);
		ctx.lineTo(50, 20);
		ctx.moveTo(50, 80);
		ctx.lineTo(50, 100);
		ctx.moveTo(0, 50);
		ctx.lineTo(20, 50);
		ctx.moveTo(80, 50);
		ctx.lineTo(100, 50);

		ctx.moveTo(80, 50);
		ctx.ellipse(50, 50, 30, 30, 0, 0, Math.PI * 2);

		ctx.stroke();

		ctx.restore();
	}

	private drawEdgeStickerTile(ctx: CanvasRenderingContext2D, shades: string[], colours: number[])
	{
		ctx.fillStyle = shades[colours[0]];
		ctx.beginPath();
		ctx.moveTo(50, 50);
		ctx.arc(50, 50, 30, Math.PI * 1.25, Math.PI * 1.75);
		ctx.fill();
		
		ctx.fillStyle = shades[colours[1]];
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(50, 0);
		ctx.arc(50, 50, 30, Math.PI * 1.5, Math.PI * 1.25, true);
		ctx.fill();
		
		ctx.fillStyle = shades[colours[2]];
		ctx.beginPath();
		ctx.moveTo(100, 0);
		ctx.lineTo(50, 0);
		ctx.arc(50, 50, 30, Math.PI * 1.5, Math.PI * 1.75);
		ctx.fill();
	}

	private drawCentre(ctx: CanvasRenderingContext2D, shades: string[], colour: number, x: number, y: number)
	{
		ctx.fillStyle = shades[colour];
		ctx.fillRect(x, y, 100, 100);
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

const coloursInput = document.getElementById("colours") as HTMLInputElement;
const schemesInput = document.getElementById("schemes") as HTMLSelectElement;
const seedInput = document.getElementById("seed") as HTMLInputElement;
const output = document.getElementById("output")!;

schemesInput.addEventListener("change", selectScheme)
document.getElementById("new")!.addEventListener("click", create);
document.getElementById("save")!.addEventListener("click", save);

let cube: LISCube;
let seed: string;
let shades: string[];

initSchemes();
create();

function initSchemes()
{
	for (const scheme in schemes)
	{
		const option = document.createElement("option");
		option.label = scheme;
		option.value = JSON.stringify((<any>schemes)[scheme]);
		schemesInput.appendChild(option);
	}
	schemesInput.selectedIndex = 0;
	selectScheme();
}

function selectScheme()
{
	coloursInput.value = schemesInput.selectedOptions[0].value;
}

function create()
{
	try
	{
		try
		{
			shades = JSON.parse(coloursInput.value);
		}
		catch (err)
		{
			throw `Invalid scheme: ${coloursInput.value}`;
		}
		seed = seedInput.value = seedrandom(seedInput.value || readableSeed(), { global: true });

		const scrambles: string[] = Array(12).fill("").map(CubeJS.scramble);
		scrambles[0] = "No scramble";

		cube = new LISCube();

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

		cube.draw(ctx, shades);
		output.textContent =
		[
			`Colour scheme:\n${JSON.stringify(shades)}`,
			`Seed:\n${seed}`,
			...scrambles.map((s, i) => `Orbit ${i}:\n${s}`),
		]
			.join("\n\n");
	}
	catch (err)
	{
		alert(err);
	}
}

function readableSeed()
{
	return Math.floor(Math.random() * 0x100000000).toString();
}

function save()
{
	try
	{
		const bigCanvas = document.createElement("canvas");
		bigCanvas.width = canvas.width * 4;
		bigCanvas.height = canvas.height * 4;
		const ctx = bigCanvas.getContext("2d")!;
		ctx.scale(4, 4);
		cube.draw(ctx, shades);

		const baseDir = path.join(os.homedir(), "Lost In Space");
		const dir = path.join(baseDir, seedInput.value.replace(/[^\w\- ]/g, "") || "_");
		if (!fs.existsSync(baseDir))
		{
			fs.mkdirSync(baseDir);
		}
		if (fs.existsSync(dir))
		{
			rimraf.sync(dir);
		}
		fs.mkdirSync(dir);
		fs.writeFileSync(path.join(dir, "info.txt"), output.textContent);
		fs.writeFileSync(path.join(dir, "stickers.png"), new Frame(bigCanvas, { image: { types: ["png"] } }).toBuffer());

		alert(`Saved to ${dir}`);
	}
	catch (err)
	{
		alert(err);
	}
}
