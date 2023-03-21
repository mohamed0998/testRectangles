// Récupération de la position du click
var posClick = canvas.getBoundingClientRect();


// La positoin de la souris sur l'axe des x
var posX;
// La positoin de la souris sur l'axe des y
var posY;
// La largeur du rectangle
var width = 0;
// La hauteur du rectangle
var height = 0;
// couleur du rectangle
var colorRectangle;


// On utilise isDrawing pour savoir si on est entraine de dessiner
var isDrawing = false;

function mouseMove(e) {
    e.preventDefault();

    if (isDrawing) {
        
    // récupérer la position de la souris
    mouseX = parseInt((e.clientX - posClick.left) * (canvas.width / posClick.width));
    mouseY = parseInt((e.clientY - posClick.top) * (canvas.height / posClick.height));

    // supprimer le rectangle tracer a chaque mouvement
    ctx.clearRect(posX, posY, width, height);

    // calculer la largeur et hauteur du rectangle
    width = mouseX - posX;
    height = mouseY - posY;

    // créer le rectangle sur le canvas avec la couleur aléatoire
    ctx.fillStyle = colorRectangle;
    ctx.fillRect(posX, posY, width, height);
    ctx.fill();
    }
}

function mouseDown(e) {
    e.preventDefault();

    // point de départ x du rectangle
    posX = parseInt((e.clientX - posClick.left) * (canvas.width / posClick.width));
    // point de départ y du rectangle
    posY = parseInt((e.clientY - posClick.top) * (canvas.height / posClick.height));

    // Detection de la position entiere de rectangle
    var indexRectangle = getRectangle(posX, posY);


    // Si l'index qu'on a vient de créer n'existe pas encore on peut donc créer un nouveau rectangle
    if (indexRectangle == undefined) {
        isDrawing = true;
        colorRectangle = "#" + RandomColor();
        
    }
}

function mouseUp(e) {
    e.preventDefault();
    isDrawing = false;

    // Vérifier si le rectangle est visible avant de le créer
    if (width > 1 && height > 1) {
        arrRectangles.push(new Rect(posX, posY, width, height, colorRectangle));
    }

    // réinistialiser les variables pour créer un nouveau rectangle
    posX = 0, posY = 0, width = 0, height = 0;
}


// Gerer les evenements
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("mouseup", mouseUp);
