// Objet Rectangle
class Rect {
    constructor(x, y, w, h, color, rot, topRotation, topSuppression, interval) {

        this.id = arrRectangles.length;

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.aire = w * h;
        this.color = color;

        this.rot = rot || 0;
        this.topRotation = topRotation || 0; //top rotation en cours
        this.topSuppression = topSuppression || 0; //top rectangle a supprimer
        this.interval = interval || 0;
        this.draw();
    }
    color(colorRectangle) {
        ctx.fillStyle = colorRectangle;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fill();
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fill();
    }
    rotation() {

        // on supprime et on dessine que le rectangle, mais Il faut savoir que la suppression peux ne pas marcher  si les rectangles sont trop proches
        if (this.w > this.h) {
            ctx.clearRect(this.x - this.h / 2, this.y - this.w / 2, this.w * 2, this.w + this.h);
        } else {
            ctx.clearRect(this.x - this.h / 2, this.y - this.w / 2, this.w + this.h * 2, this.w + this.h * 2);
        }
        ctx.save();
        ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        ctx.rotate((this.rot * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
        ctx.fill();
        ctx.restore();

        // On redessine les rectangles car certains on pu être effacer a cause la rotation d'autres rectangles
        for (let x = 0; x < arrRectangles.length; x++) {
            if (arrRectangles[x].topRotation == 0) {
                arrRectangles[x].draw();
            }
        }
    }
   
    delete() {
        ctx.clearRect(this.x, this.y, this.w, this.h);
    }
    
}
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var button = document.getElementById("button");


var arrRectangles = [];


// génération de couleur aléatoire
function RandomColor() {
    return Math.floor(Math.random() * 0xFFFFFF << 0).toString(16);
}

// Verifier si on a cliqué sur un rectangle
function getRectangle(x, y) {
    for (let rect of arrRectangles) {
        if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h) {
            return arrRectangles.indexOf(rect);
        }
    }
}

function RotationRect(e) {
    // initialisation de position du click 
    const container = canvas.getBoundingClientRect();
    const x = (e.clientX - container.left) * (canvas.width / container.width);
    const y = (e.clientY - container.top) * (canvas.height / container.height);

    // Detection du rectangle
    var indexRectangle = getRectangle(x, y);

    // Rectangle trouvé on active la rotation si le rectangle n'est pas déjà en rootation
    if (indexRectangle != undefined) {
        if (arrRectangles[indexRectangle].topRotation == 0) {
            // activer rotation en cours
            arrRectangles[indexRectangle].topRotation = 1;

            // lancement de la rotation toutes les 100ms
            arrRectangles[indexRectangle].interval = setInterval(function () {
                // rotation du rectangle tant que la rotation < 360
                if (arrRectangles[indexRectangle].rot <= 360) {
                    arrRectangles[indexRectangle].rotation();
                    arrRectangles[indexRectangle].rot += 0.5;
                } else {
                    // le rectangle a fait un 360 => rotation fini, rect a supprimer, réinitialiser setInterval, delete rectangle
                    arrRectangles[indexRectangle].topRotation = 0;
                    arrRectangles[indexRectangle].topSuppression = 1;
                    clearInterval(arrRectangles[indexRectangle].interval);
                    deleteRectangle();
                }
            }, 1);
        }
    }
}

function deleteRectangle() {
    var arrTopRotation = arrRectangles.filter(function (rect) {
        return rect.topRotation == 1;
    });

    // Si arrTopRotation.length == 0 => il n'y a pas de rotation en cours
    // on va récup tous les rectangle avec le topSuppression = 1 => Delete rectangle
    if (arrTopRotation.length == 0) {
        var rectDels = arrRectangles.filter(function (rect) {
            return rect.topSuppression == 1;
        });
        for (let x of rectDels) {
            // delete reactengle on canvas
            arrRectangles[arrRectangles.indexOf(x)].delete();

            // delete rectangle in arrRectangles
            arrRectangles = arrRectangles.filter(function (rect) {
                return rect.id != x.id;
            });
        }
    }
}

// Au click du button "changer couleur" ca va  changer les couleurs des 2 rectangles avec la plus petite diffirence d'aire
function changeColor() {
    // création d'un array avec la différences d'aire entre 2 rectangles
    var rectsChangeColor = [];
    if (arrRectangles.length > 0) {
        for (let x of arrRectangles) {
            for (let i of arrRectangles) {
                if (x.id != i.id) {
                    if (x.aire >= i.aire) {
                        rectsChangeColor.push({ couple: [x.id, i.id], diffAire: x.aire - i.aire });
                    }
                }
            }
        }

        // On récupère la plus petite diffAire
        var diffAireMin = rectsChangeColor.reduce((min, p) => (p.diffAire < min ? p.diffAire : min), rectsChangeColor[0].diffAire);

        // On récupère le couple avec la plus petite diffAire
        var coupleRectangles = rectsChangeColor.filter(function (rect) {
            return rect.diffAire == diffAireMin;
        });

        // Générer une nouvelle couleur alétoire
        var newColor = "#" + RandomColor();

        // update color des rectangles
        arrRectangles[coupleRectangles[0].couple[0]].color = newColor;
        arrRectangles[coupleRectangles[0].couple[0]].draw();
        arrRectangles[coupleRectangles[0].couple[1]].color = newColor;
        arrRectangles[coupleRectangles[0].couple[1]].draw();
    }
}

// Evenements
canvas.addEventListener("dblclick", RotationRect);
button.addEventListener("click", changeColor);
