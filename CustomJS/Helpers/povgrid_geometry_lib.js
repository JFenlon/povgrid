/**
*************************************************************
* POVGRID Custom Geometry functions definitions library
* Created 04/03/2013
*************************************************************
*/

//   Returns the distance/length of a line between two coordinates
//  [Returns: decimal]
function getDistanceBetweenPoints(coordinate1, coordinate2)
{
    var x1 = coordinate1.x;
    var x2 = coordinate2.x;
    var y1 = coordinate1.y;
    var y2 = coordinate2.y;

    return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
}

//   Draw the vanishing point on the current stage and returns a success status
//   [Returns: bool]
function drawVP(vanishingPoint, baseLayer)
{
    var isSuccess = false;

    try
    {
        if(vpStage != undefined)
        {
            var vpoint = new Kinetic.Circle({
                x: vanishingPoint.posX,
                y: vanishingPoint.posY,
                radius: vpAttrs.radius,
                fill: vpAttrs.fillColor,
                stroke: vpAttrs.strokeColor,
                strokeWidth: vpAttrs.strokeWidth,
                opacity: vpAttrs.opacity,
                id: vanishingPoint.id,
                name: 'Vanishing Point',
                draggable: true
            });

            baseLayer.add(vpoint);
            isSuccess = true;
        }
    }
    catch(err)
    {
        console.log(err);
    }

    return isSuccess;
}

//   Get the upper and lower bounds of the passed object (usually the rectangle page).
//   [Returns: decimal object of (x1,y1,x2,y2)]
function getBounds(domObject)
{
    var objBoundaries = [{
        "x1" : 0,
        "x2" : 0,
        "y1" : 0,
        "y2" : 0
    }];

    objBoundaries.x1 = domObject.getWidth() / 2 * -1;
    objBoundaries.x2 = objBoundaries.x1 * -1;

    objBoundaries.y1 = domObject.getHeight() / 2 * -1;
    objBoundaries.y2 = objBoundaries.y1 * -1;

    return objBoundaries;
}

//   Returns the points to which all grid lines should run
//   from a given vanishing point (Polygon point array).
//-----------------------------------------------------------------
//   x1 = position of x1 point on line.
//   segmentPoints = array of points to which grid lines will run.
//   vanishingPoint = point source of grid lines (vp1, vp2 or vp3).
//   [Returns: decimal array]
function getVPPolyGrid(segmentPoints, vpX, vpY)
{
    var gPoints = [];
    var addCnt = 0;

    try
    {
        if(segmentPoints.length > 0)
        {
            for(var i = 0; i <= segmentPoints.length; i++)
            {
                if(addCnt == 2)
                {
                    gPoints.push(vpX);
                    gPoints.push(vpY);
                    addCnt = 0;
                }
                gPoints.push(segmentPoints[i]);
                addCnt ++;                                                         
            }
        }
    }
    catch(err)
    {
        console.log(err);
    }

    return gPoints;
}

//   Returns the coordinates for a line that spans the full page
// ---------------------------------------------------
//   cRadius = circle radius
//   cXpos = circle center X point
//   cYpos = circle center Y point
//   lAngle = line angle in degrees
//   [Returns: decimal object of (x1,y1,x2,y2)]
function getSpokeLineCoords(cRadius, cXpos, cYpos, lAngle)
{
    var lineCoords = [{"x1": 0,"y1": 0, "x2" : 0, "y2" : 0}];
    var reverseAngle = lAngle + 180;

    if(reverseAngle > 360)
    {
        reverseAngle = reverseAngle - 360;
    }

    var coordsBeg = getPointsFromAngle(cRadius, cXpos, cYpos,lAngle);
    var coordsEnd = getPointsFromAngle(cRadius, cXpos, cYpos, reverseAngle);

    lineCoords.x1 = coordsBeg.x;
    lineCoords.y1 = coordsBeg.y;
    lineCoords.x2 = coordsEnd.x;
    lineCoords.y2 = coordsEnd.y;

    return lineCoords;
}

//   Calculates the endpoint of a line given the
//   radius of the outer circle, center points of
//   the circle and desired angle.
// ---------------------------------------------------
//   cRadius = circle radius
//   cXpos = circle center X point
//   cYpos = circle center Y point
//   lAngle = line angle in degrees
//   [Returns: decimal object of (x,y)]
function getPointsFromAngle(cRadius, cXpos, cYpos, lAngle)
{
    var newCoords = [{"x": 0,"y": 0}];
    var actualAngle = lAngle - 90;

    newCoords.x = cXpos + cRadius * Math.cos(actualAngle * (Math.PI / 180));
    newCoords.y = cYpos + cRadius * Math.sin(actualAngle * (Math.PI / 180));

    return newCoords;
}

//  Returns an array of points indicating a segment along
//  a straight line.
//  Breaking a line into 4 segments returns 4 coordinates
//---------------------------------------------------------
//  point1 = starting point of line,
//  point2 = ending point of line,
//  segmentCount = number of points required on line
//  [Returns: decimal array]
function getSegmentCoords(segmentParams)
{
    var nPoints = [];
    var x1, x2, y1, y2;

    try
    {
        var lineLength = Math.round(segmentParams.point2 - segmentParams.point1);
        var segmentLength = 0;

        if(lineLength > 0 && segmentParams.segmentCount > 1)
        {
            segmentLength = Math.floor(lineLength / segmentParams.segmentCount);
            var nextPoint= segmentParams.point1 + segmentLength;

            if(segmentParams.xIsStatic)
            {
                x1 = segmentParams.staticPos;
                x2 = x1;
                y1 = segmentParams.point1;
                y2 = segmentParams.point2;
            }
            else
            {
                x1 = segmentParams.point1;
                x2 = segmentParams.point2;
                y1 = segmentParams.staticPos;
                y2 = y1;
            }

            nPoints.push(x1);
            nPoints.push(y1);

            for(var i=1; i<segmentParams.segmentCount; i++)
            {
                if(segmentParams.xIsStatic)
                {
                    x1 = segmentParams.staticPos;
                    y1 = nextPoint;
                }
                else
                {
                    x1 = nextPoint;
                    y1 = segmentParams.staticPos;
                } 

                nPoints.push(x1);
                nPoints.push(y1);
                nextPoint += segmentLength;
            }

            nPoints.push(x2);
            nPoints.push(y2);
        }
    }
    catch (err)
    {
        console.log(err);                
    }

    return nPoints;
}