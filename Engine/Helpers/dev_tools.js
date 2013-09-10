/**
 * Created with JetBrains WebStorm.
 * User: John.Fenlon
 * Date: 8/9/13
 * Time: 11:42 AM
 * To change this template use File | Settings | File Templates.
 */


/**
 * DEV ONLY!!!
 */
function CreateDebugWindow()
{
    /** TEST CODE */
    var label = new Kinetic.Label({
        x: 0,
        y: 380,
        height: 400,
        opacity: 0.5,
        draggable: false
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
        fontSize: 16,
        lineHeight: 1.2,
        padding: 10,
        fill: 'green',
        width: 275,
        height: 600
    }));

    label.add(new Kinetic.Text({
        y: -250,
        text: 'App Version: ' + GSDesigner.version(),
        fontFamily: 'Courier',
        fontSize: 12,
        lineHeight: 1.2,
        padding: 10,
        fill: 'blue'
    }));

    label.add(new Kinetic.Text({
        y: -220,
        text: 'Mouse Coords:',
        fontFamily: 'Courier',
        fontSize: 12,
        lineHeight: 1.2,
        padding: 10,
        fill: 'blue'
    }));

    label.add(new Kinetic.Text({
        y: -190,
        text: 'Document Size:',
        fontFamily: 'Courier',
        fontSize: 12,
        lineHeight: 1.2,
        padding: 10,
        fill: 'blue'
    }));

    label.add(new Kinetic.Text({
        y: -160,
        text: 'Current VP:',
        fontFamily: 'Courier',
        fontSize: 12,
        lineHeight: 1.2,
        padding: 10,
        fill: 'blue'
    }));

    label.add(new Kinetic.Text({
        y: -130,
        text: 'VP Position:',
        fontFamily: 'Courier',
        fontSize: 12,
        lineHeight: 1.2,
        padding: 10,
        fill: 'blue'
    }));

    label.add(new Kinetic.Text({
        y: -100,
        text: 'Horizon:',
        fontFamily: 'Courier',
        fontSize: 12,
        lineHeight: 1.2,
        padding: 10,
        fill: 'blue'
    }));

    label.add(new Kinetic.Text({
        y: -70,
        text: 'Selected Obj:',
        fontFamily: 'Courier',
        fontSize: 12,
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
        fontSize: 12,
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
        fontSize: 12,
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
        fontSize: 12,
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
        fontSize: 12,
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
        fontSize: 12,
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
        fontSize: 12,
        lineHeight: 1.2,
        padding: 10,
        fill: 'red'
    }));

    var devLayer = new Kinetic.Layer({
        id: 'lyrDev'
    });

    GSDesigner.MainStage.on('mousemove', function(evt) {
        var node = GSDesigner.GetNode("txtCoords");

        node.setText('x = ' + evt.x + ' | y = ' + evt.y);
        GSDesigner.MainStage.draw();
    });

    devLayer.add(label);
    GSDesigner.MainStage.add(devLayer);

    GSDesigner.MainStage.draw();
}


function SetFieldData(fieldLableId, txtData)
{
    var node = GSDesigner.GetNode(fieldLableId);

    node.setText(txtData);
}