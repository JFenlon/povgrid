/**
*************************************************************
* POVGRID Custom UI function library
* Created 04/03/2013
*************************************************************
*/

function CreateCanvas()
{
    var stageDiag = getDistanceBetweenPoints(0,800,600,0);

    vpStage = new Kinetic.Stage({
        container: "container",
        id: 'mainStage',
        width: 800,
        height: 600
    });

    vpLayer = new Kinetic.Layer();

    // This is the 'paper' shape
    var rect = new Kinetic.Rect({
        x: (800-600)/2,
        y: (600-400)/2,
        width: 600,
        height: 400,
        fill: workspaceSettings.paperColor,
        stroke: 'black',
        strokeWidth: .5,
        shadow: {
            color: "black",
            blur: 10,
            offset: [10, 10],
            opacity: .5
        }
    });

    var hlineY = (vpStage.getHeight() - 2) /2;
    var hlineX1 = 0
    var hlineX2 = vpStage.getWidth();
    workspaceSettings.hLineMidPoint = (hlineX2 - hlineX1) / 2;

    var horzLine = new Kinetic.Line({
        points: [hlineX1, hlineY, hlineX2, hlineY],
        stroke: 'green',
        strokeWidth: lineWidth,
        id: 'horzLine',
        name: 'Horizon',
        draggable: true
    });

    var vX1 = 226;
    var vX2 = 226;
    var vY1 = 190;
    var vY2 = 410;

    // Required for consistency while dragging.
    fgrLineHeight = vY2 - vY1;

    var vertLine = new Kinetic.Line({
        points: [vX1,vY1,vX2,vY2],
        stroke: 'black',
        strokeWidth: lineWidth,
        id: 'vert1',
        name: 'Vertical Line',
        draggable: false
    });


    // Concept behind this handle is that, no matter how thin a line, this acts as a larger box
    // to use to drag the line around. Mostly required for touch events. Bounding box should be
    // no smaller than 3 wide and 1.5 above and below a line. Dragging the handle with drag the
    //  line and all other lines anchored to it.
    var vHandle = new Kinetic.Rect({
        x: vX1 - workspaceSettings.touchPadding,
        y: vY1 - workspaceSettings.touchPadding,
        width: workspaceSettings.touchPadding * 2,
        height: (vY2 - vY1) + workspaceSettings.touchPadding,
        fill: 'yellow',
        stroke: 'red',
        strokeWidth: 1,
        opacity: workspaceSettings.touchOpacity,
        draggable: true
    });

    /*
     vpStage.on("touchmove", function(evt){
     var touch1 = evt.touches[0];
     var touch2 = evt.touches[1];

     if (touch1 && touch2) {
     if (startDistance === undefined) {
     startDistance = getDistance(touch1, touch2);
     }
     else {
     var dist = getDistance(touch1, touch2);
     var scale = (dist / startDistance) * startScale;
     vpStage.setScale(scale);

     // center layer
     var x = vpStage.attrs.width * (1 - scale) / 2;
     var y = vpStage.attrs.height * (1 - scale) / 2;
     layer.setPosition(x, y);

     vpStage.draw();
     }
     }
     });

     vpStage.on("touchend", function(){
     startDistance = undefined;
     startScale = vpStage.scale.x;
     });

     vertLine.on("mousemove", function() {

     console.log("x1: " + this.getPosition().x + ", y1:"+ this.getAbsolutePosition().y);
     });
     */

    // TEST
    // Set VP Params
    vp1.posX = hlineX1 + 15;
    vp1.posY = hlineY;
    vp2.posX = (vpStage.attrs.width - vp1.posX);
    vp2.posY = hlineY;

    vp3.posX = 400 - vpAttrs.radius;
    vp3.posY = hlineY;

    // Set params and pass object to getSegmentCoords
    segmentParams.staticPos = vX1;
    segmentParams.xIsStatic = true;
    segmentParams.point1 = vY1;
    segmentParams.point2 = vY2;
    segmentParams.segmentCount = 6;

    var pts = getSegmentCoords(segmentParams);
    var npts = getVPPolyGrid(pts,vp1.posX,hlineY);

    // Let's draw a grid
    var grid1 = new Kinetic.Line({
        points: npts,
        stroke: "blue",
        lineCap: "round",
        lineJoin: "round",
        strokeWidth: lineWidth
    });

    npts = getVPPolyGrid(pts,vp2.posX,hlineY);

    var grid2 = new Kinetic.Line({
        points: npts,
        stroke: "blue",
        lineCap: "round",
        lineJoin: "round",
        strokeWidth: lineWidth
    });


    /* *** TEST Rotational lines
     var endPoint = getSpokeLineCoords(stageDiag, vp3.posX, vp3.posY, Math.abs(45)); //getPointsFromAngle(stageDiag, vp3.posX, vp3.posY, 45)
     var rotLine = new Kinetic.Line({
     points: [endPoint.x1,endPoint.y1,endPoint.x2,endPoint.y2],
     stroke: 'red',
     strokeWidth: 1,
     id: 'rotLine',
     name: 'Rotational Line',
     draggable: false
     });
     */
    var rotLine = new Array();
    var ang=0;
    for(var n=0; n<12; n++)
    {
        var endPoint = getSpokeLineCoords(stageDiag, vp3.posX, vp3.posY, Math.abs(ang)); //getPointsFromAngle(stageDiag, vp3.posX, vp3.posY, 45)
        var line = new Kinetic.Line({
            points: [endPoint.x1,endPoint.y1,endPoint.x2,endPoint.y2],
            stroke: 'red',
            strokeWidth: .5,
            opacity: 0.6,
            id: 'rotLine',
            name: 'Rotational Line',
            draggable: false
        });

        rotLine.push(line);
        ang += 20;
    }

    // add the shape to the layer
    vpLayer.add(rect);
    vpLayer.add(grid1);
    vpLayer.add(grid2);
    vpLayer.add(horzLine);
    vpLayer.add(vertLine);
    vpLayer.add(vHandle);
    for(n=0; n<12; n++)
    {
        vpLayer.add(rotLine[n]);
    }

    console.log(drawVP(vp1, vpLayer));
    console.log(drawVP(vp2, vpLayer));
    console.log(drawVP(vp3, vpLayer));
    vpStage.add(vpLayer);

    // animation ** Allows drag and move of multiple shapes
    var anim = new Kinetic.Animation({

        func: function(frame){

            // For some reason, the getPosition coords must add/subtract the original start position as an offset.
            vertLine.setPosition((vHandle.getPosition().x -  vertLine.getPoints()[0].x) + workspaceSettings.touchPadding, (vHandle.getPosition().y -  vertLine.getPoints()[0].y) + workspaceSettings.touchPadding);

            // Set vanishing point positions
            var vPoint1 = vpLayer.get('#vp1')[0];
            var vPoint2 = vpLayer.get('#vp2')[0];
            vp1.posY = vPoint1.getPosition().y;
            vp1.posX = vPoint1.getPosition().x;
            vp2.posY = vPoint1.getPosition().y;
            vp2.posX = vPoint2.getPosition().x;
            hlineY = vp1.posY;

            // Set params and pass object to getSegmentCoords
            segmentParams.staticPos = vertLine.getPosition().x + vertLine.getPoints()[0].x;
            segmentParams.xIsStatic = true;
            segmentParams.point1 = vertLine.getPosition().y + vertLine.getPoints()[0].y;
            segmentParams.point2 = ((vertLine.getPosition().y + vertLine.getPoints()[0].y) + fgrLineHeight);

            var pts2 = getSegmentCoords(segmentParams);
            var newPts = getVPPolyGrid(pts2,vp1.posX,hlineY);
            grid1.setPoints(newPts);

            newPts = getVPPolyGrid(pts2,vp2.posX,hlineY);

            grid2.setPoints(newPts);

            var horzPts =[hlineX1,vp1.posY,hlineX2,vp1.posY];

            horzLine.setPoints(horzPts);
            vPoint2.setPosition(vPoint2.getPosition().x, vp1.posY);
        },

        node:vpLayer

    });

    anim.start();

    $("#sldrRotation").bind( "change", function(event, ui) {
        var rotDegree = Math.abs(this.value);
        var vPoint3 = vpLayer.get('#vp3')[0];

        // Call function to rotate line around point
        var endPoints = getSpokeLineCoords(stageDiag, vPoint3.getPosition().x, vPoint3.getPosition().y, rotDegree);
        if(endPoints)
        {
            //rotLine.setPoints(vPoint3.getPosition().x, vPoint3.getPosition().y, endPoints.x, endPoints.y);
            rotLine[0].setPoints([endPoints.x1,endPoints.y1,endPoints.x2,endPoints.y2]);
        }
        //console.log(rotDegree);
    });
};
