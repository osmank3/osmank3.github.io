window.addEventListener("load", windowLoadHandler, false);

//Debugger.log("my message");
var Debugger = function() { };
Debugger.log = function(message) {
    try {
        console.log(message);
    }
    catch (exception) {
        return;
    }
}

function windowLoadHandler() {
    canvasApp();
}

function canvasApp() {
    var theCanvas = document.getElementById("myCanvas");
    var context = theCanvas.getContext("2d");
    var shapes = [],
        protonNums = 0,
        electronNums = 0,
        neutronNums = 0,
        orbits = [],
        bigShapes = {"proton":{"x":275, "y":-140, "rad":25},
                     "neutron":{"x":375, "y":-140, "rad":25},
                     "electron":{"x":325, "y":-75, "rad":10}};
    var center = {"x":225, "y":225, "rad":175};
    var orbitInfo = [{"min":0, "rad":58},
                     {"min":2, "rad":75},
                     {"min":10, "rad":95},
                     {"min":18, "rad":115},
                     {"min":36, "rad":135},
                     {"min":54, "rad":155},
                     {"min":86, "rad":170},
                     {"min":118, "rad":185}];
    
    var dragIndex;
    var dragging;
    var mouseX;
    var mouseY;
    var dragHoldX;
    var dragHoldY;
    var element = [{"name":"Hidrojen", "symbol":"H"},
                   {"name":"Helyum", "symbol":"He"},
                   {"name":"Lityum", "symbol":"Li"},
                   {"name":"Berilyum", "symbol":"Be"},
                   {"name":"Bor", "symbol":"B"},
                   {"name":"Karbon", "symbol":"C"},
                   {"name":"Azot", "symbol":"N"},
                   {"name":"Oksijen", "symbol":"O"},
                   {"name":"Flor", "symbol":"F"},
                   {"name":"Neon", "symbol":"Ne"},
                   {"name":"Sodyum", "symbol":"Na"},
                   {"name":"Magnezyum", "symbol":"Mg"},
                   {"name":"Alüminyum", "symbol":"Al"},
                   {"name":"Silisyum", "symbol":"Si"},
                   {"name":"Fosfor", "symbol":"P"},
                   {"name":"Kükürt", "symbol":"S"},
                   {"name":"Klor", "symbol":"Cl"},
                   {"name":"Argon", "symbol":"Ar"},
                   {"name":"Potasyum", "symbol":"K"},
                   {"name":"Kalsiyum", "symbol":"Ca"}]

    init();

    function init() {
        context.translate(center.x, center.y);
        drawScreen();
        theCanvas.addEventListener("mousedown", mouseDownListener, false); 
    }

    function drawScreen() {
        drawStableShapes();
        drawTexts();
        drawInfo();
        drawOrbits();
        drawForces();
        drawShapes();
    }

    function drawStableShapes() {
        context.beginPath();
        context.fillStyle = "rgba(200, 200, 200, 1)";
        context.fillRect(-1 * center.x, -1 * center.y, theCanvas.width, theCanvas.height);
        context.fillStyle = "rgba(0, 0, 0, 1)";


        context.arc(0, 0, center.rad, 0, 2*Math.PI);
        context.rect(220, -180, 210, 150);
        context.rect(220, 25, 210, 150);
        context.fillStyle="rgba(240, 240, 240, 1)";
        context.fill();

        //proton
        context.beginPath();
        context.arc(bigShapes.proton.x, bigShapes.proton.y, bigShapes.proton.rad, 0, 2*Math.PI);
        context.fillStyle="rgba(256, 144, 0, 1)";
        context.fill();
        context.fillStyle="rgba(0, 0, 0, 1)";
        context.moveTo(bigShapes.proton.x - 7, bigShapes.proton.y);
        context.lineTo(bigShapes.proton.x + 7, bigShapes.proton.y);
        context.moveTo(bigShapes.proton.x, bigShapes.proton.y - 7);
        context.lineTo(bigShapes.proton.x, bigShapes.proton.y + 7);
        context.stroke();
        //nötron
        context.beginPath();
        context.arc(bigShapes.neutron.x, bigShapes.neutron.y, bigShapes.neutron.rad, 0, 2*Math.PI);
        context.fillStyle="rgba(256, 256, 256, 1)";
        context.fill();
        context.stroke();
        //elektron
        context.beginPath();
        context.arc(bigShapes.electron.x, bigShapes.electron.y, bigShapes.electron.rad, 0, 2*Math.PI);
        context.fillStyle="rgba(0, 144, 256, 1)";
        context.fill();
        context.fillStyle="rgba(0, 0, 0, 1)";
        context.moveTo(bigShapes.electron.x - 5, bigShapes.electron.y);
        context.lineTo(bigShapes.electron.x + 5, bigShapes.electron.y);
        context.stroke();

        drawPointedArch(context, 0, 0, 50, Math.PI * 0.4);
    }

    function drawTexts() {
        context.font = '16pt Calibri'; 
        context.textAlign = "center";
        context.fillStyle = "rgba(0, 0, 0, 1)";

        drawTextAlongArc(context, "Atom Oluşturma Alanı", 0, 0, 180, Math.PI * 0.6)
        context.fillText("Atom Altı Parçacıklar", 325, -190);
        context.fillText("Oluşan Atomun Bilgileri", 325, 10);

        context.font = '12pt Calibri';
        context.fillText("Proton", bigShapes.proton.x, bigShapes.proton.y + bigShapes.proton.rad + 20);
        context.fillText("Nötron", bigShapes.neutron.x, bigShapes.neutron.y + bigShapes.neutron.rad + 20);
        context.fillText("Elektron", bigShapes.electron.x, bigShapes.electron.y + bigShapes.electron.rad + 20);

        context.fillText("Adı", 285, 45);
        context.fillText("Sembolü", 285, 65);
        context.fillText("Proton sayısı", 285, 95);
        context.fillText("Nötron sayısı", 285, 115);
        context.fillText("Elektron sayısı", 285, 135);
        context.fillText("Elektrik yükü", 285, 165);

        context.font = '8pt Calibri';
        drawTextAlongArc(context, "Atom Çekirdeği", 0, 0, 40, Math.PI * 0.7);
    }

    function drawInfo() {
        var tempNum,
            tempText;

        context.font = '12pt Calibri';
        context.textAlign = "center";
        context.fillStyle = "rgba(256, 0, 0, 1)";
        
        if (protonNums > 0) {
            context.fillText(element[protonNums - 1].name, 375, 45);
            context.fillText(element[protonNums - 1].symbol, 375, 65);
        }
        context.fillText(protonNums, 375, 95);
        context.fillText(neutronNums, 375, 115);
        context.fillText(electronNums, 375, 135);
        
        tempNum = protonNums - electronNums;
        tempText = tempNum <= 0 ? tempNum : "+" + tempNum;
        context.fillText(tempText, 375, 165);
    }

    function drawOrbits() {
        for (var i=0; i < 7; i++) {
            if (orbitInfo[i].min < electronNums) {
                drawPointedArch(context, 0, 0, orbitInfo[i].rad, Math.PI * 0.05);
            }
        }
    }

    function drawForces() {
        var n;
        var color;
        var tmpSlope;
        if (dragging && hitTest({"x": 0, "y": 0, "rad": center.rad}, shapes[dragIndex].x, shapes[dragIndex].y)) {
            for (n=0; shapes.length > n; n++) {
                if ( dragIndex != n) {
                    if (shapes[n].type == "neutron" || shapes[dragIndex].type == "neutron") continue;
                    else if (shapes[n].type == shapes[dragIndex].type) color = "rgba(256,0,0,0.5)";
                    else  color = "rgba(0,256,0,0.5)";

                    tmpSlope = Math.atan2(shapes[n].y - shapes[dragIndex].y, shapes[n].x - shapes[dragIndex].x);
                    context.beginPath();
                    context.arc(shapes[n].x, shapes[n].y, shapes[n].rad, tmpSlope - Math.PI / 2, tmpSlope + Math.PI / 2);
                    context.arc(shapes[dragIndex].x, shapes[dragIndex].y, shapes[dragIndex].rad, tmpSlope + Math.PI / 2, tmpSlope - Math.PI / 2);
                    context.fillStyle = color;
                    context.fill();
                }
            }
        }
    }

    function drawShapes() {
        var n;
        for (n=0; shapes.length > n; n++) {
            if (shapes[n].type == "proton") drawProton(shapes[n].x, shapes[n].y);
            else if (shapes[n].type == "neutron") drawNeutron(shapes[n].x, shapes[n].y);
            else if (shapes[n].type == "electron") drawElectron(shapes[n].x, shapes[n].y);
        }
    }

    function mouseDownListener(evt) {
        var i;
        //We are going to pay attention to the layering order of the objects so that if a mouse down occurs over more than object,
        //only the topmost one will be dragged.
        var highestIndex = -1;
        var tempShape;
        
        //getting mouse position correctly, being mindful of resizing that may have occured in the browser:
        var bRect = theCanvas.getBoundingClientRect();
        mouseX = (evt.clientX - bRect.left)*(theCanvas.width/bRect.width) - center.x;
        mouseY = (evt.clientY - bRect.top)*(theCanvas.height/bRect.height) - center.y;
                
        //find which shape was clicked
        for (i=0; i < shapes.length; i++) {
            if    (hitTest(shapes[i], mouseX, mouseY)) {
                dragging = true;
                if (i > highestIndex) {
                    //We will pay attention to the point on the object where the mouse is "holding" the object:
                    dragHoldX = mouseX - shapes[i].x;
                    dragHoldY = mouseY - shapes[i].y;
                    highestIndex = i;
                    dragIndex = i;
                }
            }
        }

        //if shapes was not clicked checking click for big shapes(template shapes)
        if (highestIndex == -1) {  
            if (hitTest(bigShapes["proton"], mouseX, mouseY) & protonNums < element.length) {
                dragging = true;
                drawProton(mouseX, mouseY);
                shapes.push({"x":mouseX, "y":mouseY, "rad":12, "type":"proton"});
            } else if (hitTest(bigShapes["neutron"], mouseX, mouseY)) {
                dragging = true;
                drawNeutron(mouseX, mouseY);
                shapes.push({"x":mouseX, "y":mouseY, "rad":12, "type":"neutron"});
            } else if (hitTest(bigShapes["electron"], mouseX, mouseY)) {
                dragging = true;
                drawElectron(mouseX, mouseY);
                shapes.push({"x":mouseX, "y":mouseY, "rad":7, "type":"electron"});
            }
            if (dragging) {
                dragHoldX = mouseX - shapes[i].x;
                dragHoldY = mouseY - shapes[i].y;
                highestIndex = shapes.length - 1;
                dragIndex = shapes.length - 1;
            }
        } else if (dragging) {
            //moved electron goes to last index
            if (shapes[dragIndex].type == "electron") {
                tempShape = shapes[dragIndex];
                shapes.splice(dragIndex, 1);
                shapes.push(tempShape);
                highestIndex = shapes.length - 1;
                dragIndex = shapes.length - 1;
                orbits = [];
                electronNums = 0;
                //last electron must move with mouse, so that electron's coordinates can't check by orbitCheck function
                for (i=0; i < shapes.length -1; i++) {
                    if (shapes[i].type == "electron") {
                        electronNums++;
                        orbits.push(i);
                        orbitCheck(shapes[i]);
                    }
                }
                orbits.push(dragIndex);
            }
        }

        if (dragging) {
            window.addEventListener("mousemove", mouseMoveListener, false);
        }
        theCanvas.removeEventListener("mousedown", mouseDownListener, false);
        window.addEventListener("mouseup", mouseUpListener, false);

        //code below prevents the mouse down from having an effect on the main browser window:
        if (evt.preventDefault) {
            evt.preventDefault();
        } //standard
        else if (evt.returnValue) {
            evt.returnValue = false;
        } //older IE
        return false;
    }

    function mouseMoveListener(evt) {
        var posX;
        var posY;
        var shapeRad = shapes[dragIndex].rad;
        var minX = shapeRad - center.x;
        var maxX = theCanvas.width - shapeRad - center.x;
        var minY = shapeRad - center.y;
        var maxY = theCanvas.height - shapeRad - center.y;
        //getting mouse position correctly 
        var bRect = theCanvas.getBoundingClientRect();
        mouseX = (evt.clientX - bRect.left)*(theCanvas.width/bRect.width) - center.x;
        mouseY = (evt.clientY - bRect.top)*(theCanvas.height/bRect.height) - center.y;
        
        //clamp x and y positions to prevent object from dragging outside of canvas
        posX = mouseX - dragHoldX;
        posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
        posY = mouseY - dragHoldY;
        posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
        
        shapes[dragIndex].x = posX;
        shapes[dragIndex].y = posY;
        
        drawScreen();
    }

    function mouseUpListener(evt) {
        var n;
        protonNums = 0;
        neutronNums = 0;
        electronNums = 0;
        orbits = [];
        for (n=0; shapes.length > n; n++) {
            if (!hitTest({"x":0, "y":0, "rad": center.rad}, shapes[n].x, shapes[n].y)) {
                shapes.splice(n, 1);
                n--;
            }
            else {
                if (shapes[n].type == "proton") {
                    protonNums++;
                    nucleusCheck(shapes[n]);
                } else if (shapes[n].type == "neutron") {
                    neutronNums++;
                    nucleusCheck(shapes[n]);
                } else if (shapes[n].type == "electron") {
                    electronNums++;
                    orbits.push(n);
                    orbitCheck(shapes[n]);
                }
            }
        }
        theCanvas.addEventListener("mousedown", mouseDownListener, false);
        window.removeEventListener("mouseup", mouseUpListener, false);
        if (dragging) {
            dragging = false;
            window.removeEventListener("mousemove", mouseMoveListener, false);
        }
        drawScreen();
    }

    function nucleusCheck(shape) {
        if (!hitTest({"x":0, "y":0, "rad":40 }, shape.x, shape.y)) {
            shape.x = (shape.x / center.rad) * 40;
            shape.y = (shape.y / center.rad) * 40;
        }
    }

    function orbitCheck(shape) {
        var i;
        var tmpSlope;
        var tmpAngle;
        var tmpOrb;

        if (electronNums < 3) tmpOrb = 0;
        else if (electronNums < 11) tmpOrb = 1;
        else if (electronNums < 19) tmpOrb = 2;
        else if (electronNums < 37) tmpOrb = 3;
        else if (electronNums < 55) tmpOrb = 4;
        else if (electronNums < 87) tmpOrb = 5;
        else if (electronNums < 119) tmpOrb = 6;
        else tmpOrb = 7;

        tmpAngle = 2 * Math.PI / (electronNums - orbitInfo[tmpOrb].min);
        tmpSlope = Math.atan2(shapes[orbits[orbitInfo[tmpOrb].min]].y, shapes[orbits[orbitInfo[tmpOrb].min]].x);
        for (i = orbitInfo[tmpOrb].min; i < electronNums; i++) {
            shapes[orbits[i]].x = Math.cos(tmpSlope + tmpAngle * (i - orbitInfo[tmpOrb].min)) * orbitInfo[tmpOrb].rad;
            shapes[orbits[i]].y = Math.sin(tmpSlope + tmpAngle * (i - orbitInfo[tmpOrb].min)) * orbitInfo[tmpOrb].rad;
        } 
    }

    function hitTest(shape,mx,my) {
        var dx;
        var dy;
        dx = mx - shape.x;
        dy = my - shape.y;
        
        //a "hit" will be registered if the distance away from the center is less than the radius of the circular object
        return (dx*dx + dy*dy < shape.rad*shape.rad);
    }

    function drawProton(x, y) {
        context.beginPath();
        context.arc(x, y, 12, 0, 2*Math.PI);
        context.fillStyle="rgba(256, 144, 0, 1)";
        context.fill();
        context.fillStyle="rgba(0, 0, 0, 1)";
        context.moveTo(x-5, y);
        context.lineTo(x+5, y);
        context.moveTo(x, y-5);
        context.lineTo(x, y+5);
        context.stroke();
    }

    function drawNeutron(x, y) {
        context.beginPath();
        context.arc(x, y, 12, 0, 2*Math.PI);
        context.fillStyle="rgba(256, 256, 256, 1)";
        context.fill();
        context.stroke();
    }

    function drawElectron(x, y) {
        context.beginPath();
        context.arc(x, y, 7, 0, 2*Math.PI);
        context.fillStyle="rgba(0, 144, 256, 1)";
        context.fill();
        context.fillStyle="rgba(0, 0, 0, 1)";
        context.moveTo(x-4, y);
        context.lineTo(x+4, y);
        context.stroke();
    }
}

function drawTextAlongArc(context, str, centerX, centerY, radius, angle) {
    var len = str.length, s;
    context.save();
    context.translate(centerX, centerY);
    context.rotate(-1 * angle / 2);
    context.rotate(-1 * (angle / len) / 2);
    for(var n = 0; n < len; n++) {
        context.rotate(angle / len);
        context.save();
        context.translate(0, -1 * radius);
        s = str[n];
        context.fillText(s, 0, 0);
        context.restore();
    }
    context.restore();
}

function drawPointedArch(context, centerX, centerY, radius, angle) {
    context.save();
    context.translate(centerX, centerY);
    for(var n = 0; n < 2 * Math.PI; n += angle) {
        context.beginPath();
        context.arc(0, 0, radius, n, n + angle * 0.5);
        context.stroke();
    }
    context.restore();
}
