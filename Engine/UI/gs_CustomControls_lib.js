/**
 * Custom Controls Library
 * User: John
 * Date: 1/1/14
 * Time: 4:18 PM
 */

function GetSourcePointMenu()
{
    var menu = null;

    var x = (GSDesigner.MainStage.attrs.width - 75) / 2;
    var y = (GSDesigner.MainStage.attrs.height - 75) / 2;
    var percent = 66;

    try
    {
// vars that define the arcs for the chart
        var radius = 75;
        var outerStrokeWidth = 25;
        var innerStrokeWidth = 6;
        var width = height = radius + outerStrokeWidth;

        var PI = Math.PI;
        var startAngle = -PI / 2;
        var endAngle = 2 * PI * percent / 100 - PI / 2;
        var cx = width / 2;
        var cy = height / 2;

        var menu = new Kinetic.Group({
            x: x,
            y: y,
            width: width,
            height: height,
            draggable: true
        });

        var fullArc = new Kinetic.Shape({
            drawFunc: function (context) {
                context.beginPath();
                context.arc(cx, cy, radius, 0, Math.PI * 2, false);
                context.closePath();
                context.fillStrokeShape(this);
            },
            stroke: 'rgb(28,119,255)',
            strokeWidth: outerStrokeWidth,
            opacity: 0.1
        });
        menu.add(fullArc);

        var outerBorder = new Kinetic.Shape({
            drawFunc: function (context) {
                context.beginPath();
                context.arc(cx, cy, radius + 12, 0, Math.PI * 2, false);
                context.fillStrokeShape(this);
            },
            stroke: 'rgb(28,119,255)',
            strokeWidth: 0.5,
            shadowBlur: 15,
            opacity: 0.4
        });
        menu.add(outerBorder);

        var innerBorder = new Kinetic.Shape({
            drawFunc: function (context) {
                context.beginPath();
                context.arc(cx, cy, radius - 12, 0, Math.PI * 2, false);
                context.fillStrokeShape(this);
            },
            stroke: 'rgb(28,119,255)',
            strokeWidth: 0.5,
            opacity: 0.4
        });
        menu.add(innerBorder);

        var innerArc = new Kinetic.Shape({
            drawFunc: function (context) {
                context.beginPath();
                context.arc(cx, cy, this.radius+1, startAngle, endAngle, false);
                context.fillStrokeShape(this);
            },
            stroke: 'purple',
            strokeWidth: innerStrokeWidth
        });
        // calc the inner radius
        innerArc.radius = radius - outerStrokeWidth / 2 + innerStrokeWidth / 2;
        menu.add(innerArc);

    }
    catch (ex)
    {
        //LOG ERROR
        LogError(ex.message + ' [' + arguments.callee.name + ']');
    }
    finally
    {
        return menu;
    }
}