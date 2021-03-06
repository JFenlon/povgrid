/**
*************************************************************
* POVGRID Custom Geometry functions definitions library
* Created 04/03/2013
*************************************************************
*/


/**
 * Returns the distance/length of a line between two coordinates
 * @param coordinate1
 * @param coordinate2
 * @returns {number}
 */
function getDistanceBetweenPoints(coordinate1, coordinate2)
{
    var mLine = new GSDesigner.LineCoordinate(coordinate1.x, coordinate1.y, coordinate2.x, coordinate2.y);
    var measuremeant = 0.0;

    try
    {
        measuremeant = Math.sqrt(((mLine.x2 - mLine.x1) * (mLine.x2 - mLine.x1)) + ((mLine.y2 - mLine.y1) * (mLine.y2 - mLine.y1)));
    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
    }
    finally
    {
        return measuremeant;
    }
}

/**
 * Returns the angle/slope of a line between 2 coordinates
 * @param lineCoords
 * @returns {number}
 */
function getAngleFromCoords(lineCoords)
{
    var angle = 0.0;

    try
    {
        var deltaX = lineCoords.x2 - lineCoords.x1;
        var deltaY = lineCoords.y2 - lineCoords.y1;

        angle =  Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    }
    catch (ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
        angle = 0;
    }
    finally
    {
       return angle;
    }
}


/**
 * Get the upper and lower bounds of the passed object (usually the rectangle page).
 * @param domObject
 * @returns {GSDesigner.LineCoordinate}
 */
function getBounds(domObject)
{
    var objBoundaries = new GSDesigner.LineCoordinate();

    try
    {
        objBoundaries.x1 = domObject.getWidth() / 2 * -1;
        objBoundaries.x2 = objBoundaries.x1 * -1;

        objBoundaries.y1 = domObject.getHeight() / 2 * -1;
        objBoundaries.y2 = objBoundaries.y1 * -1;
    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
    }
    finally
    {
        return objBoundaries;
    }
}


/**
 * Returns the points to which all grid lines should run
 * from a given vanishing point (Polygon point array).
 * -----------------------------------------------------------------
 * x1 = position of x1 point on line.
 * segmentPoints = array of points to which grid lines will run.
 * vanishingPoint = point source of grid lines (vp1, vp2 or vp3).
 * @param segmentPoints
 * @param vpX
 * @param vpY
 * @returns {Array}
 */
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
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
    }
    finally
    {
        return gPoints;
    }
}

/**
 * Returns the coordinates for a line that spans the full page
 * ---------------------------------------------------
 * cRadius = circle radius
 * ccCoords = circle center coordinates
 * lAngle = line angle in degrees
 * @param cRadius
 * @param ccCoords
 * @param lAngle
 * @returns {GSDesigner.LineCoordinate}
 */
function getAngledLineCoords(cRadius, ccCoords, lAngle)
{
    var lineCoords = new GSDesigner.LineCoordinate();

    try
    {
        var reverseAngle = lAngle + 180;

        if(reverseAngle > 360)
        {
            reverseAngle = reverseAngle - 360;
        }

        var coordsBeg = getPointsFromAngle(cRadius, ccCoords, lAngle);
        var coordsEnd = getPointsFromAngle(cRadius, ccCoords, reverseAngle);

        lineCoords.x1 = coordsBeg.x;
        lineCoords.y1 = coordsBeg.y;
        lineCoords.x2 = coordsEnd.x;
        lineCoords.y2 = coordsEnd.y;
    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
    }
    finally
    {
        return lineCoords;
    }
}


/**
 * Calculates the endpoint of a line given the
 * radius of the outer circle, center point of
 * the circle and desired angle.
 * ---------------------------------------------------
 * cRadius = circle radius
 * cXpos = circle center X point
 * cYpos = circle center Y point
 * lAngle = line angle in degrees
 * spokeAdjustment = bool, subtract 90 degrees for spoke angles
 * @param cRadius
 * @param ccCoords
 * @param lAngle
 * @returns {GSDesigner.Coordinate}
 */
function getPointsFromAngle(cRadius, ccCoords, lAngle)
{
    var resultCoords = new GSDesigner.Coordinate();

    try
    {
        var actualAngle = lAngle;

        resultCoords.x = ccCoords.x + cRadius * Math.cos(actualAngle * (Math.PI / 180));
        resultCoords.y = ccCoords.y + cRadius * Math.sin(actualAngle * (Math.PI / 180));
    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
    }
    finally
    {
        return resultCoords;
    }
}

//  Returns an array of points indicating equal distant segments along
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
    var sLine = new GSDesigner.LineCoordinate();

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
                sLine.x1 = segmentParams.staticPos;
                sLine.x2 = sLine.x1;
                sLine.y1 = segmentParams.point1;
                sLine.y2 = segmentParams.point2;
            }
            else
            {
                sLine.x1 = segmentParams.point1;
                sLine.x2 = segmentParams.point2;
                sLine.y1 = segmentParams.staticPos;
                sLine.y2 = sLine.y1;
            }

            nPoints.push(sLine.x1);
            nPoints.push(sLine.y1);

            for(var i=1; i<segmentParams.segmentCount; i++)
            {
                if(segmentParams.xIsStatic)
                {
                    sLine.x1 = segmentParams.staticPos;
                    sLine.y1 = nextPoint;
                }
                else
                {
                    sLine.x1 = nextPoint;
                    sLine.y1 = segmentParams.staticPos;
                } 

                nPoints.push(sLine.x1);
                nPoints.push(sLine.y1);
                nextPoint += segmentLength;
            }

            nPoints.push(sLine.x2);
            nPoints.push(sLine.y2);
        }
    }
    catch (ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
    }
    finally
    {
        return nPoints;
    }
}