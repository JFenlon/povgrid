/**
 * Custom Controls Library
 * User: John
 * Date: 1/1/14
 * Time: 4:18 PM
 */

function GetSourcePointMenu()
{
    var menu = null;

    var x = (GSDesigner.MainStage.attrs.width / 2) - 75;
    var y = (GSDesigner.MainStage.attrs.height / 2) - 75;

    try
    {
        menu = new Kinetic.Group({
            x:  0,
            y:  0,
            width: 130,
            height: GSDesigner.MainStage.attrs.height
        });

        var menuBox = new Kinetic.Rect({
            x: 0,
            y: 0,
            width: 130,
            height: GSDesigner.MainStage.attrs.height,
            stroke: 'rgb(28,119,255)',
            strokeWidth: 0.5,
            fill: 'rgb(28,119,255)',
            opacity: 0.05
        });
        menu.add(menuBox);
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