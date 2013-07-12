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

        PovGridDesigner.MainStage = new Kinetic.Stage({
            container: "canvasContainer",
            id: 'mainStage',
            width: stageWidth,
            height: stageHeight - 30
        });

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

/**
 * @return {number}
 */
function CreateMainLayer(docAttrs_init)
{
    var results = 0;

    try
    {
        var documentObj = new PovGridDesigner.DocumentObject();
        var kjsLayer = new Kinetic.Layer({
            id: PovGridDesigner.MainLayer
        });

        // Grab default attributes if none are passed in
        docAttrs_init = docAttrs_init || PovGridDesigner.DefaultAttributes;

        /** document size input */
        var fldWidth = getDomElement('tbWidth');
        var fldHeight =  getDomElement('tbHeight');

        if(fldWidth.value.length != 0 && fldHeight.value.length != 0)
        {
            documentObj.width = fldWidth.value;
            documentObj.height = fldHeight.value;
        }

        var kjsMainGroup = new Kinetic.Group({
            id: PovGridDesigner.groupId[PovGridDesigner.groupIdEnum.Main],
            draggable: false
        });

        // This is the 'document' shape
        var kjsDocument = new Kinetic.Rect({
            id: PovGridDesigner.shapeId[PovGridDesigner.shapeIdEnum.Document],
            name: 'document',
            x: (PovGridDesigner.MainStage.attrs.width - documentObj.width) / 2,
            y: (PovGridDesigner.MainStage.attrs.height - documentObj.height) / 2,
            width: documentObj.width,
            height: documentObj.height,
            fill: documentObj.backgroundColor,
            stroke: 'black',
            strokeWidth: PovGridDesigner.DefaultAttributes.strokeWidth,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: [10, 10],
            shadowOpacity: .5,
            shadowEnabled: true
        });

        // Draw the horizon line
        var hlineY = (PovGridDesigner.MainStage.getHeight() - 2) /2;
        var hlineX1 = 0;
        var hlineX2 = PovGridDesigner.MainStage.getWidth();
        PovGridDesigner.workspaceSettings.hLineMidPoint = (hlineX2 - hlineX1) / 2;

        var kjsHorizon = new Kinetic.Line({
            points: [hlineX1, hlineY, hlineX2, hlineY],
            stroke: 'green',
            strokeWidth: PovGridDesigner.DefaultAttributes.strokeWidth,
            id: PovGridDesigner.shapeId[PovGridDesigner.shapeIdEnum.Horizon],
            name: 'horizon',
            draggable: false
        });

        // add the shape to the group
        kjsMainGroup.add(kjsDocument);
        kjsMainGroup.add(kjsHorizon);

        // add the group to the layer
        kjsLayer.add(kjsMainGroup);

        // add the layer to the stage
        PovGridDesigner.MainStage.add(kjsLayer);

        var tLayer = PovGridDesigner.GetNode(PovGridDesigner.TouchLayer);
        tLayer.setZIndex(1);

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

function CreateTouchLayer()
{
    try
    {
        var kjsLayer = new Kinetic.Layer({
            id: PovGridDesigner.TouchLayer
        });

        var kjsTouchCircle = new Kinetic.Circle({
            x: 665,
            y: 255,
            radius: 30,
            fill: 'red',
            stroke: 'gray',
            opacity: 0.4,
            strokeWidth: 2,
            visible: false
        });

        // add the shape to the layer
        kjsLayer.add(kjsTouchCircle);

        // add the layer to the stage
        PovGridDesigner.MainStage.add(kjsLayer);

        // use event delegation
        PovGridDesigner.MainStage.on('mousedown touchstart', function(evt) {
            kjsLayer.clear();
            kjsTouchCircle.setVisible(true);
            kjsTouchCircle.setPosition(evt.layerX, evt.layerY);
            kjsTouchCircle.draw();
            //anim.start();
        });

        kjsTouchCircle.on('mousedown mouseout', function(evt) {

            kjsLayer.clear();
        });

        PovGridDesigner.MainStage.on('mouseup touchend', function(evt) {
            kjsLayer.clear();
        });

    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message);
    }
    finally
    {

    }
}
