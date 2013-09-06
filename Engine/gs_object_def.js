/**
 *************************************************************
 * POVGRID global object/property definition file
 * Created 04/03/2013
 *************************************************************
 */

/* Declaration */
// Object literal declaration {namespace}
var GSDesigner = {

    // public property
    version_major             : 1,
    version_minor             : 0,
    version_revision          : 0,
    GridColors                : ["#CC0000", "#00CCFF", "#6600CC", "#00CC00", "#FF00FF", "#663300", "#CC0066", "#0066FF", "#4A6E6E"],
    UI_theme_literal          : "data-theme",
    Max_VP                    : 12,

    // public methods
    getNextGridLineColor: function(colorIncrement)
    {
        var requestedColorIndex = this.GridColorIndex.value + colorIncrement;

        if(requestedColorIndex > this.GridColors.length)
            requestedColorIndex = 0 + colorIncrement;

        return this.GridColors[requestedColorIndex];
    },

    getLineDensity: function(){ return this.CurrentLineDensity.value;},
    setLineDensity: function(newLineDensity){this.CurrentLineDensity.value = newLineDensity;},
    getLineOpacity: function(){ return this.CurrentLineOpacity.value;},
    setLineOpacity: function(newLineOpacity){this.CurrentLineOpacity.value = newLineOpacity;},
    setSelectedVP: function(vpGroup)
    {
        this.CurrentSelectedVP = vpGroup;
        var txtVP = GSDesigner.GetNode('txtCurrentVP');

        txtVP.setText(vpGroup.attrs.id);
    },
    getSelectedVP: function(){ return this.CurrentSelectedVP;},
    version: function() { return this.version_major.toString() + '.' + this.version_minor.toString() + '.' + this.version_revision.toString();},
    incrementGridColorIndex: function()
    {
        this.GridColorIndex.value++;

        if(this.GridColorIndex.value > this.GridColors.length)
            this.GridColorIndex.value = 0;
    }
};

/**
 * Main stage and layers
 * @type {*}
 */
GSDesigner.MainStage = Object.create(null);
GSDesigner.BaseLayer = Object.create(null);
GSDesigner.TouchLayer = Object.create(null);
GSDesigner.HorizonLayer = Object.create(null);
GSDesigner.VPLayer = Object.create(null);

GSDesigner.DBRecordCount = Object.create(null);
GSDesigner.GridColorIndex = Object.create(null);
GSDesigner.CurrentLineDensity = Object.create(null);
GSDesigner.CurrentLineOpacity = Object.create(null);
GSDesigner.CurrentSelectedVP = Object.create(null);
GSDesigner.segmentParams = Object.create(null);
GSDesigner.VPAttributes = Object.create(null);
GSDesigner.GeneralShapeAttributes = Object.create(null);
GSDesigner.WorkspaceSettings = Object.create(null);
GSDesigner.exportGridDocument = Object.create(null);
GSDesigner.groupId = new Array("gpVanishPoint1", "gpVanishPoint2", "gpVanishPoint3", "gpTraceLines", "gpPerspLines1", "gpPerspLines2", "gpPerspLines3", "gpMain");
GSDesigner.groupIdEnum = {
        VanishPoint1 : 0,
        VanishPoint2 : 1,
        VanishPoint3 : 2,
        TraceLines   : 3,
        PerspLines1  : 4,
        PerspLines2  : 5,
        PerspLines3  : 6,
        Main         : 7
    };
GSDesigner.shapeId = new Array("shpVP1", "shpVP2", "shpVP3", "shpHorizon", "shpDocument", "shpTraceLine1", "shpTraceLine2","shpTouchAnim");
GSDesigner.shapeIdEnum = {
        VP1        : 0,
        VP2        : 1,
        VP3        : 2,
        Horizon    : 3,
        Document   : 4,
        TraceLine1 : 5,
        TraceLine2 : 6,
        TouchAnim  : 7
};

// Object properties
/**
 *  Parameters grid document.
 *  This is the document that will get exported as an image after
 *  the grid and vanishing points are in place.
 */
Object.defineProperties(GSDesigner.exportGridDocument, {
    width:   {
        value:        1024
        , writable:     true
        , configurable: true
        , enumerable:   true
    }

    , height: {
        value:        768
        , writable:     true
        , configurable: true
        , enumerable:   true
    }

    , backgroundColor: {
        value:        '#FFFFFF'
        , writable:     true
        , configurable: true
        , enumerable:   true
    }
});

/**
 * Tracking record count to manage memory quota
 */
Object.defineProperties(GSDesigner.DBRecordCount, {
    value:   {
        value:        0
        , writable:     true
        , configurable: false
        , enumerable:   false
    }
});

/**
 *  Parameter to keep track of the grid color index. This marks the first color in the sequence
 */
Object.defineProperties(GSDesigner.GridColorIndex, {
    value:   {
        value:        0
        , writable:     true
        , configurable: false
        , enumerable:   false
    }
});

/**
 * Line density for perspective grid
 */
Object.defineProperties(GSDesigner.CurrentLineDensity, {
    value:   {
        value:        5
        , writable:     true
        , configurable: false
        , enumerable:   false
    }
});

/**
 * Line density for perspective grid
 */
Object.defineProperties(GSDesigner.CurrentLineOpacity, {
    value:   {
        value:        0.6
        , writable:     true
        , configurable: false
        , enumerable:   false
    }
});

/**
*  Parameters for grid segments. This is used for gridlines
*  anchored to verticle foreground lines only and passed to function
*  to calculate grid points.
*  Point1 is top anchor point on verticle line.
*  Point2 is bottom anchor point on verticle line.
*/
Object.defineProperties(GSDesigner.segmentParams, {
    staticPos:   { 
        value:        0
      , writable:     true
      , configurable: true
      , enumerable:   true 
    }

    , xIsStatic: {
        value:        true
      , writable:     true
      , configurable: true
      , enumerable:   true 
    }

    , point1:    { 
        value:        0
      , writable:     true
      , configurable: true
      , enumerable:   true 
    }

    , point2: { 
        value:        0
      , writable:     true
      , configurable: true
      , enumerable:   true 
    }

    , segmentCount: { 
        value:        0
      , writable:     true
      , configurable: true
      , enumerable:   true 
    }            
});

/**
*	workspaceSettings property
*	orientation: 0 = landscape, 1 = portrait;
*	persType: 1 = 1 point, 2 = 2 point, 3 = 3 point;
*	isAutomatic: place and draw guides with assistance/assumptions based on perspective principles.
*	hLineMidPoint: half-way point on horizon line.
*/
Object.defineProperties(GSDesigner.WorkspaceSettings, {
    isLandscape:   { 
        value:        1
      , writable:     true
      , configurable: false
      , enumerable:   true 
    }

    , isAutomatic: {
        value:        true
      , writable:     true
      , configurable: false
      , enumerable:   true 
    }

    , workspaceBackground: {
        value:        '#C3C3C3'
      , writable:     true
      , configurable: false
      , enumerable:   true 
    }

    , persistenceType: {
        value:        1
      , writable:     true
      , configurable: false
      , enumerable:   true 
    }

    , hLineMidPoint: { 
        value:        1
      , writable:     true
      , configurable: false
      , enumerable:   true 
    }   

    , touchPadding: { 
        value:        5
      , writable:     true
      , configurable: true
      , enumerable:   true 
    } 

    , touchOpacity: { 
        value:        .6
      , writable:     true
      , configurable: true
      , enumerable:   true 
    }  

    , configLoaded: { 
        value:        false
      , writable:     true
      , configurable: false
      , enumerable:   true 
    }            
});

Object.defineProperties(GSDesigner.GeneralShapeAttributes,
{
    strokeWidth:
    {
        value:          0.5
        ,writable:      true
        ,configurable:  true
        ,enumerable:    true
    }

    ,strokeColor:
    {
        value:          'black'
        ,writable:      true
        ,configurable:  true
        ,enumerable:    true
    }

    ,opacity:
    {
        value:          1
        ,writable:      true
        ,configurable:  true
        ,enumerable:    true
    }
});

/**
 * Default shape attributes for a vanishing point
 */
Object.defineProperties(GSDesigner.VPAttributes,
{
    fillColor:
    {
          value:        '#FFCC00'
        , writable:     true
        , configurable: true
        , enumerable:   true
    }

    ,hoverFillColor:
    {
          value:        '#FFFF00'
        , writable:      false
        , configurable:  true
        , enumerable:    true
    }

    ,strokeColor:
    {
          value:        '#484848'
        , writable:     true
        , configurable: true
        , enumerable:   true 
    }

    ,radius:
    {
          value:        15
        , writable:     true
        , configurable: true
        , enumerable:   true 
    }   

    ,strokeWidth:
    {
          value:        3
        , writable:     true
        , configurable: true
        , enumerable:   true 
    }  

    ,opacity:
    {
          value:        1
        , writable:     true
        , configurable: true
        , enumerable:   true
    }
});
/** END PROPERTY DEFINITIONS */

/** OBJECT DEFINITION */

/**
 *
 * @param xPos
 * @param yPos
 * @returns {{x: (*|number), y: (*|number)}}
 * @constructor
 */
GSDesigner.Coordinate = function (xPos, yPos)
{
    return  {x: xPos || 0, y: yPos || 0};
}

/**
 *
 * @param x1Pos
 * @param y1Pos
 * @param x2Pos
 * @param y2Pos
 * @returns {{x1: (*|number), y1: (*|number), x2: (*|number), y2: (*|number)}}
 * @constructor
 */
GSDesigner.LineCoordinate = function (x1Pos, y1Pos, x2Pos, y2Pos)
{
    return {x1: x1Pos || 0, y1: y1Pos || 0, x2: x2Pos || 0, y2: y2Pos || 0};
}

/**
 *
 * @param dWidth
 * @param dHeight
 * @param hexFillColor
 * @param docName
 * @returns {{width: *, height: *, backgroundColor: *, strokeColor: *, strokeWidth: *, shadowColor: *, shadowBlur: *, shadowOffset: *, shadowOpacity: *, shadowEnabled: *, name: *}}
 * @constructor
 */
GSDesigner.DocumentObject = function (dWidth, dHeight, hexFillColor, docName)
{
    documentName = docName || 'document';
    fillColorHex = hexFillColor || '#ffffff';
    width = dWidth || 512;
    height = dHeight || 384;
    strokeColorHex = '#000000';
    strokeWidth = 0.5;
    shadowColor = '#000000';
    shadowBlur = 10;
    shadowOffset = [10, 10];
    shadowOpacity = 0.5;
    shadowEnabled = true;

    return {
                width: width
                ,height: height
                ,backgroundColor: fillColorHex
                ,strokeColor: strokeColorHex
                ,strokeWidth: strokeWidth
                ,shadowColor: shadowColor
                ,shadowBlur: shadowBlur
                ,shadowOffset: shadowOffset
                ,shadowOpacity: shadowOpacity
                ,shadowEnabled: shadowEnabled
                ,name: documentName
            };
}


/**
 *
 * @param shapeId
 * @returns {kinetic node}
 */
GSDesigner.GetNode = function (shapeId)
{
    var node = Object.create(null);

    try
    {
        var objectId = '#' + shapeId;
        var nodes = this.MainStage.get(objectId);
        node = nodes[0];
    }
    catch(ex)
    {
        //LOG ERROR
        LogError(ex.message);
        return null;
    }
    finally
    {
        //LogError('ShapeID: ' + node.attrs.id);
        return node;
    }
}

/**
 *
 * @param objectID
 * @returns {boolean}
 */
GSDesigner.NodeExists = function (objectID)
{
    var results = true;

    try
    {
        var node = GSDesigner.GetNode(objectID);

        if(typeof node === 'undefined'){
            results = false;
        };
    }
    catch(ex)
    {
        // Generic error
        LogError(ex.message);
        results = false;
    }
    finally
    {
        return results;
    }
}

/**
 *
 * @param vpGroup
 * @returns {number}
 * @constructor
 */
GSDesigner.GetLineDensity = function (vpGroup)
{
    var lineDensity = 0;

    try
    {
        var lineNode = layer.get('Line');

        if(lineDensity != null)
            lineDensity = lineNode.toArray().length;
    }
    catch (ex)
    {
        lineDensity = 0;

        //LOG ERROR
        LogError(ex.ex.message + ' [' + arguments.arguments.callee.arguments.callee.name + ']');
    }
    finally
    {
        return lineDensity;
    }
}

GSDesigner.GetPerspectiveCount = function ()
{
    var pCount = 0;

    try
    {
        var nodes = GSDesigner.VPLayer.get('Group');

        if(typeof nodes != 'undefined');
            pCount = nodes.toArray().length;
    }
    catch (ex)
    {
        pCount = 0;
        //LOG ERROR
        LogError(ex.ex.message + ' [' + arguments.arguments.callee.arguments.callee.name + ']');
    }
    finally
    {
        return pCount;
    }
}