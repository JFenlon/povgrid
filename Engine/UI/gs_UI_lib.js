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

// TODO - Remove once the touch methods and popup menus are functional
// John 9/15/13
function ToggleVanishPoint(shapeEnumId)
{
    try
    {
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

        //var docSettings = GetNewDocSettings() || new GSDesigner.DocumentObject(800, 400);
        var docSettings = new GSDesigner.DocumentObject(800, 400);

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
        docSettings = new GSDesigner.DocumentObject();
    }
    finally
    {
        return docSettings;
    }
}

/**
 * Add the next sequential vaishing point to the grid
 * @returns {number}
 */
function AddNewVanishingPoint()
{
    var results = 0;

    try
    {
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
                visible: false
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
            y: startingCoords.y ,
            visible: true
        });

        var newPG = GSDesigner.PGGroupSource.clone({
            id:  'pg' + nodeId,
            name: 'perspectiveGrid',
            x: startingCoords.x,
            y: startingCoords.y,
            visible: true
        });

        var newTC = new Kinetic.Circle({
            x: 0,
            y: 0,
            id: 'tc' + nodeId,
            name: 'touchCircle',
            radius: GSDesigner.VPAttributes.radius,
            fill: GSDesigner.WorkspaceSettings.touchFillColor,
            opacity: GSDesigner.WorkspaceSettings.touchOpacity,
            visible: true
        });

        var newTG = new Kinetic.Group({
            x: startingCoords.x,
            y: startingCoords.y,
            id: 'tg' + nodeId,
            name: 'touchGroup',
            draggable: true,
            visible: true
        });

        newTG.add(newTC);

        var vpText = undefined;
        var vpCircle = undefined;

        GSDesigner.TouchLayer.add(newTG);
        GSDesigner.VPLayer.add(newVP);
        GSDesigner.GridLayer.add(newPG);

        UpdateGridLineColors(nodeId);

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

        // If this is vp1 then draw the horizon
        if(newVP.getId() == 'vp1')
        {
            var hlineY = (GSDesigner.MainStage.getHeight() - 2) /2;
            var hlineX2 = GSDesigner.MainStage.getWidth();
            var hlineX1 = (hlineX2 / 2) * -1;

            hlineX2 += (hlineX2 / 2);
            DrawHorizon(new GSDesigner.LineCoordinate(hlineX1, newVP.attrs.y, hlineX2, newVP.attrs.y));
        }


        // TODO - Bind mobile 'touch' events for selection and menu (touchhold)
        // John 9/12/13
        
        /** Event binding for vanishing point group (where needed) */
        newTG.on('click mousedown', function(){
            GSDesigner.setSelectedVP(newVP);
            PointSelected(newVP);
        });

        newTG.on('dragend', function() {
            newVP.setPosition(this.getPosition().x, this.getPosition().y);
            newPG.setPosition(this.getPosition().x, this.getPosition().y);
            GSDesigner.GridLayer.draw();
            GSDesigner.VPLayer.draw();
        })

        GSDesigner.TouchLayer.on('beforeDraw', function(){
            newVP.setPosition(newTG.getPosition().x, newTG.getPosition().y);
            newPG.setPosition(newTG.getPosition().x, newTG.getPosition().y);
            GSDesigner.GridLayer.draw();
            GSDesigner.VPLayer.draw();
        })

        GSDesigner.VPLayer.on('beforeDraw', function(){
            UpdateHorizon();
        });

        /*
            Todo - When touch events are added, remove hover effects and add effect to selected VPs only, then set all other VPs to 'normal'
            @author: John.Fenlon
            @date: 9/17/13
         */

        newTC.on('mouseover', function(){
            vpCircle.setFill(GSDesigner.VPAttributes.hoverFillColor);
            vpCircle.setShadowEnabled(true);
            GSDesigner.VPLayer.draw();
        });

        newTC.on('mouseout', function(){
            vpCircle.setFill(GSDesigner.VPAttributes.fillColor);
            vpCircle.setShadowEnabled(false);
            GSDesigner.VPLayer.draw();
        });

        GSDesigner.TouchLayer.draw();
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

        /*
            Todo - Create drag bounds for stage dragging to prevent users from seeing end-points of lines
            @author: John.Fenlon
            @date: 9/17/13
         */

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
        GSDesigner.MainStage.add(GSDesigner.TouchLayer);

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

/**
 * Draw the horizon line with vp1
 * @param lineCoords
 * @returns {*}
 * @constructor
 */
function  DrawHorizon(lineCoords)
{
    var result = GSDesigner.ResponseEnum.SILENT_FAILURE;

    try
    {
        // TODO - Parameterize the horizon settings
        // John 9/15/13

        var horizonLine = new Kinetic.Line({
            dashArray: [33, 10],
            strokeWidth: 1,
            stroke: 'green',
            lineCap: 'round',
            id: 'horizon',
            opacity: 0.8,
            points: [lineCoords.x1, lineCoords.y1, lineCoords.x2, lineCoords.y2]
        });

        GSDesigner.HorizonLayer.add(horizonLine);

        result = GSDesigner.ResponseEnum.SUCCESS;
    }
    catch (ex)
    {
        result = GSDesigner.ResponseEnum.LOGGED_FAILURE;
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
    }
    finally
    {
        return result;
    }
}

/**
 * Updates the horizon line according to the position of vp1 and/or vp2
 * @returns {*}
 * @constructor
 */
function UpdateHorizon()
{
    var result = GSDesigner.ResponseEnum.SILENT_FAILURE;

    try
    {
        var horizonLine = GSDesigner.HorizonLayer.get('Line')[0];
        var tg1 = GSDesigner.TouchLayer.get('#tg1')[0];
        var tg2 = GSDesigner.TouchLayer.get('#tg2')[0];
        var pCount = GSDesigner.GetPerspectiveCount();

        if(tg2 && pCount > 1)
        {
            var pivotPoint = new GSDesigner.Coordinate(tg1.attrs.x, tg1.attrs.y);
            var lineAngle = getAngleFromCoords(new GSDesigner.LineCoordinate(tg1.attrs.x, tg1.attrs.y, tg2.attrs.x, tg2.attrs.y));
            var newHorizonLineCoords = getAngledLineCoords(GSDesigner.MainStage.getWidth() * 2, pivotPoint, lineAngle);

            horizonLine.setAttr('points',[newHorizonLineCoords.x1, newHorizonLineCoords.y1, newHorizonLineCoords.x2, newHorizonLineCoords.y2]);
        }
        else
        {
            var hlineY = tg1.attrs.y;
            var hlineX1 = 0;
            var hlineX2 = GSDesigner.MainStage.getWidth();

            // single point perspective, we only move the line on the x axis
            var lineCoords = new GSDesigner.LineCoordinate(hlineX1, hlineY, hlineX2, hlineY);
            horizonLine.setAttr('points',[lineCoords.x1, lineCoords.y1, lineCoords.x2, lineCoords.y2]);
        }

        GSDesigner.HorizonLayer.draw();

        result = GSDesigner.ResponseEnum.SUCCESS;
    }
    catch (ex)
    {
        result = GSDesigner.ResponseEnum.LOGGED_FAILURE;
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
function CreateDocument(docInit)
{
    var results = 0;

    try
    {
        var documentObj = new GSDesigner.DocumentObject(docInit);

        /** document size input */
        var fldWidth = getDomElement('tbWidth');
        var fldHeight =  getDomElement('tbHeight');

        if(fldHeight && fldWidth && fldWidth.value.length != 0 && fldHeight.value.length != 0)
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

/**
 * Updates line opacity of given perspective grid group lines.
 * @param pgGroup
 * @returns {number}
 * @constructor
 */
function UpdateLineOpacity()
{
    // TODO - Can probably speed this up by grabbing the opacity value in the binding and passing it to this function
    // John 9/12/13

    var results = GSDesigner.ResponseEnum.SILENT_FAILURE;

    try
    {
        var pgGroup = Object.create(null);
        var opacity = GSDesigner.getLineOpacity();
        pgGroup = GSDesigner.GetNode(GSDesigner.SelectedPGGroupID);

        if(pgGroup)
        {
            var children = pgGroup.getChildren().toArray();

            for(var l = 0; l < children.length; l++)
            {
                children[l].setOpacity(opacity);
            }

            GSDesigner.GridLayer.draw();

            results = 1;
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

        var pgGroup = Object.create(null);
        var lineCount = GSDesigner.getLineDensity();
        var angleIncrement = 360 / (lineCount * 2);
        var stageDiag = getDistanceBetweenPoints(new GSDesigner.Coordinate(0,GSDesigner.MainStage.getHeight()), new GSDesigner.Coordinate(GSDesigner.MainStage.getWidth(),0));

        pgGroup = GSDesigner.GetNode(GSDesigner.SelectedPGGroupID);
        var angle = 0;
        var groupCoords = new GSDesigner.Coordinate(0,0);
        var lineProperties = GSDesigner.GetLineProperties(pgGroup);

        if(pgGroup.hasChildren())
            pgGroup.destroyChildren();

        GSDesigner.GridLayer.draw();

        for(var n = 0; n < lineCount; n++)
        {
            var endPoint = getAngledLineCoords(stageDiag, groupCoords, Math.abs(angle));

            var line = new Kinetic.Line({
                points: [endPoint.x1,endPoint.y1,endPoint.x2,endPoint.y2],
                stroke: lineProperties.color,
                strokeWidth: GSDesigner.GeneralShapeAttributes.strokeWidth,
                opacity: lineProperties.opacity,
                id: GSDesigner.groupId[GSDesigner.groupIdEnum.PerspectiveLines],
                draggable: false
            });

            //perspectiveLine.push(line);
            pgGroup.add(line);
            angle += angleIncrement;

        }

        GSDesigner.GridLayer.draw();


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
        var lineCount = parseInt(GSDesigner.WorkspaceSettings.lineDensity);
        var angleIncrement = 360 / (lineCount * 2);
        var perspGroup;

        perspGroup =  new Kinetic.Group({
            id: GSDesigner.groupId[GSDesigner.groupIdEnum.PerspectiveLines],
            draggable: true,
            visible: false
        });

        var stageDiag = getDistanceBetweenPoints(new GSDesigner.Coordinate(0,GSDesigner.MainStage.getHeight()), new GSDesigner.Coordinate(GSDesigner.MainStage.getWidth(),0)) * 2;
        var perspectiveLine = [];
        var angle = 0;
        var gridLineColor = GSDesigner.getNextGridLineColor(0);

        for(var n = 0; n < lineCount; n++)
        {
            var endPoint = getAngledLineCoords(stageDiag, groupCoords, Math.abs(angle));

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
 * Updates the grid line colors of the given perspective grid group
 * @param pgGroup
 * @returns {number}
 * @constructor
 */
function UpdateGridLineColors(pgGroupId)
{
    var results = 0;

    try
    {
        var pgGroup = GSDesigner.GridLayer.get('#pg' + pgGroupId)[0];


            var children = pgGroup.getChildren();

            for(var l = 0; l < children.length; l++)
            {
               children[l].setStroke(GSDesigner.getNextGridLineColor(pgGroupId));
            }

        results = 1;
        GSDesigner.GridLayer.draw();
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

function PointSelected(selectedVPGroup)
{
    var result = GSDesigner.ResponseEnum.SILENT_FAILURE;

    try
    {
        if(selectedVPGroup)
        {
            GSDesigner.SelectedVPGroupID = 'vp' + selectedVPGroup.getId().substring(2);
            GSDesigner.SelectedPGGroupID = 'pg' + GSDesigner.SelectedVPGroupID.substring(2);
        }
    }
    catch (ex)
    {
        result = GSDesigner.ResponseEnum.LOGGED_FAILURE;
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
    }
    finally
    {
        return result;
    }
}

