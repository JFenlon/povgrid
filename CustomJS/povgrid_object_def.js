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
    version     : 1.0,
    MainLayer   : "lyrMain",

    // public method
    getVersion: function(){ return 'Version ' + this.version; }
};

/**
 var vp1 = Object.create(null);
 var vp2 = Object.create(null);
 var vp3 = Object.create(null);
 */
PovGridDesigner.segmentParams = Object.create(null);
PovGridDesigner.DefaultAttributes = Object.create(null);
PovGridDesigner.MainStage = Object.create(null);
PovGridDesigner.workspaceSettings = Object.create(null);
PovGridDesigner.exportGridDocument = Object.create(null);
PovGridDesigner.groupId = new Array("gpMain", "gpHorizon", "gpTraceLines", "gpVanishPoint1", "gpVanishPoint2", "gpVanishPoint3", "gpPerspLines1", "gpPerspLines2", "gpPerspLines3");
PovGridDesigner.groupIdEnum = {
        Main         : 0,
        Horizon      : 1,
        TraceLines   : 2,
        VanishPoint1 : 3,
        VanishPoint2 : 4,
        VanishPoint3 : 5,
        PerspLines1  : 6,
        PerspLines2  : 7,
        PerspLines3  : 8
    };
PovGridDesigner.shapeId = new Array("shpVP1", "shpVP2", "shpVP3", "shpHorizon", "shpDocument", "shpTraceLine1", "shpTraceLine2");
PovGridDesigner.shapeIdEnum = {
        VP1        : 0,
        VP2        : 1,
        VP3        : 2,
        Horizon    : 3,
        Document   : 4,
        TraceLine1 : 5,
        TraceLine2 : 6
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
Object.defineProperties(PovGridDesigner.workspaceSettings, {
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

/**
Object.defineProperties(vp1,
{
    posX:
    {
          value:        0
        , writable:     true
        , configurable: true
        , enumerable:   true
    }

    ,posY:
    {
          value:        0
        , writable:     true
        , configurable: true
        , enumerable:   true 
    }  

    ,id:
    {
          value:        'vp1'
        , writable:     false
        , configurable: false
        , enumerable:   true 
    }              
});

Object.defineProperties(vp2,
{
    posX:
    {
          value:        0
        , writable:     true
        , configurable: true
        , enumerable:   true
    }

    ,posY:
    {
          value:        0
        , writable:     true
        , configurable: true
        , enumerable:   true 
    }

    ,id:
    {
          value:        'vp2'
        , writable:     false
        , configurable: false
        , enumerable:   true 
    }      
});

Object.defineProperties(vp3,
{
    posX:
    {
          value:        0
        , writable:     true
        , configurable: true
        , enumerable:   true
    }

    ,posY:
    {
          value:        0
        , writable:     true
        , configurable: true
        , enumerable:   true 
    }

    ,id:
    {
          value:        'vp3'
        , writable:     false
        , configurable: false
        , enumerable:   true 
    }      
});
 */

Object.defineProperties(PovGridDesigner.DefaultAttributes,
{
    fillColor:
    {
          value:        'yellow'
        , writable:     true
        , configurable: true
        , enumerable:   true
    }

    ,strokeColor:
    {
          value:        '#3D3D3D'
        , writable:     true
        , configurable: true
        , enumerable:   true 
    }

    ,radius:
    {
          value:        10
        , writable:     true
        , configurable: true
        , enumerable:   true 
    }   

    ,strokeWidth:
    {
          value:        .5
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


/**
* This is the shape container element that will hold
* details about each shape. This container will be
* added to a collection of shape containers and maintained
* at all times.

Object.defineProperties(vpShape,
{
    shapeID:
    {
          value:        'id'
        , writable:     true
        , configurable: true
        , enumerable:   true
    }

    ,isTouchHandle:
    {
          value:        false
        , writable:     true
        , configurable: true
        , enumerable:   true 
    }

    ,isAnchoredtoVP:
    {
          value:        false
        , writable:     true
        , configurable: true
        , enumerable:   true 
    }   

    ,vpAnchorID:
    {
          value:        null
        , writable:     true
        , configurable: true
        , enumerable:   true 
    }  

    ,shapeAnchorID:
    {
          value:        null
        , writable:     true
        , configurable: true
        , enumerable:   true
    }
});
 */

/** END PROPERTY DEFINITIONS */

/** OBJECT DEFINITION */

// Coordinate object
PovGridDesigner.Coordinate = function (xPos, yPos)
{
    return  {x: xPos || 0, y: yPos || 0};
}

PovGridDesigner.GetNode = function (shapeId)
{
    var node = Kinetic.Shape;

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

// Public methods
PovGridDesigner.DocumentObject = function (dWidth, dHeight, hexColor)
{
    hexColor = hexColor || "#ffffff";
    dWidth = dWidth || 512;
    dHeight = dHeight || 384;
    return {width: dWidth, height: dHeight, backgroundColor: hexColor}
}