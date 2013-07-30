/**
 *************************************************************
 * POVGRID Custom UI function library
 * Created 04/03/2013
 *************************************************************
 *
 */

function EventBinding()
{
    $("#btnCreateDocument").bind("click", AddNewDocument);
    $("#btnVanishPoint1").bind("click", function(){
        ShowVanishingPoint(PovGridDesigner.shapeIdEnum.VP1);
    });

    $( "#sldLineDensity" ).bind( "change", function(event, ui) {
        // set line density property

        UpdateLineDensity();
    });
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
 *
 * @vanishing point enumID
 */
function ShowVanishingPoint(shapeEnumId)
{
    try
    {
        if(PovGridDesigner.NodeExists(PovGridDesigner.shapeId[shapeEnumId]))
        {
            // just make it visible
        }
        else
        {
            // we need to create it
            var shapeCoords = new PovGridDesigner.Coordinate();

            switch(shapeEnumId)
            {
                case PovGridDesigner.shapeIdEnum.VP1:
                    //place on horizon, to left of document
                    var horizon = PovGridDesigner.GetNode(PovGridDesigner.shapeId[PovGridDesigner.shapeIdEnum.Horizon]);
                    var document = PovGridDesigner.GetNode(PovGridDesigner.shapeId[PovGridDesigner.shapeIdEnum.Document]);

                    shapeCoords.y = horizon.getAttrs().points[0].y;
                    shapeCoords.x = document.getPosition().x + PovGridDesigner.VPAttributes.radius;

                    CreateVanishingPoint(shapeCoords, PovGridDesigner.MainLayer, shapeEnumId, 0);

                    CreateVanishingPointGrid(shapeEnumId);

                case PovGridDesigner.shapeIdEnum.VP2:
                    //place on horizon, to right of document

                case PovGridDesigner.shapeIdEnum.VP3:
                    //place in center, bottom of document

            }
        }
    }
    catch (ex)
    {
        // Generic error
        LogError(ex.message);
    }
}

/**
 * Dev creation method
 */
function AddNewDocument()
{
    try
    {
        // Clear existing document
        PovGridDesigner.MainStage.clear();

        //PovGridDesigner.TouchLayer.setZIndex(1);

        var docSettings = new PovGridDesigner.DocumentObject(1024, 400);

        if(CreateDocument(docSettings) < 0)
            throw new EvalError("create-main_layer-failed");

        EnableGroupDragability();

    }
    catch(ex)
    {
        if (ex instanceof EvalError) {
            LogError(ex.message);
        }
        else
        {
            // Generic error
            LogError(ex.message);
        }
    }
    finally
    {

    }
}

/**
 *
 * @param initialCoords
 * @param baseLayer
 * @param enumId
 * @returns {boolean}
 */
function CreateVanishingPoint(shapeCoords, layerObject, enumId, zIndex)
{
    var isSuccess = false;

    try
    {
        if(PovGridDesigner.MainStage != undefined)
        {
            var vPoint = new Kinetic.Circle({
                x: shapeCoords.x,
                y: shapeCoords.y,
                radius: PovGridDesigner.VPAttributes.radius,
                fill: PovGridDesigner.VPAttributes.fillColor,
                stroke: PovGridDesigner.VPAttributes.strokeColor,
                strokeWidth: PovGridDesigner.VPAttributes.strokeWidth,
                opacity: PovGridDesigner.VPAttributes.opacity,
                id: PovGridDesigner.shapeId[enumId],
                name: 'Vanishing Point',
                visible: true,
                draggable: false
            });

            //Each shape requires a layer !!!
            var kjsGroup = new Kinetic.Group({
               id: PovGridDesigner.groupId[PovGridDesigner.groupIdEnum.VanishPoint1],
               draggable: true
            });

            kjsGroup.add(vPoint);
            PovGridDesigner.MainLayer.add(kjsGroup);

            PovGridDesigner.MainStage.on('mouseup', function(evt){
                //var shape = evt.target;

                PovGridDesigner.MainLayer.draw();
            });

            PovGridDesigner.MainStage.on('mousedown', function(evt){
                PovGridDesigner.MainLayer.draw();
            });

            isSuccess = true;
        }
    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message);
    }
    finally
    {
        return isSuccess;
    }
}



/**
 * @return {number}
 */
function SetupStage()
{
    var results = 0;

    try
    {
        var stageParent = getDomElement('divContent');
        var stageWidth = stageParent.clientWidth;
        var stageHeight = stageParent.clientHeight;

        PovGridDesigner.MainStage = new Kinetic.Stage({
            container: "canvasContainer",
            id: 'stgMain',
            width: stageWidth,
            height: stageHeight - 30
        });

        PovGridDesigner.MainLayer = new Kinetic.Layer({
            id: 'lyrMain'
        });

        PovGridDesigner.BaseLayer = new Kinetic.Layer({
            id: 'lyrBase'
        });

        PovGridDesigner.TouchLayer = new Kinetic.Layer({
            id: 'lyrTouch'
        });

        PovGridDesigner.MainStage.add(PovGridDesigner.BaseLayer);
        PovGridDesigner.MainStage.add(PovGridDesigner.MainLayer);
        PovGridDesigner.MainStage.add(PovGridDesigner.TouchLayer);

        results = 1;
    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message + '[setupStage]');
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
function CreateDocument(docInit)
{
    var results = 0;

    try
    {
        var documentObj = (typeof docInit === "undefined") ? new PovGridDesigner.DocumentObject(docInit) : docInit;

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
            name: documentObj.name,
            x: (PovGridDesigner.MainStage.attrs.width - documentObj.width) / 2,
            y: (PovGridDesigner.MainStage.attrs.height - documentObj.height) / 2,
            width: documentObj.width,
            height: documentObj.height,
            fill: documentObj.backgroundColor,
            stroke: documentObj.strokeColor,
            strokeWidth: documentObj.strokeWidth,
            shadowColor: documentObj.strokeColor,
            shadowBlur: documentObj.shadowBlur,
            shadowOffset: documentObj.shadowOffset,
            shadowOpacity: documentObj.shadowOpacity,
            shadowEnabled: documentObj.shadowEnabled
        });

        // Draw the horizon line
        var hlineY = (PovGridDesigner.MainStage.getHeight() - 2) /2;
        var hlineX1 = 0;
        var hlineX2 = PovGridDesigner.MainStage.getWidth();
        PovGridDesigner.WorkspaceSettings.hLineMidPoint = (hlineX2 - hlineX1) / 2;

        var kjsHorizon = new Kinetic.Line({
            points: [hlineX1, hlineY, hlineX2, hlineY],
            stroke: 'green',
            strokeWidth: PovGridDesigner.GeneralShapeAttributes.strokeWidth,
            id: PovGridDesigner.shapeId[PovGridDesigner.shapeIdEnum.Horizon],
            name: 'horizon',
            draggable: false
        });

        // add the shape to the group
        kjsMainGroup.add(kjsDocument);
        kjsMainGroup.add(kjsHorizon);

        // add the group to the layer
        PovGridDesigner.BaseLayer.add(kjsMainGroup);

        //PovGridDesigner.BaseLayer.setZIndex(0);

        PovGridDesigner.MainStage.draw();

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

function UpdateLineDensity()
{
    var results = 0;

    try
    {
        var perspGroup = Object.create(null);
        var vpGroup = Object.create(null);
        var lineCount = 5;
        var angleIncrement = 360 / (lineCount * 2);
        var stageDiag = getDistanceBetweenPoints(new PovGridDesigner.Coordinate(0,PovGridDesigner.MainStage.getHeight()), new PovGridDesigner.Coordinate(PovGridDesigner.MainStage.getWidth(),0));

        for(var g = 1; g < 3; g++)
        {
            perspGroup = PovGridDesigner.GetNode("gpPerspLines" + g);

            perspGroup.removeChildren();

            var vanishingPoint = PovGridDesigner.GetNode("shpVP...");
            var perspectiveLine = new Array();
            var angle = 0;
            var gridLineColor = PovGridDesigner.getNextGridLineColor();

            for(var n = 0; n < lineCount; n++)
            {
                var endPoint = getSpokeLineCoords(stageDiag, new PovGridDesigner.Coordinate(vanishingPoint.getPosition().x, vanishingPoint.getPosition().y), Math.abs(angle));

                var line = new Kinetic.Line({
                    points: [endPoint.x1,endPoint.y1,endPoint.x2,endPoint.y2],
                    stroke: gridLineColor,
                    strokeWidth: PovGridDesigner.GeneralShapeAttributes.strokeWidth,
                    opacity: 0.5,
                    id: 'perpectiveLines' + n,
                    draggable: false
                });

                perspectiveLine.push(line);
                angle += angleIncrement;
            }

            // add the lines to the group
            for(n = 0; n < lineCount; n++)
            {
                perspGroup.add(perspectiveLine[n]);
            }

            vpGroup.add(perspGroup);
            perspGroup.setVisible(true);
            perspGroup.setZIndex(0);
        }

        PovGridDesigner.MainStage.draw();
    }
    catch (ex)
    {
        //LOG ERROR
        LogError(ex.message + '[' + arguments.callee.name + ']');
        //Set results to negative
        results = -1;
    }
    finally
    {
        return results;
    }
}

/**
 *
 * @param vpEnumId
 */
function CreateVanishingPointGrid(vpEnumId)
{
    var results = 0;

    try
    {
        var perspGroup = Object.create(null);
        var vpGroup = Object.create(null);
        var lineCount = parseInt($("#slider-12").val());
        var angleIncrement = 360 / (lineCount * 2);

        switch(vpEnumId)
        {
            case PovGridDesigner.shapeIdEnum.VP1:
                perspGroup = PovGridDesigner.GetNode(PovGridDesigner.groupId[PovGridDesigner.groupIdEnum.PerspLines1]);
                vpGroup = PovGridDesigner.GetNode(PovGridDesigner.groupId[PovGridDesigner.groupIdEnum.VanishPoint1]);
                break;
            case PovGridDesigner.shapeIdEnum.VP2:
                // TODO
                break;
            case PovGridDesigner.shapeIdEnum.VP3:
                // TODO
                break;
        }

        var vanishingPoint = PovGridDesigner.GetNode(PovGridDesigner.shapeId[vpEnumId]);
        var stageDiag = getDistanceBetweenPoints(new PovGridDesigner.Coordinate(0,PovGridDesigner.MainStage.getHeight()), new PovGridDesigner.Coordinate(PovGridDesigner.MainStage.getWidth(),0));
        var perspectiveLine = new Array();
        var angle = 0;
        var gridLineColor = PovGridDesigner.getNextGridLineColor();

        for(var n = 0; n < lineCount; n++)
        {
            var endPoint = getSpokeLineCoords(stageDiag, new PovGridDesigner.Coordinate(vanishingPoint.getPosition().x, vanishingPoint.getPosition().y), Math.abs(angle));

            var line = new Kinetic.Line({
                points: [endPoint.x1,endPoint.y1,endPoint.x2,endPoint.y2],
                stroke: gridLineColor,
                strokeWidth: PovGridDesigner.GeneralShapeAttributes.strokeWidth,
                opacity: 0.5,
                id: 'perpectiveLines' + n,
                draggable: false
            });

            perspectiveLine.push(line);
            angle += angleIncrement;
        }

        // add the lines to the group
        for(n = 0; n < lineCount; n++)
        {
            perspGroup.add(perspectiveLine[n]);
        }

        vpGroup.add(perspGroup);
        perspGroup.setVisible(true);
        perspGroup.setZIndex(0);

        PovGridDesigner.MainStage.draw();
    }
    catch (ex)
    {
        //LOG ERROR
        LogError(ex.message);
        results = -1;
    }
    finally
    {
        return results;
    }
}

/**
 * @returns {number}
 */
function CreateRequiredGroups()
{
    var results = 0;

    try
    {
        for(var i = 0; i < PovGridDesigner.groupId.length; i++)
        {
            if(PovGridDesigner.groupId[i] != PovGridDesigner.groupId[PovGridDesigner.groupIdEnum.Main])
            {
                var group = new Kinetic.Group({
                    id: PovGridDesigner.groupId[i],
                    draggable: false
                });

                PovGridDesigner.MainLayer.add(group);
            }
        }
    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message);
        results = -1;
    }
    finally
    {
        return results;
    }
}

function EnableGroupDragability()
{
    try
    {
        var vp1 = PovGridDesigner.GetNode(PovGridDesigner.groupId[PovGridDesigner.groupIdEnum.VanishPoint1]);
        var vp2 = PovGridDesigner.GetNode(PovGridDesigner.groupId[PovGridDesigner.groupIdEnum.VanishPoint2]);
        var vp3 = PovGridDesigner.GetNode(PovGridDesigner.groupId[PovGridDesigner.groupIdEnum.VanishPoint3]);

        vp1.draggable = true;
        vp2.draggable = true;
        vp3.draggable =true;
    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message);
    }
}

function CreateTouchLayer()
{
    var results = 0;

    try
    {
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
        PovGridDesigner.TouchLayer.add(kjsTouchCircle);

        // use event delegation
        PovGridDesigner.MainStage.on('mousedown touchstart', function(evt) {
            PovGridDesigner.TouchLayer.clear();
            kjsTouchCircle.setVisible(true);
            kjsTouchCircle.setPosition(evt.layerX, evt.layerY);
            kjsTouchCircle.draw();
            //anim.start();
        });

        kjsTouchCircle.on('mousedown mouseout', function(evt) {
            PovGridDesigner.TouchLayer.clear();
        });

        PovGridDesigner.MainStage.on('mouseup touchend', function(evt) {
            PovGridDesigner.TouchLayer.clear();
        });

    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message);
        results = -1;
    }
    finally
    {
        return results;
    }
}

