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
        ToggleVanishPoint(PovGridDesigner.shapeIdEnum.VP1);
    });
    $("#btnVanishPoint2").bind("click", function(){
        ToggleVanishPoint(PovGridDesigner.shapeIdEnum.VP2);
    });
    $("#btnVanishPoint3").bind("click", function(){
        ToggleVanishPoint(PovGridDesigner.shapeIdEnum.VP3);
    });

    $( "#sldLineDensity" ).bind( "change", function(event) {
        // set line density property
        PovGridDesigner.setLineDensity(event.target.value);

        UpdateLineDensity();
    });
    $( "#sldLineOpacity" ).bind( "change", function(event) {
        // set line opacity property
        PovGridDesigner.setLineOpacity(event.target.value / 100);

        UpdateLineOpacity();
    });

    $("#btnCycleColors").bind("click", function(){
        PovGridDesigner.incrementGridColorIndex();

        //Force grid lines to take on new colors
        UpdateGridLineColors();
    });

}

function disableSelection(target){
    if (typeof target.onselectstart!="undefined") //IE route
        target.onselectstart=function(){return false;}
    else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
        target.style.MozUserSelect="none";
    else //All other route (ie: Opera)
        target.onmousedown=function(){return false;}
    target.style.cursor = "default";
}

/**
 * Adjust area to device screen size
 */
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
function ToggleVanishPoint(shapeEnumId)
{
    try
    {
        if(PovGridDesigner.NodeExists(PovGridDesigner.groupId[shapeEnumId]))
        {
            var group = PovGridDesigner.GetNode(PovGridDesigner.groupId[shapeEnumId]);

            group.setVisible(!group.getVisible());
            PovGridDesigner.MainLayer.draw();
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

        /** DEV ONLY */
        CreateDebugWindow();

        var docSettings = GetNewDocSettings() || new PovGridDesigner.DocumentObject(1024, 400);

        SetFieldData('txtDocSize', docSettings.width +  ' X ' + docSettings.height);

        if(CreateDocument(docSettings) < 0)
            throw new EvalError("create-main_layer-failed");

        if(GenerateVanishingPoints() < 0)
            throw new EvalError("generate-vpoints-failed");

    }
    catch(ex)
    {
        if (ex instanceof EvalError) {
            //LOG ERROR
            LogError(ex.message + ' [' + arguments.callee.name + ']');
            //Set results to negative
            results = -1;
        }
        else
        {
            // Generic error
            LogError(ex.message + ' [' + arguments.callee.name + ']');
            //Set results to negative
            results = -1;
        }
    }
    finally
    {

    }
}

function GetNewDocSettings()
{
    var docSettings = Object.create(null);

    try
    {
        // This will change when the UI is more polished.
        var width = getDomElement('tbWidth').value;
        var height = getDomElement('tbHeight').value;

        if((width == null || width.trim() == "") || (height == null || height.trim() == "") )
        {
            delete docSettings;
            docSettings =  null;
        }
        else
        {
            docSettings = new PovGridDesigner.DocumentObject(width, height);
        }
    }
    catch (ex)
    {
        // Generic error
        LogError(ex.message + ' [' + arguments.callee.name + ']');
    }
    finally
    {
        return docSettings;
    }
}

/**
 * DEV ONLY!!!
 */
function CreateDebugWindow()
{
    /** TEST CODE */
    var label = new Kinetic.Label({
        x: 15,
        y: 320,
        height: 400,
        opacity: 0.8,
        draggable: true
    });

    // add a tag to the label
    label.add(new Kinetic.Tag({
        fill: '#bbb',
        stroke: '#333',
        lineJoin: 'round',
        pointerDirection: 'left',
        pointerWidth: 0,
        pointerHeight: 0,
        cornerRadius: 5
    }));



    // Literals
    label.add(new Kinetic.Text({
        text: 'Development Details',
        fontFamily: 'Courier',
        fontStyle: 'bold',
        fontSize: 20,
        lineHeight: 1.2,
        padding: 10,
        fill: 'green',
        width: 350,
        height: 600
    }));

    label.add(new Kinetic.Text({
        y: -250,
        text: 'App Version: ' + PovGridDesigner.version(),
        fontFamily: 'Courier',
        fontSize: 15,
        lineHeight: 1.2,
        padding: 10,
        fill: 'blue'
    }));

    label.add(new Kinetic.Text({
        y: -220,
        text: 'Mouse Coords:',
        fontFamily: 'Courier',
        fontSize: 15,
        lineHeight: 1.2,
        padding: 10,
        fill: 'blue'
    }));

    label.add(new Kinetic.Text({
        y: -190,
        text: 'Document Size:',
        fontFamily: 'Courier',
        fontSize: 15,
        lineHeight: 1.2,
        padding: 10,
        fill: 'blue'
    }));

    label.add(new Kinetic.Text({
        y: -160,
        text: 'Current VP:',
        fontFamily: 'Courier',
        fontSize: 15,
        lineHeight: 1.2,
        padding: 10,
        fill: 'blue'
    }));

    label.add(new Kinetic.Text({
        y: -130,
        text: 'VP Position:',
        fontFamily: 'Courier',
        fontSize: 15,
        lineHeight: 1.2,
        padding: 10,
        fill: 'blue'
    }));

    label.add(new Kinetic.Text({
        y: -100,
        text: 'Horizon:',
        fontFamily: 'Courier',
        fontSize: 15,
        lineHeight: 1.2,
        padding: 10,
        fill: 'blue'
    }));

    label.add(new Kinetic.Text({
        y: -70,
        text: 'Selected Obj:',
        fontFamily: 'Courier',
        fontSize: 15,
        lineHeight: 1.2,
        padding: 10,
        fill: 'blue'
    }));

    // Field data
    label.add(new Kinetic.Text({
        y: -220,
        x: 130,
        text: 'x = 0000 | y = 0000',
        id: 'txtCoords',
        fontFamily: 'Courier',
        fontSize: 15,
        lineHeight: 1.2,
        padding: 10,
        fill: 'red'
    }));

    label.add(new Kinetic.Text({
        y: -190,
        x: 130,
        text: '...',
        id: 'txtDocSize',
        fontFamily: 'Courier',
        fontSize: 15,
        lineHeight: 1.2,
        padding: 10,
        fill: 'red'
    }));

    label.add(new Kinetic.Text({
        y: -160,
        x: 130,
        text: '...',
        id: 'txtCurrentVP',
        fontFamily: 'Courier',
        fontSize: 15,
        lineHeight: 1.2,
        padding: 10,
        fill: 'red'
    }));

    label.add(new Kinetic.Text({
        y: -130,
        x: 130,
        text: '...',
        id: 'txtVPPos',
        fontFamily: 'Courier',
        fontSize: 15,
        lineHeight: 1.2,
        padding: 10,
        fill: 'red'
    }));

    label.add(new Kinetic.Text({
        y: -100,
        x: 130,
        text: '...',
        id: 'txtMidPoint',
        fontFamily: 'Courier',
        fontSize: 15,
        lineHeight: 1.2,
        padding: 10,
        fill: 'red'
    }));

    label.add(new Kinetic.Text({
        y: -70,
        x: 130,
        text: '...',
        id: 'txtSelected',
        fontFamily: 'Courier',
        fontSize: 15,
        lineHeight: 1.2,
        padding: 10,
        fill: 'red'
    }));

    var devLayer = new Kinetic.Layer({
        id: 'lyrDev'
    });

    PovGridDesigner.MainStage.on('mousemove', function(evt) {
        var node = PovGridDesigner.GetNode("txtCoords");

        node.setText('x = ' + evt.x + ' | y = ' + evt.y);
        PovGridDesigner.MainStage.draw();
    });

    devLayer.add(label);
    PovGridDesigner.MainStage.add(devLayer);

    PovGridDesigner.MainStage.draw();
}

function SetFieldData(fieldLableId, txtData)
{
    var node = PovGridDesigner.GetNode(fieldLableId);

    node.setText(txtData);
}

/**
 *
 * @returns {number}
 */
function GenerateVanishingPoints()
{
    var results = 0;

    try
    {
        // we need to create it
        var shapeCoords = new PovGridDesigner.Coordinate(0,0);
        var horizon = PovGridDesigner.GetNode(PovGridDesigner.shapeId[PovGridDesigner.shapeIdEnum.Horizon]);
        var document = PovGridDesigner.GetNode(PovGridDesigner.shapeId[PovGridDesigner.shapeIdEnum.Document]);

        for(var i =0; i < 3; i++)
        {
            switch(i)
            {
                case PovGridDesigner.shapeIdEnum.VP1:
                    //place on horizon, to left of document
                    shapeCoords.y = horizon.getAttrs().points[0].y;
                    shapeCoords.x = parseFloat(document.getPosition().x) + PovGridDesigner.VPAttributes.radius;
                    break;
                case PovGridDesigner.shapeIdEnum.VP2:
                    //place on horizon, to right of document
                    shapeCoords.y = horizon.getAttrs().points[0].y;
                    shapeCoords.x = parseFloat(document.getPosition().x) + parseFloat(document.getWidth()) - PovGridDesigner.VPAttributes.radius;
                    break;
                case PovGridDesigner.shapeIdEnum.VP3:
                    //place in center, bottom of document
                    shapeCoords.y = (parseFloat(document.getPosition().y) + parseFloat(document.getHeight())) - PovGridDesigner.VPAttributes.radius ;
                    shapeCoords.x = parseFloat(document.getPosition().x) + ((parseFloat(document.getWidth()) / 2) - (PovGridDesigner.VPAttributes.radius / 2));
                    break;
            }

            CreateVanishingPointGrid(shapeCoords, i);
            CreateVanishingPoint(shapeCoords, i);
        }
    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
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
 * @param initialCoords
 * @param enumId
 * @returns {boolean}
 */
function CreateVanishingPoint(shapeCoords, enumId)
{
    var isSuccess = false;

    try
    {
        if(PovGridDesigner.MainStage != undefined)
        {
            var vpGroup = PovGridDesigner.GetNode(PovGridDesigner.groupId[enumId]);
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
                draggable: false,
                shadowColor: '#00E600',
                shadowOpacity: 1,
                shadowOffsetX: 1,
                shadowOffsetY: 1,
                shadowBlur: 45,
                shadowEnabled: false
            });

            var numberLabel = enumId + 1;
            var simpleText = new Kinetic.Text({
                x: shapeCoords.x - (PovGridDesigner.VPAttributes.radius/2),
                y: shapeCoords.y - (PovGridDesigner.VPAttributes.radius/2),
                text: numberLabel.toString(),
                fontSize: 14,
                fontFamily: 'Courier',
                fontStyle: 'bold',
                width: PovGridDesigner.VPAttributes.radius,
                align: 'center',
                fill: 'black'
            });

            vpGroup.add(vPoint);
            vpGroup.add(simpleText);

            /** event binding for vanishing point group (where needed) */
            simpleText.on('click', function(){
                PovGridDesigner.setSelectedVP(vpGroup);
                vpGroup.setZIndex(3);
            });

            vpGroup.on('click', function(){
                  PovGridDesigner.setSelectedVP(this);
            });

            vpGroup.on('mouseup', function(){
                var node = PovGridDesigner.GetNode('txtVPPos');

                node.setText('x = ' + this.getPosition().x + ' | y = ' + this.getPosition().y);
            });

            vPoint.on('mouseover', function(){
                this.setFill(PovGridDesigner.VPAttributes.hoverFillColor);
                this.setShadowEnabled(true);
                vpGroup.setZIndex(3);
                PovGridDesigner.MainLayer.draw();
            });

            simpleText.on('mouseover', function(){
                vPoint.setFill(PovGridDesigner.VPAttributes.hoverFillColor);
                vPoint.setShadowEnabled(true);
                vpGroup.setZIndex(3);
                PovGridDesigner.MainLayer.draw();
            });

            vPoint.on('mouseout', function(){
                this.setFill(PovGridDesigner.VPAttributes.fillColor);
                this.setShadowEnabled(false);
                PovGridDesigner.MainLayer.draw();
            });

            simpleText.on('mouseout', function(){
                vPoint.setFill(PovGridDesigner.VPAttributes.fillColor);
                vPoint.setShadowEnabled(false);
                PovGridDesigner.MainLayer.draw();
            });

            if(vpGroup.id == PovGridDesigner.groupId[PovGridDesigner.groupIdEnum.VP1])
            {
                vpGroup.on('dragend', function(evt){
                    // move the horizon vertically with vp1
                    var horizon = PovGridDesigner.GetNode(PovGridDesigner.shapeId[PovGridDesigner.shapeIdEnum.Horizon]);

                    //horizon.attrs.points[0] = new PovGridDesigner.Coordinate(horizon.attrs.points[0].x, evt.y);
                    //horizon.attrs.points[1] = new PovGridDesigner.Coordinate(horizon.attrs.points[1].x, evt.y);
                });
            }

            PovGridDesigner.MainLayer.draw();

            isSuccess = true;
        }
    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
        //Set results to negative
        results = -1;
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
            height: stageHeight - 30,
            draggable: true
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

        PovGridDesigner.MainLayer.on('click', function(evt){
            var shape = evt.targetNode;
            /**
             * DEV DEBUG DATA
             */
            var node = PovGridDesigner.GetNode('txtSelected');
            node.setText(shape.getName());

        });

        PovGridDesigner.MainStage.add(PovGridDesigner.BaseLayer);
        PovGridDesigner.MainStage.add(PovGridDesigner.MainLayer);
        PovGridDesigner.MainStage.add(PovGridDesigner.TouchLayer);

        PovGridDesigner.MainStage.getContent().addEventListener('touchmove', function(evt) {
            var touch1 = evt.touches[0];
            var touch2 = evt.touches[1];

            if(touch1 && touch2 && activeShape) {
                var dist = getDistance({
                    x: touch1.clientX,
                    y: touch1.clientY
                }, {
                    x: touch2.clientX,
                    y: touch2.clientY
                });

                if(!lastDist) {
                    lastDist = dist;
                }

                var scale = activeShape.getScale().x * dist / lastDist;

                activeShape.setScale(scale);
                layer.draw();
                lastDist = dist;
            }
        }, false);

        PovGridDesigner.MainStage.getContent().addEventListener('touchend', function() {
            lastDist = 0;
        }, false);

        results = 1;
    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
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
            id: PovGridDesigner.groupId[PovGridDesigner.groupIdEnum.Main]
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

        /**
        * DEV DEBUG DATA
        */
        var node = PovGridDesigner.GetNode('txtMidPoint');
        node.setText(hlineY);

        var kjsHorizon = new Kinetic.Line({
            points: [hlineX1, hlineY, hlineX2, hlineY],
            stroke: 'black',
            strokeWidth: PovGridDesigner.GeneralShapeAttributes.strokeWidth + 0.2,
            id: PovGridDesigner.shapeId[PovGridDesigner.shapeIdEnum.Horizon],
            name: 'horizon',
            draggable: false
        });

        // add the shape to the group
        kjsMainGroup.add(kjsDocument);
        kjsMainGroup.add(kjsHorizon);

        // add the group to the layer
        PovGridDesigner.BaseLayer.add(kjsMainGroup);

        PovGridDesigner.MainStage.draw();

        results = 1;
    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
        //Set results to negative
        results = -1;
    }
    finally
    {
        return results;
    }
}

function UpdateLineOpacity()
{
    var results = 0;

    try
    {
        for(var g = 1; g < 4; g++)
        {
            var group = PovGridDesigner.GetNode("gpPerspLines" + g);

            var children = group.getChildren();

            for(var l = 0; l < children.length; l++)
            {
                children[l].setOpacity(PovGridDesigner.getLineOpacity());
            }

            group.draw();
            group.getParent().draw();
            PovGridDesigner.MainLayer.draw();
        }
    }
    catch (ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
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
 * @returns {number}
 */
function UpdateLineDensity()
{
    var results = 0;

    try
    {
        var perspGroup = Object.create(null);
        var vpGroup = Object.create(null);
        var lineCount = PovGridDesigner.getLineDensity();
        var angleIncrement = 360 / (lineCount * 2);
        var stageDiag = getDistanceBetweenPoints(new PovGridDesigner.Coordinate(0,PovGridDesigner.MainStage.getHeight()), new PovGridDesigner.Coordinate(PovGridDesigner.MainStage.getWidth(),0));

        for(var g = 1; g < 4; g++)
        {
            perspGroup = PovGridDesigner.GetNode("gpPerspLines" + g);
            vpGroup = PovGridDesigner.GetNode("gpVanishPoint" + g);

            if(perspGroup.hasChildren())
                perspGroup.destroyChildren();

            PovGridDesigner.MainLayer.draw();

            var vanishingPoint = PovGridDesigner.GetNode("shpVP" + g);
            var perspectiveLine = [];
            var angle = 0;
            var gridLineColor = PovGridDesigner.getNextGridLineColor(g-1); // grid color is a zero-based array

            for(var n = 0; n < lineCount; n++)
            {
                var endPoint = getSpokeLineCoords(stageDiag, new PovGridDesigner.Coordinate(vanishingPoint.getPosition().x, vanishingPoint.getPosition().y), Math.abs(angle));

                var line = new Kinetic.Line({
                    points: [endPoint.x1,endPoint.y1,endPoint.x2,endPoint.y2],
                    stroke: gridLineColor,
                    strokeWidth: PovGridDesigner.GeneralShapeAttributes.strokeWidth,
                    opacity: 0.6,
                    id: 'perpectiveLines_' + g + '_' + n,
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

            perspGroup.setVisible(true);
        }

        PovGridDesigner.MainLayer.draw();
    }
    catch (ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
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
function CreateVanishingPointGrid(groupCoords, vpEnumId)
{
    var results = 0;

    try
    {
        var lineCount = parseInt(PovGridDesigner.getLineDensity());
        var angleIncrement = 360 / (lineCount * 2);
        var vpGroup = Object.create(null);
        var perspGroup = Object.create(null);

        switch(vpEnumId)
        {
            case PovGridDesigner.shapeIdEnum.VP1:
                vpGroup = new Kinetic.Group({
                    id: PovGridDesigner.groupId[PovGridDesigner.groupIdEnum.VanishPoint1],
                    draggable: true,
                    visible: false
                });

                perspGroup =  new Kinetic.Group({
                    id: PovGridDesigner.groupId[PovGridDesigner.groupIdEnum.PerspLines1],
                    draggable: true
                });

                break;
            case PovGridDesigner.shapeIdEnum.VP2:
                vpGroup = new Kinetic.Group({
                    id: PovGridDesigner.groupId[PovGridDesigner.groupIdEnum.VanishPoint2],
                    draggable: true,
                    visible: false
                });

                perspGroup =  new Kinetic.Group({
                    id: PovGridDesigner.groupId[PovGridDesigner.groupIdEnum.PerspLines2],
                    draggable: true
                });

                break;
            case PovGridDesigner.shapeIdEnum.VP3:
                vpGroup = new Kinetic.Group({
                    id: PovGridDesigner.groupId[PovGridDesigner.groupIdEnum.VanishPoint3],
                    draggable: true,
                    visible: false
                });

                perspGroup =  new Kinetic.Group({
                    id: PovGridDesigner.groupId[PovGridDesigner.groupIdEnum.PerspLines3],
                    draggable: true
                });

                break;
        }

        var stageDiag = getDistanceBetweenPoints(new PovGridDesigner.Coordinate(0,PovGridDesigner.MainStage.getHeight()), new PovGridDesigner.Coordinate(PovGridDesigner.MainStage.getWidth(),0));
        var perspectiveLine = [];
        var angle = 0;
        var gridLineColor = PovGridDesigner.getNextGridLineColor(vpEnumId);

        for(var n = 0; n < lineCount; n++)
        {
            var endPoint = getSpokeLineCoords(stageDiag, groupCoords, Math.abs(angle));

            var line = new Kinetic.Line({
                points: [endPoint.x1,endPoint.y1,endPoint.x2,endPoint.y2],
                stroke: gridLineColor,
                strokeWidth: PovGridDesigner.GeneralShapeAttributes.strokeWidth,
                opacity: 0.6,
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

        PovGridDesigner.MainLayer.add(vpGroup);
    }
    catch (ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
        results = -1;
    }
    finally
    {
        return results;
    }
}

/**
 *
 * @returns {number}
 */
function UpdateGridLineColors()
{
    var results = 0;

    try
    {
        for(var g = 1; g < 4; g++)
        {
            var group = PovGridDesigner.GetNode("gpPerspLines" + g);

            var children = group.getChildren();

            for(var l = 0; l < children.length; l++)
            {
               children[l].setStroke(PovGridDesigner.getNextGridLineColor(g-1));
            }

            group.draw();
            group.getParent().draw();
            PovGridDesigner.MainLayer.draw();
        }
    }
    catch (ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
        results = -1;
    }
    finally
    {
        return results;
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
        LogError(ex.message + ' [' + arguments.callee.name + ']');
        results = -1;
    }
    finally
    {
        return results;
    }
}

