/**
 *************************************************************
 * POVGRID global object/property definition file
 * Created 04/03/2013
 *************************************************************
 */

/* Declaration */
var segmentParams = Object.create(null);
var vpDefaultAttrs = Object.create(null);
var vpStage = Object.create(null);
var vpShape = Object.create(null);
var vp1 = Object.create(null);
var vp2 = Object.create(null);
var vp3 = Object.create(null);
var workspaceSettings = Object.create(null);
var gridDocument = Object.create(null);
var lineWidth = .5;

// Object properties
/**
 *  Parameters grid document.
 *  This is the document that will get exported as an image after
 *  the grid and vanishing points are in place.
 */
Object.defineProperties(gridDocument, {
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
Object.defineProperties(segmentParams, {
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
Object.defineProperties(workspaceSettings, { 
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

Object.defineProperties(vpDefaultAttrs,
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
          value:        1
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
*/  
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

/** END PROPERTY DEFINITIONS */

/** OBJECT DEFINITION */

// Coordinate object
function Coordinate(xPos, yPos)
{
    return  {x: xPos || 0, y: yPos || 0};
}

function DocumentObject(dWidth, dHeight, hexColor)
{
    hexColor = hexColor || "#ffffff";
    dWidth = dWidth || 512;
    dHeight = dHeight || 384;
    return {width: dWidth, height: dHeight, backgroundColor: hexColor}
}