/**
 *************************************************************
 * POVGRID Custom generic functions library
 * Created 06/24/2013
 *************************************************************
 */

// Simple, returns the DOM element that matches the passed ID
function getDomElement( id ) {
    return document.getElementById( id );
}

function getDocumentHeight()
{
    return Math.max(
        $(document).height(),
        $(window).height(),
        /* For opera: */
        document.documentElement.clientHeight
    );
}

function LogError(message)
{
    var logFile = Lawnchair({name:'logFile'},function(e){
        console.log('storage open');
    });
    var nowDate = new Date(new Date().getTime());
    var logMsg = {message:message,timeStamp:nowDate.toString()};

    logFile.nuke();
    logFile.save({value:logMsg});

    console.log('write done');

    //Retrieve log data
     logFile.all(function(arrRecords){
		for(var i = 0; i<arrRecords.length;i++)
		{
			console.log('[' + arrRecords[i].value.timeStamp + '] | ' + arrRecords[i].value.message);
		}
	});
}