/**
 *************************************************************
 * POVGRID Custom UI function library
 * Created 04/03/2013
 *************************************************************
 * @param {*} vpAttrs_init
 */

function EventBinding()
{
    $("#btnCreateDocument").bind("click", CreateMainLayer);

}

function CreateStage()
{
    var results = 0;

    try
    {
        var stageParent = getDomElement('canvasContainer').parentElement;
        var stageWidth = stageParent.clientWidth;
        var stageHeight = stageParent.clientHeight;
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

        // This is the 'document' shape
        var kjsDocument = new Kinetic.Rect({
            x: (vpStage.attrs.width - documentObj.width) / 2,
            y: (vpStage.attrs.height - documentObj.height) / 2,
            width: documentObj.width,
            height: documentObj.height,
            fillRgb: documentObj.backgroundColor,
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

        // add the shape to the layer
        vpLayer.add(kjsDocument);
        vpLayer.add(kjsHorizon);

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
