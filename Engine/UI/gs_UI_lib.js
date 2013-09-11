/**
 *************************************************************
 * Gridspective UI engine library
 * Created 04/03/2013
 *************************************************************
 *
 */

function EventBinding()
{
    $("#btnCreateDocument").bind("click", AddNewDocument);
    $("#btnVanishPoint1").bind("click", function(){
        ToggleVanishPoint(GSDesigner.shapeIdEnum.VP1);
    });
    $("#btnVanishPoint2").bind("click", function(){
        ToggleVanishPoint(GSDesigner.shapeIdEnum.VP2);
    });
    $("#btnVanishPoint3").bind("click", function(){
        ToggleVanishPoint(GSDesigner.shapeIdEnum.VP3);
    });

    $( "#sldLineDensity" ).bind( "change", function(event) {
        // set line density property
        GSDesigner.setLineDensity(event.target.value);

        UpdateLineDensity();
    });
    $( "#sldLineOpacity" ).bind( "change", function(event) {
        // set line opacity property
        GSDesigner.setLineOpacity(event.target.value / 100);

        UpdateLineOpacity();
    });

    $("#btnCycleColors").bind("click", function(){
        GSDesigner.incrementGridColorIndex();

        //Force grid lines to take on new colors
        UpdateGridLineColors();
    });

    /*
        Todo - Clean up theme switching logic (sliders not updating correctly)
        @author: John.Fenlon
        @date: 8/30/13
     */

    $("[name='link']").bind('click', function (event) {
        event.preventDefault();
        var theme = $(this).text();
        $.mobile.activePage.find('.ui-btn')
            .removeClass('ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e')
            .addClass('ui-btn-up-' + theme)
            .attr('data-theme', theme);
        $.mobile.activePage.find('.ui-bar')
            .removeClass('ui-bar-a ui-bar-b ui-bar-c ui-bar-d ui-bar-e')
            .addClass('ui-bar-' + theme)
            .attr('data-theme', theme);
        $.mobile.activePage.find('.ui-header, .ui-footer')
            .removeClass('ui-bar-a ui-bar-b ui-bar-c ui-bar-d ui-bar-e')
            .addClass('ui-bar-' + theme)
            .attr('data-theme', theme);
        $.mobile.activePage.removeClass('ui-body-a ui-body-b ui-body-c ui-body-d ui-body-e')
            .addClass('ui-body-' + theme)
            .attr('data-theme', theme);
    });

}

/**
 * Prevents the user from selecting objects with mouse/touch
 * @param target
 */
function disableSelection(target) {
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
    var divGrid = getDomElement('divTopGrid');
    var divContent = getDomElement('divContent');

    divContent.style.height = (getDocumentHeight() - divGrid.clientHeight) - 35;
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
/*        if(GSDesigner.NodeExists(GSDesigner.groupId[shapeEnumId]))
        {
            var group = GSDesigner.GetNode(GSDesigner.groupId[shapeEnumId]);

            group.setVisible(!group.getVisible());
            GSDesigner.VPLayer.draw();
        }*/
        AddNewVanishingPoint();
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
        GSDesigner.MainStage.clear();

        /** DEV ONLY */
        CreateDebugWindow();

        var docSettings = GetNewDocSettings() || new GSDesigner.DocumentObject(1024, 400);

        SetFieldData('txtDocSize', docSettings.width +  ' X ' + docSettings.height);

        if(CreateDocument(docSettings) < 0)
            throw new EvalError("create-main_layer-failed");

        if(!CreateSourceVanishPoint())
            throw new EvalError("generate-vpsource-failed");

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

/**
 * Determines new document parameters
 * @returns {*}
 * @constructor
 */
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
            docSettings = new GSDesigner.DocumentObject(width, height);
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
 *
 * @returns {number}
 */
function AddNewVanishingPoint()
{
    var results = 0;

    try
    {
        /*
            Todo - Add the creation of a horizon line on the first VP added to DOC
            @author: John.Fenlon
            @date: 8/23/13
         */


         // Draw the horizon line
/*         var hlineY = (GSDesigner.MainStage.getHeight() - 2) /2;
         var hlineX1 = 0;
         var hlineX2 = GSDesigner.MainStage.getWidth();
         GSDesigner.WorkspaceSettings.hLineMidPoint = (hlineX2 - hlineX1) / 2;

         *//*
         Todo - DEBUG - REMOVE
         @author: John.Fenlon
         @date: 8/14/13
         *//*
        var node = GSDesigner.GetNode('txtMidPoint');
        node.setText(hlineY);

        var kjsHorizon = new Kinetic.Line({
            points: [hlineX1, hlineY, hlineX2, hlineY],
            stroke: 'black',
            strokeWidth: GSDesigner.GeneralShapeAttributes.strokeWidth + 0.2,
            id: GSDesigner.shapeId[GSDesigner.shapeIdEnum.Horizon],
            name: 'horizon',
            draggable: false
        });

        GSDesigner.HorizonLayer = new Kinetic.Layer({
            id: 'lyrHorizon'
        });
        kjsMainGroup.add(kjsHorizon);*/

        var nextAvailable = GSDesigner.GetNextAvailableVP(); // call next available function


        // we need to create it
        var shapeCoords = new GSDesigner.Coordinate(0,0);
        var horizon = GSDesigner.GetNode(GSDesigner.shapeId[GSDesigner.shapeIdEnum.Horizon]);
        var document = GSDesigner.GetNode(GSDesigner.shapeId[GSDesigner.shapeIdEnum.Document]);

        for(var i =0; i < 3; i++)
        {
            switch(i)
            {
                case GSDesigner.shapeIdEnum.VP1:
                    //place on horizon, to left of document
                    shapeCoords.y = 50; //horizon.getAttrs().points[0].y;
                    shapeCoords.x = parseFloat(document.getPosition().x) + GSDesigner.VPAttributes.radius;
                    break;
                case GSDesigner.shapeIdEnum.VP2:
                    //place on horizon, to right of document
                    shapeCoords.y = 50; //horizon.getAttrs().points[0].y;
                    shapeCoords.y = 50; //horizon.getAttrs().points[0].y;
                    shapeCoords.x = parseFloat(document.getPosition().x) + parseFloat(document.getWidth()) - GSDesigner.VPAttributes.radius;
                    break;
                case GSDesigner.shapeIdEnum.VP3:
                    //place in center, bottom of document
                    shapeCoords.y = (parseFloat(document.getPosition().y) + parseFloat(document.getHeight())) - GSDesigner.VPAttributes.radius ;
                    shapeCoords.x = parseFloat(document.getPosition().x) + ((parseFloat(document.getWidth()) / 2) - (GSDesigner.VPAttributes.radius / 2));
                    break;
            }

        }

        CloneSourceVanishingPoint(nextAvailable, new GSDesigner.Coordinate(25,25));
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
 * Creates the source vanishing point, grid lines and group to be cloned.
 * @returns {boolean}
 * @constructor
 */
function CreateSourceVanishPoint()
{
    var isSuccess = false;

    try
    {
        if(GSDesigner.MainStage != undefined)
        {
            var vpGroup = new Kinetic.Group({
                x: 0,
                y: 0,
                id: GSDesigner.groupId[GSDesigner.groupIdEnum.VanishPoint],
                name: 'source',
                draggable: true,
                visible: true
            });

            var vPoint = new Kinetic.Circle({
                x: 0,
                y: 0,
                radius: GSDesigner.VPAttributes.radius,
                fill: GSDesigner.VPAttributes.fillColor,
                stroke: GSDesigner.VPAttributes.strokeColor,
                strokeWidth: GSDesigner.VPAttributes.strokeWidth,
                opacity: GSDesigner.VPAttributes.opacity,
                id: 'vpCircle',
                name: 'vpCircle',
                visible: true,
                draggable: false,
                shadowColor: '#00E600',
                shadowOpacity: 1,
                shadowOffsetX: 1,
                shadowOffsetY: 1,
                shadowBlur: 45,
                shadowEnabled: false
            });

            var simpleText = new Kinetic.Text({
                x: -1 * (GSDesigner.VPAttributes.radius / 2),
                y: -1 * (GSDesigner.VPAttributes.radius / 2),
                id: 'vpText',
                text: '0',
                fontSize: 14,
                fontFamily: 'Courier',
                fontStyle: 'bold',
                width: GSDesigner.VPAttributes.radius,
                align: 'center',
                fill: 'black'
            });

            GSDesigner.PGGroupSource = CreatePerspectiveGrid(new GSDesigner.Coordinate(0,0));

            vpGroup.add(vPoint);
            vpGroup.add(simpleText);

            GSDesigner.VPLayer.add(vpGroup);
            GSDesigner.VPLayer.draw();

            GSDesigner.GridLayer.add(GSDesigner.PGGroupSource);
            GSDesigner.GridLayer.draw();

            GSDesigner.VPGrpSource = vpGroup;

            isSuccess = true;
        }
    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
        //Set results to negative
    }
    finally
    {
        return isSuccess;
    }
}

/**
 * Clone the source vanishing point
 * @param nodeId
 * @param startingCoords
 * @returns {number}
 * @constructor
 */
function CloneSourceVanishingPoint(nodeId, startingCoords)
{
    var result = 0;

    try
    {
        var newVP = GSDesigner.VPGrpSource.clone({
            id: 'vp' + nodeId,
            name: 'vanishingPoint',
            x: startingCoords.x,
            y: startingCoords.y
        });

        var newPG = GSDesigner.PGGroupSource.clone({
            id:  'pg' + nodeId,
            name: 'perspectiveGrid',
            x: startingCoords.x,
            y: startingCoords.y
        })

        var vpText = undefined;
        var vpCircle = undefined;

        GSDesigner.VPLayer.add(newVP);
        GSDesigner.GridLayer.add(newPG);

        for(var i = 0; i < newVP.children.length; i++)
        {
            if(newVP.children[i].attrs.id == 'vpText')
            {
                vpText = newVP.children[i];
                vpText.setText(nodeId);
            }
            if(newVP.children[i].attrs.id == 'vpCircle')
            {
                vpCircle = newVP.children[i];
            }
        }

        // TODO - Replace these events when touch layer objects are implemented. Touch layer will handle all touch/drag events
        // John 9/9/13
        
        /** Event binding for vanishing point group (where needed) */
        vpText.on('click', function(){
            GSDesigner.setSelectedVP(newVP);
            newVP.setZIndex(3);
        });

        newVP.on('click touchstart', function(){
            GSDesigner.setSelectedVP(this);
        });

        newVP.on('dragend', function() {
            newPG.setPosition(this.getPosition().x, this.getPosition().y);
            GSDesigner.GridLayer.draw();
        })

        GSDesigner.VPLayer.on('beforeDraw', function(){
            newPG.setPosition(newVP.getPosition().x, newVP.getPosition().y);
            GSDesigner.GridLayer.draw();
        })

        /*
         Todo - DEBUG - REMOVE
         @author: John.Fenlon
         @date: 8/14/13
         */
        newVP.on('mouseup touchend', function(){
            var node = GSDesigner.GetNode('txtVPPos');

            node.setText('x = ' + this.getAbsolutePosition().x + ' | y = ' + this.getAbsolutePosition().y);
        });

        vpCircle.on('mouseover touchstart', function(){
            this.setFill(GSDesigner.VPAttributes.hoverFillColor);
            this.setShadowEnabled(true);
            newVP.setZIndex(3);
            GSDesigner.VPLayer.draw();
        });

        vpText.on('mouseover touchstart', function(){
            vpCircle.setFill(GSDesigner.VPAttributes.hoverFillColor);
            vpCircle.setShadowEnabled(true);
            newVP.setZIndex(3);
            GSDesigner.VPLayer.draw();
        });

        vpCircle.on('mouseout', function(){
            this.setFill(GSDesigner.VPAttributes.fillColor);
            this.setShadowEnabled(false);
            GSDesigner.VPLayer.draw();
        });

        GSDesigner.VPLayer.draw();
        GSDesigner.GridLayer.draw();
    }
    catch (ex)
    {
        result = 0;
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
    }
    finally
    {
        return result;
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

        GSDesigner.MainStage = new Kinetic.Stage({
            container: "canvasContainer",
            id: 'stage',
            width: stageWidth,
            height: stageHeight - 30,
            draggable: true
        });

        // Reserved for document shape only
        GSDesigner.BaseLayer = new Kinetic.Layer({
            id: 'lyrBase'
        });

        // Reserved for horizon line only
        GSDesigner.HorizonLayer = new Kinetic.Layer({
            id: 'lyrHorizon'
        });

        // This layer is reserved for vanishing points
        GSDesigner.VPLayer = new Kinetic.Layer({
            id: 'lyrVP'
        });

        // This layer is reserved for perspective grid lines
        GSDesigner.GridLayer = new Kinetic.Layer({
            id: 'lyrGrid'
        });

        GSDesigner.TouchLayer = new Kinetic.Layer({
            id: 'lyrTouch'
        });

        // keep v points 1 and/or 2 in sync with the horizon
/*        GSDesigner.VPLayer.on('beforeDraw', function(evt) {
            var isTwoPP = (GSDesigner.NodeExists());

            if(evt.targetNode.attr.id == GSDesigner.groupIdEnum[GSDesigner.groupId.VanishPoint] || evt.targetNode.attr.id == GSDesigner.groupIdEnum[GSDesigner.groupId.VanishPoint2])
                UpdateHorizon();
        });*/

        /*
            Todo - DEBUG - REMOVE
            @author: John.Fenlon
            @date: 8/14/13
         */
        GSDesigner.VPLayer.on('click', function(evt){
            var shape = evt.targetNode;
            var node = GSDesigner.GetNode('txtSelected');
            node.setText(shape.getName());
        });

        /*
            Todo - Update to zoom on center
            @author: John.Fenlon
            @date: 8/14/13
         */
/*        var zoom = function(e) {
            var zoomAmount = e.wheelDeltaY*0.0005;
            var newCoords = new GSDesigner.Coordinate();
            newCoords.x = GSDesigner.BaseLayer.getPosition().x - zoomAmount;
            newCoords.y = GSDesigner.BaseLayer.getPosition().y - zoomAmount;
            GSDesigner.BaseLayer.setScale(GSDesigner.BaseLayer.getScale().x+zoomAmount)
            GSDesigner.MainLayer.setScale(GSDesigner.MainLayer.getScale().x+zoomAmount)
            GSDesigner.BaseLayer.setPosition(newCoords);
            GSDesigner.MainStage.draw();
        }

        GSDesigner.BaseLayer.setOffset(GSDesigner.BaseLayer.getWidth()/2,GSDesigner.BaseLayer.getHeight()/2);*/

        GSDesigner.MainStage.add(GSDesigner.BaseLayer);
        GSDesigner.MainStage.add(GSDesigner.HorizonLayer);
        GSDesigner.MainStage.add(GSDesigner.GridLayer);
        GSDesigner.MainStage.add(GSDesigner.VPLayer);

        /*
            Todo - Add touch-zoom functionality
            @author: John.Fenlon
            @date: 8/14/13
         */
/*        GSDesigner.MainStage.getContent().addEventListener('touchmove', function(evt) {
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
        }, false);*/

        //document.addEventListener("mousewheel", zoom, false);

/*        GSDesigner.MainStage.getContent().addEventListener('touchend', function() {
            lastDist = 0;
        }, false);*/

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


function UpdateHorizon() {
    var q = quad; // equivalent to vp1 & vp2 coordinates
    var horizonLine = GSDesigner.HorizonLayer.get('#' + GSDesigner.shapeIdEnum[GSDesigner.shapeId.Horizon])[0];

    if(GSDesigner.GetPerspectiveCount > 1)
    {
        horizonLine.setPoints([q.start.attrs.x, q.start.attrs.y, q.end.attrs.x, q.end.attrs.y]);
    }
    else
    {
        // single point perspective, we only move the line on the x axis
        //horizonLine.setPoints([vp1 points]);
    }

    GSDesigner.HorizonLayer.draw();
}

/**
 * @return {number}
 */
function CreateDocument(docInit)
{
    var results = 0;

    try
    {
        var documentObj = (typeof docInit === "undefined") ? new GSDesigner.DocumentObject(docInit) : docInit;

        /** document size input */
        var fldWidth = getDomElement('tbWidth');
        var fldHeight =  getDomElement('tbHeight');

        if(fldWidth.value.length != 0 && fldHeight.value.length != 0)
        {
            documentObj.width = fldWidth.value;
            documentObj.height = fldHeight.value;
        }

        var kjsMainGroup = new Kinetic.Group({
            id: GSDesigner.groupId[GSDesigner.groupIdEnum.Main]
        });

        // This is the 'document' shape
        var kjsDocument = new Kinetic.Rect({
            id: GSDesigner.shapeId[GSDesigner.shapeIdEnum.Document],
            name: documentObj.name,
            x: (GSDesigner.MainStage.attrs.width - documentObj.width) / 2,
            y: (GSDesigner.MainStage.attrs.height - documentObj.height) / 2,
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

        // add the shape to the group
        kjsMainGroup.add(kjsDocument);

        // add the group to the layer
        GSDesigner.BaseLayer.add(kjsMainGroup);

        GSDesigner.MainStage.draw();

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

    // TODO - Adjust to update grid lines only on the selected VP
    // John 9/10/13

    try
    {
        for(var g = 1; g < 4; g++)
        {
            var group = GSDesigner.GetNode("gpPerspLines" + g);

            var children = group.getChildren();

            for(var l = 0; l < children.length; l++)
            {
                children[l].setOpacity(GSDesigner.getLineOpacity());
            }

            group.draw();
            group.getParent().draw();
            GSDesigner.MainLayer.draw();
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
        // TODO - Adjust to update grid lines only on the selected VP
        // John 9/10/13

        var perspGroup = Object.create(null);
        var vpGroup = Object.create(null);
        var lineCount = GSDesigner.getLineDensity();
        var angleIncrement = 360 / (lineCount * 2);
        var stageDiag = getDistanceBetweenPoints(new GSDesigner.Coordinate(0,GSDesigner.MainStage.getHeight()), new GSDesigner.Coordinate(GSDesigner.MainStage.getWidth(),0));

        for(var g = 1; g < 4; g++)
        {
            perspGroup = GSDesigner.GetNode("gpPerspLines" + g);
            vpGroup = GSDesigner.GetNode("gpVanishPoint" + g);

            if(perspGroup.hasChildren())
                perspGroup.destroyChildren();

            GSDesigner.MainLayer.draw();

            var vanishingPoint = GSDesigner.GetNode("shpVP" + g);
            var perspectiveLine = [];
            var angle = 0;
            var gridLineColor = GSDesigner.getNextGridLineColor(g-1); // grid color is a zero-based array

            for(var n = 0; n < lineCount; n++)
            {
                var endPoint = getSpokeLineCoords(stageDiag, new GSDesigner.Coordinate(vanishingPoint.getPosition().x, vanishingPoint.getPosition().y), Math.abs(angle));

                var line = new Kinetic.Line({
                    points: [endPoint.x1,endPoint.y1,endPoint.x2,endPoint.y2],
                    stroke: gridLineColor,
                    strokeWidth: GSDesigner.GeneralShapeAttributes.strokeWidth,
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

        GSDesigner.MainLayer.draw();
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
 * @returns {null}
 * @constructor
 */
function CreatePerspectiveGrid(groupCoords)
{
    var results = null;

    try
    {
        var lineCount = parseInt(GSDesigner.getLineDensity());
        var angleIncrement = 360 / (lineCount * 2);
        var perspGroup;

        perspGroup =  new Kinetic.Group({
            id: GSDesigner.groupId[GSDesigner.groupIdEnum.PerspectiveLines],
            draggable: true
        });

        var stageDiag = getDistanceBetweenPoints(new GSDesigner.Coordinate(0,GSDesigner.MainStage.getHeight()), new GSDesigner.Coordinate(GSDesigner.MainStage.getWidth(),0));
        var perspectiveLine = [];
        var angle = 0;
        var gridLineColor = GSDesigner.getNextGridLineColor(0);

        for(var n = 0; n < lineCount; n++)
        {
            var endPoint = getSpokeLineCoords(stageDiag, groupCoords, Math.abs(angle));

            var line = new Kinetic.Line({
                points: [endPoint.x1,endPoint.y1,endPoint.x2,endPoint.y2],
                stroke: gridLineColor,
                strokeWidth: GSDesigner.GeneralShapeAttributes.strokeWidth,
                opacity: 0.6,
                id: 'perpectiveLines' + n,
                name: 'grid',
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

        results = perspGroup;
    }
    catch (ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
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

    // TODO - Adjust to update grid lines only on the selected VP
    // John 9/10/13

    try
    {
        for(var g = 1; g < 4; g++)
        {
            var group = GSDesigner.GetNode("gpPerspLines" + g);

            var children = group.getChildren();

            for(var l = 0; l < children.length; l++)
            {
               children[l].setStroke(GSDesigner.getNextGridLineColor(g-1));
            }

            group.draw();
            group.getParent().draw();
            GSDesigner.MainLayer.draw();
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
        GSDesigner.TouchLayer.add(kjsTouchCircle);

        // use event delegation
        GSDesigner.MainStage.on('mousedown touchstart', function(evt) {
            GSDesigner.TouchLayer.clear();
            kjsTouchCircle.setVisible(true);
            kjsTouchCircle.setPosition(evt.layerX, evt.layerY);
            kjsTouchCircle.draw();
            //anim.start();
        });

        kjsTouchCircle.on('mousedown mouseout', function(evt) {
            GSDesigner.TouchLayer.clear();
        });

        GSDesigner.MainStage.on('mouseup touchend', function(evt) {
            GSDesigner.TouchLayer.clear();
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

