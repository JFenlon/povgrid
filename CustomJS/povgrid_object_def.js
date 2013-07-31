/**
 *************************************************************
 * POVGRID global object/property definition file
 * Created 04/03/2013
 *************************************************************
 */

/* Declaration */
// Object literal declaration {namespace}
var PovGridDesigner = {

    // public property
    version            : 1.0,
    GridColors         : ["#66FFFF", "#00FF00", "#FF00FF", "#FF9900", "#0066FF"],

    // public methods
    getVersion: function(){ return 'Version ' + this.version; },

    getNextGridLineColor: function()
    {
        var retColor = PovGridDesigner.GridColors[PovGridDesigner.GridColorIndex.value];

        PovGridDesigner.GridColorIndex.value ++;

        if(PovGridDesigner.GridColorIndex.value >= PovGridDesigner.GridColors.length)
            PovGridDesigner.GridColorIndex.value = 0;

        return retColor;
    },

    getLineDensity: function(){ return PovGridDesigner.CurrentLineDensity.value;},
    setLineDensity: function(newLineDensity){PovGridDesigner.CurrentLineDensity.value = newLineDensity;}
};

 var vp1 = Object.create(null);
 var vp2 = Object.create(null);
 var vp3 = Object.create(null);

/**
 * Main stage and layers
 * @type {*}
 */
PovGridDesigner.MainStage = Object.create(null);
PovGridDesigner.MainLayer = Object.create(null);
PovGridDesigner.BaseLayer = Object.create(null);
PovGridDesigner.TouchLayer = Object.create(null);

PovGridDesigner.GridColorIndex = Object.create(null);
PovGridDesigner.CurrentLineDensity = Object.create(null);
PovGridDesigner.segmentParams = Object.create(null);
PovGridDesigner.VPAttributes = Object.create(null);
PovGridDesigner.GeneralShapeAttributes = Object.create(null);
PovGridDesigner.WorkspaceSettings = Object.create(null);
PovGridDesigner.exportGridDocument = Object.create(null);
PovGridDesigner.groupId = new Array("gpVanishPoint1", "gpVanishPoint2", "gpVanishPoint3", "gpTraceLines", "gpPerspLines1", "gpPerspLines2", "gpPerspLines3");
PovGridDesigner.groupIdEnum = {
        VanishPoint1 : 0,
        VanishPoint2 : 1,
        VanishPoint3 : 2,
        TraceLines   : 3,
        PerspLines1  : 4,
        PerspLines2  : 5,
        PerspLines3  : 6
    };
PovGridDesigner.shapeId = new Array("shpVP1", "shpVP2", "shpVP3", "shpHorizon", "shpDocument", "shpTraceLine1", "shpTraceLine2","shpTouchAnim");
PovGridDesigner.shapeIdEnum = {
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
Object.defineProperties(PovGridDesigner.exportGridDocument, {
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
 *  Parameter to keep track of the grid color index. This marks the first color in the sequence
 */
Object.defineProperties(PovGridDesigner.GridColorIndex, {
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
Object.defineProperties(PovGridDesigner.CurrentLineDensity, {
    value:   {
        value:        5
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
Object.defineProperties(PovGridDesigner.segmentParams, {
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
Object.defineProperties(PovGridDesigner.WorkspaceSettings, {
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

Object.defineProperties(PovGridDesigner.GeneralShapeAttributes,
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
Object.defineProperties(PovGridDesigner.VPAttributes,
{
    fillColor:
    {
          value:        '#DAFA0A'
        , writable:     true
        , configurable: true
        , enumerable:   true
    }

    ,strokeColor:
    {
          value:        '#9FB030'
        , writable:     true
        , configurable: true
        , enumerable:   true 
    }

    ,radius:
    {
          value:        13
        , writable:     true
        , configurable: true
        , enumerable:   true 
    }   

    ,strokeWidth:
    {
          value:        2
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
PovGridDesigner.Coordinate = function (xPos, yPos)
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
PovGridDesigner.LineCoordinate = function (x1Pos, y1Pos, x2Pos, y2Pos)
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
PovGridDesigner.DocumentObject = function (dWidth, dHeight, hexFillColor, docName)
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
PovGridDesigner.GetNode = function (shapeId)
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
        LogError('ShapeID: ' + node.attrs.id);
        return node;
    }
}

/**
 *
 * @param objectID
 * @returns {boolean}
 */
PovGridDesigner.NodeExists = function (objectID)
{
    var results = true;

    try
    {
        var node = PovGridDesigner.GetNode(objectID);

        if(typeof variable_here === 'undefined'){
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
