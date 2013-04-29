/**
 *************************************************************
 * POVGRID Custom UI function library
 * Created 04/03/2013
 *************************************************************
 * @param {*} vpAttrs_init
 */

function CreateCanvas(vpAttrs_init) {
    vpAttrs_init = vpAttrs_init || vpDefaultAttrs;

    var stageParent = $("#canvasContainer").parent();
    var stageWidth = stageParent.innerWidth();
    var stageHeight = stageParent.innerHeight();
    var stageDiagonal = getDistanceBetweenPoints(new Coordinate(0, 0),new Coordinate(stageWidth, stageHeight));

    vpStage = new Kinetic.Stage({
        container: "canvasContainer",
        id: 'mainStage',
        width: stageWidth,
        height: stageHeight
    });

    var vpLayer = new Kinetic.Layer();

    // This is the 'paper' shape
    var paperWidth = stageWidth * 0.8;
    var paperHeight = stageHeight * 0.8;
    var gridPaper = new Kinetic.Rect({
        x: (stageWidth-paperWidth)/2,
        y: (stageHeight-paperHeight)/2,
        width: paperWidth,
        height: paperHeight,
        fill: workspaceSettings.documentColor,
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
    var hlineX1 = 0;
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

    /* *** TEST Rotational lines
     var endPoint = getSpokeLineCoords(stageDiagonal, vp3.posX, vp3.posY, Math.abs(45)); //getPointsFromAngle(stageDiagonal, vp3.posX, vp3.posY, 45)
     var rotLine = new Kinetic.Line({
     points: [endPoint.x1,endPoint.y1,endPoint.x2,endPoint.y2],
     stroke: 'red',
     strokeWidth: 1,
     id: 'rotLine',
     name: 'Rotational Line',
     draggable: false
     });
     */
    vp3.posX = paperHeight - vpAttrs_init.radius;
    vp3.posY = hlineY;
    var rotLine = [];
    var ang=0;
    for(var n=0; n<12; n++)
    {
        var endPoint = getSpokeLineCoords(stageDiagonal, vp3.posX, vp3.posY, Math.abs(ang)); //getPointsFromAngle(stageDiagonal, vp3.posX, vp3.posY, 45)
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
    vpLayer.add(gridPaper);
    vpLayer.add(horzLine);
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


        func: function (frame) {

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

    $("#sldrRotation").bind("change", function () {
        var rotDegree = Math.abs(this.value);
        var vPoint3 = vpLayer.get('#vp3')[0];

        // Call function to rotate line around point
        var endPoints = getSpokeLineCoords(stageDiagonal, vPoint3.getPosition().x, vPoint3.getPosition().y, rotDegree);
        if(endPoints)
        {
            //rotLine.setPoints(vPoint3.getPosition().x, vPoint3.getPosition().y, endPoints.x, endPoints.y);
            rotLine[0].setPoints([endPoints.x1,endPoints.y1,endPoints.x2,endPoints.y2]);
        }
        //console.log(rotDegree);
    });
}
