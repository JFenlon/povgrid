/**
 *************************************************************
 * POVGRID Custom UI function library
 * Created 04/03/2013
 *************************************************************
 * @param {*} vpAttrs_init
 */

function EventBinding()
{
    getDomElement("btnCreateDocument").on("click",CreateMainLayer(vpStage));

}

function CreateStage(vpAttrs_init) {
    var results = 0;

    try
    {
        vpAttrs_init = vpAttrs_init || vpDefaultAttrs;

        var stageParent = getDomElement('canvasContainer').parent();
        var stageWidth = stageParent.innerWidth();
        var stageHeight = stageParent.innerHeight();
        var stageDiagonal = getDistanceBetweenPoints(new Coordinate(0, 0),new Coordinate(stageWidth, stageHeight));

        vpStage = new Kinetic.Stage({
            container: "canvasContainer",
            id: 'mainStage',
            width: stageWidth,
            height: stageHeight
        });

        results = 1;
    }
    catch(e)
    {
        //LOG ERROR

        //Set results to negative
        results = -1;
    }
    finally
    {
        return results;
    }
}

function CreateMainLayer(vpStage)
{
    var vpLayer = new Kinetic.Layer();

    // This is the 'document' shape
    gridDocument.width = vpStage.width * 0.8;
    gridDocument.height = vpStage.height * 0.8;
    var kjsDocument = new Kinetic.Rect({
        x: (vpStage.width - gridDocument.width)/2,
        y: (vpStage.height - gridDocument.height)/2,
        width: gridDocument.width,
        height: gridDocument.height,
        fill: gridDocument.backgroundColor,
        stroke: 'black',
        strokeWidth: .5,
        shadow: {
            color: "black",
            blur: 10,
            offset: [10, 10],
            opacity: .5
        }
    });

    // Draw the horizon line
    var hlineY = (vpStage.getHeight() - 2) /2;
    var hlineX1 = 0;
    var hlineX2 = vpStage.getWidth();
    workspaceSettings.hLineMidPoint = (hlineX2 - hlineX1) / 2;

    var kjsHorizon = new Kinetic.Line({
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
    vp3.posX = gridDocument.height - vpAttrs_init.radius;
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
    vpLayer.add(kjsDocument);
    vpLayer.add(kjsHorizon);

    /*
     for(n=0; n<12; n++)
     {
     vpLayer.add(rotLine[n]);
     }
     */

    console.log(drawVP(vp1, vpLayer));
    console.log(drawVP(vp2, vpLayer));
    console.log(drawVP(vp3, vpLayer));
    vpStage.add(vpLayer);

    /*
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
     */

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
