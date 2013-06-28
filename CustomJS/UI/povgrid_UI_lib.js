/**
 *************************************************************
 * POVGRID Custom UI function library
 * Created 04/03/2013
 *************************************************************
 *
 */

function EventBinding()
{
    $("#btnCreateDocument").bind("click", CreateMainLayer);

}

function SetCanvasElementHeight()
{
    var divHeader = getDomElement('divHeader');
    var divGrid = getDomElement('divTopGrid');
    var divContent = getDomElement('divContent');

    divContent.style.height = (getDocumentHeight() - divHeader.clientHeight - divGrid.clientHeight) - 35;
    divContent.style.maxHeight = divContent.style.height;
}

/**
 * @return {number}
 */
function CreateStage()
{
    var results = 0;

    try
    {
        var stageParent = getDomElement('divContent');
        var stageWidth = stageParent.clientWidth;
        var stageHeight = stageParent.clientHeight;
        //var stageDiagonal = getDistanceBetweenPoints(new Coordinate(0, 0),new Coordinate(stageWidth, stageHeight));

        vpStage = new Kinetic.Stage({
            container: "canvasContainer",
            id: 'mainStage',
            width: stageWidth,
            height: stageHeight - 30
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

/**
 * @return {number}
 */
function CreateMainLayer(vpAttrs_init)
{
    var results = 0;

    try
    {
        var documentObj = new DocumentObject();
        var vpLayer = new Kinetic.Layer();
        var fldWidth = getDomElement('tbWidth');
        var fldHeight =  getDomElement('tbHeight');
        if(fldWidth.value.length != 0 && fldHeight.value.length != 0)
        {
            documentObj.width = fldWidth.value;
            documentObj.height = fldHeight.value;
        }

        vpAttrs_init = vpAttrs_init || vpDefaultAttrs;

        var mainGroup = new Kinetic.Group({
            id: 'mainGroup',
            draggable: false
        });

        // This is the 'document' shape
        var kjsDocument = new Kinetic.Rect({
            x: (vpStage.attrs.width - documentObj.width) / 2,
            y: (vpStage.attrs.height - documentObj.height) / 2,
            width: documentObj.width,
            height: documentObj.height,
            fill: documentObj.backgroundColor,
            stroke: 'black',
            strokeWidth: .5,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: [10, 10],
            shadowOpacity: .5,
            shadowEnabled: true
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
            draggable: false
        });

        // add the shape to the layer
        mainGroup.add(kjsDocument);
        mainGroup.add(kjsHorizon);

        vpLayer.add(mainGroup);

        // add the layer to the stage
        vpStage.add(vpLayer);

        results = 1;
    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message);
        //Set results to negative
        results = -1;
    }
    finally
    {
        return results;
    }
}
